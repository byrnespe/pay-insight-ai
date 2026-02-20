import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { isProProduct } from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: unknown) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GET-SAVED-REPORTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Verify user via JWT claims (no server round-trip)
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      logStep("Invalid token", { error: claimsError?.message });
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;
    const userEmail = claimsData.claims.email as string | undefined;
    logStep("User authenticated", { userId, email: userEmail });

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Try to find Stripe customer - prioritize stripe_customer_id from user metadata
    let customerId: string | null = null;
    
    // Method 1: Check profiles table for stripe_customer_id
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (profile?.stripe_customer_id) {
      logStep("Found stripe_customer_id in profiles table", { customerId: profile.stripe_customer_id });
      customerId = profile.stripe_customer_id;
    }

    // Method 2: Fallback to email lookup
    if (!customerId && userEmail) {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1,
      });

      if (customers.data.length > 0) {
        logStep("Found customer by email", { customerId: customers.data[0].id, email: userEmail });
        customerId = customers.data[0].id;
      } else {
        logStep("No Stripe customer found by email", { email: userEmail });
      }
    }

    if (!customerId) {
      logStep("No Stripe customer found via any method");
      return new Response(
        JSON.stringify({ reports: [], hasAccess: false, reason: "no_customer" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for active Pro subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    logStep("Subscriptions found", { count: subscriptions.data.length });

    const hasProSubscription = subscriptions.data.some((sub: { items: { data: Array<{ price: { product: string } }> } }) =>
      sub.items.data.some((item: { price: { product: string } }) =>
        isProProduct(item.price.product as string)
      )
    );

    logStep("Pro subscription check", { hasProSubscription });

    if (!hasProSubscription) {
      return new Response(
        JSON.stringify({ reports: [], hasAccess: false, reason: "pro_required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch saved reports using service role to bypass RLS
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: reports, error: fetchError } = await supabaseAdmin
      .from("saved_reports")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);

    if (fetchError) {
      logStep("Fetch error", { error: fetchError.message });
      return new Response(
        JSON.stringify({ error: "Failed to fetch reports" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Reports fetched", { count: reports?.length || 0 });

    return new Response(
      JSON.stringify({ reports: reports || [], hasAccess: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Get saved reports error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
