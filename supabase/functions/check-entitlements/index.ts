import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { STRIPE_PRODUCTS, isProProduct } from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-ENTITLEMENTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) throw new Error("Invalid or expired token");

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email as string | undefined;
    if (!userEmail) throw new Error("User email not available in token");
    logStep("User authenticated", { userId, email: userEmail });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Check if customer exists in Stripe
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, returning default entitlements");
      return new Response(JSON.stringify({
        entitlements: getDefaultEntitlements(),
        hasOneTimePurchase: false,
        hasActiveSubscription: false,
        subscriptionPlan: null,
        subscriptionEnd: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for active subscriptions (Pro)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    let hasActiveSubscription = false;
    let subscriptionPlan: "monthly" | "annual" | null = null;
    let subscriptionEnd: string | null = null;

    for (const subscription of subscriptions.data) {
      const productId = subscription.items.data[0]?.price?.product;
      
      if (productId === STRIPE_PRODUCTS.proMonthly.productId) {
        hasActiveSubscription = true;
        subscriptionPlan = "monthly";
        if (subscription.current_period_end) {
          subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }
        logStep("Found monthly subscription", { subscriptionId: subscription.id });
        break;
      } else if (productId === STRIPE_PRODUCTS.proAnnual.productId) {
        hasActiveSubscription = true;
        subscriptionPlan = "annual";
        if (subscription.current_period_end) {
          subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
        }
        logStep("Found annual subscription", { subscriptionId: subscription.id });
        break;
      }
    }

    // Check for completed one-time purchases
    let hasOneTimePurchase = false;
    
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 100,
    });

    for (const session of sessions.data) {
      if (session.payment_status === "paid" && session.mode === "payment") {
        // Check if this was for the one-time product
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
        for (const item of lineItems.data) {
          const priceId = item.price?.id;
          const productId = item.price?.product;
          
          if (productId === STRIPE_PRODUCTS.oneTime.productId || priceId === STRIPE_PRODUCTS.oneTime.priceId) {
            hasOneTimePurchase = true;
            logStep("Found one-time purchase", { sessionId: session.id });
            break;
          }
        }
        if (hasOneTimePurchase) break;
      }
    }

    // Also check for lifetime purchases via old "lifetime" product (backward compatibility)
    if (!hasOneTimePurchase) {
      const oldSessions = await stripe.checkout.sessions.list({
        customer: customerId,
        limit: 100,
      });
      
      for (const session of oldSessions.data) {
        if (session.payment_status === "paid" && session.mode === "payment") {
          // Any completed payment mode checkout counts as one-time purchase
          hasOneTimePurchase = true;
          logStep("Found legacy one-time purchase", { sessionId: session.id });
          break;
        }
      }
    }

    const entitlements = mergeEntitlements(hasOneTimePurchase, hasActiveSubscription);

    logStep("Returning entitlements", { 
      hasOneTimePurchase, 
      hasActiveSubscription, 
      subscriptionPlan 
    });

    return new Response(JSON.stringify({
      entitlements,
      hasOneTimePurchase,
      hasActiveSubscription,
      subscriptionPlan,
      subscriptionEnd,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-entitlements", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function getDefaultEntitlements() {
  return {
    report: { full_analysis: false, export_pdf: false },
    negotiation: { 
      basic_script: false, 
      manager_specific: false, 
      rejection_responses: false, 
      scenario_simulator: false 
    },
    checks: { unlimited: false },
    career: { leverage_tracking: false, exit_readiness: false },
    offers: { comparison_tool: false },
    history: { saved_reports: false },
    pro: { active: false },
  };
}

function mergeEntitlements(hasOneTime: boolean, hasPro: boolean) {
  const base = getDefaultEntitlements();

  // One-time purchase grants permanent report + basic script
  if (hasOneTime) {
    base.report.full_analysis = true;
    base.report.export_pdf = true;
    base.negotiation.basic_script = true;
  }

  // Pro subscription grants all features
  if (hasPro) {
    base.negotiation.basic_script = true;
    base.negotiation.manager_specific = true;
    base.negotiation.rejection_responses = true;
    base.negotiation.scenario_simulator = true;
    base.checks.unlimited = true;
    base.career.leverage_tracking = true;
    base.career.exit_readiness = true;
    base.offers.comparison_tool = true;
    base.history.saved_reports = true;
    base.pro.active = true;
  }

  return base;
}
