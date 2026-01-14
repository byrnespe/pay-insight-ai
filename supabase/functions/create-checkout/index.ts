import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe price IDs for the three products
const PRICES = {
  one_time: "price_1SnseSIXbwEf8N1FrMOzpqaE",      // $9 one-time
  pro_monthly: "price_1SntVzIXbwEf8N1FkJ9dfKtq",   // $5/month
  pro_annual: "price_1SntZRIXbwEf8N1FqkoBg99g",    // $49/year
};

type PriceType = "one_time" | "pro_monthly" | "pro_annual";

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    });

    const { priceType, email: providedEmail } = await req.json() as { priceType: PriceType; email?: string };
    const origin = req.headers.get("origin") || "http://localhost:5173";
    
    logStep("Request received", { priceType, providedEmail });

    // Validate price type
    if (!priceType || !PRICES[priceType]) {
      throw new Error(`Invalid priceType: ${priceType}. Must be one_time, pro_monthly, or pro_annual`);
    }

    // Check if user is authenticated (optional - supports guest checkout)
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    let customerEmail: string | undefined;
    let customerId: string | undefined;
    let userId: string | undefined;

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabaseClient.auth.getUser(token);
      
      if (userData.user?.email) {
        customerEmail = userData.user.email;
        userId = userData.user.id;
        
        // Check if customer exists
        const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        }
        logStep("User authenticated", { email: customerEmail, customerId });
      }
    }

    // If no authenticated user, check if email was provided
    if (!customerEmail && providedEmail) {
      customerEmail = providedEmail;
      const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
      logStep("Guest checkout with email", { email: customerEmail, customerId });
    }

    const priceId = PRICES[priceType];
    const isSubscription = priceType === "pro_monthly" || priceType === "pro_annual";

    logStep("Creating checkout session", { priceId, isSubscription, customerId, customerEmail });

    // Create checkout session with metadata for tracking
    // Guest users will enter email in Stripe Checkout
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/premium?success=true&type=${priceType}`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        product_type: priceType,
        user_id: userId || "guest",
      },
      // Allow promotion codes for marketing
      allow_promotion_codes: true,
    };

    // Enable customer creation for guest checkouts (only valid in payment mode)
    if (!isSubscription && !customerId) {
      sessionConfig.customer_creation = "always";
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
