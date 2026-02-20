import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { STRIPE_PRODUCTS, isProProduct, isOneTimeProduct } from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ isPremium: false, type: null, subscriptionEnd: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ isPremium: false, type: null, subscriptionEnd: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userEmail = claimsData.claims.email as string | undefined;
    if (!userEmail) {
      return new Response(
        JSON.stringify({ isPremium: false, type: null, subscriptionEnd: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find customer by email
    const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
    
    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ isPremium: false, type: null, subscriptionEnd: null }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerId = customers.data[0].id;

    // Check for active Pro subscription (monthly or annual)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    for (const sub of subscriptions.data) {
      const productId = sub.items.data[0]?.price?.product;
      if (isProProduct(productId as string)) {
        const plan = productId === STRIPE_PRODUCTS.proMonthly.productId ? "monthly" : "annual";
        return new Response(
          JSON.stringify({
            isPremium: true,
            type: "subscription",
            plan,
            subscriptionEnd: new Date(sub.current_period_end * 1000).toISOString(),
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Check for one-time purchase (completed checkout sessions)
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "complete",
      limit: 100,
    });

    for (const session of sessions.data) {
      if (session.mode === "payment") {
        // Get line items to check product
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        for (const item of lineItems.data) {
          const priceId = item.price?.id;
          if (priceId) {
            const price = await stripe.prices.retrieve(priceId);
            if (isOneTimeProduct(price.product as string)) {
              return new Response(
                JSON.stringify({
                  isPremium: true,
                  type: "lifetime",
                  subscriptionEnd: null,
                }),
                { headers: { ...corsHeaders, "Content-Type": "application/json" } }
              );
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ isPremium: false, type: null, subscriptionEnd: null }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("check-premium error:", error);
    return new Response(
      JSON.stringify({ isPremium: false, type: null, subscriptionEnd: null, error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
