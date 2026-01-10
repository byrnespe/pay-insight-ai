import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
      apiVersion: "2023-10-16",
    });

    const { priceType } = await req.json();
    const origin = req.headers.get("origin") || "http://localhost:5173";

    // Create or get the product
    const products = await stripe.products.list({ limit: 10, active: true });
    let product = products.data.find((p: Stripe.Product) => p.name === "Underpaid Premium Insights");
    
    if (!product) {
      product = await stripe.products.create({
        name: "Underpaid Premium Insights",
        description: "Negotiation script, talking points, alternative roles, and exportable PDF report",
      });
    }

    // Create or get the price
    const prices = await stripe.prices.list({ product: product.id, active: true });
    let price = prices.data.find((p: Stripe.Price) => p.unit_amount === 900 && p.type === "one_time");
    
    if (!price) {
      price = await stripe.prices.create({
        product: product.id,
        unit_amount: 900, // $9.00
        currency: "usd",
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      success_url: `${origin}/premium?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("create-checkout error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
