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
  console.log(`[SAVE-REPORT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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
        logStep("Found customer by email", { customerId: customers.data[0].id });
        customerId = customers.data[0].id;
      } else {
        logStep("No Stripe customer found by email", { email: userEmail });
      }
    }

    if (!customerId) {
      return new Response(
        JSON.stringify({ error: "Pro subscription required to save reports" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for active Pro subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    const hasProSubscription = subscriptions.data.some((sub: { items: { data: Array<{ price: { product: string } }> } }) =>
      sub.items.data.some((item: { price: { product: string } }) =>
        isProProduct(item.price.product as string)
      )
    );

    logStep("Pro subscription check", { hasProSubscription });

    if (!hasProSubscription) {
      return new Response(
        JSON.stringify({ error: "Pro subscription required to save reports" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { formData, analysis } = await req.json();

    if (!formData || !analysis) {
      return new Response(
        JSON.stringify({ error: "Missing formData or analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role for insert (to bypass RLS during insert with specific user_id)
    const supabaseAdmin2 = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already has 20 reports (limit)
    const { count } = await supabaseAdmin2
      .from("saved_reports")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (count && count >= 20) {
      return new Response(
        JSON.stringify({ error: "Maximum of 20 saved reports reached. Please delete some to save new ones." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert the report
    const { data: savedReport, error: insertError } = await supabaseAdmin2
      .from("saved_reports")
      .insert({
        user_id: userId,
        current_salary: formData.currentSalary,
        bonus: formData.bonus || 0,
        years_experience: formData.yearsExperience,
        hours_per_week: formData.hoursPerWeek,
        location: formData.location,
        job_title: formData.jobTitle,
        company: formData.company || null,
        stress_level: formData.stressLevel,
        job_satisfaction: formData.jobSatisfaction,
        analysis_result: analysis,
      })
      .select()
      .single();

    if (insertError) {
      logStep("Insert error", { error: insertError.message });
      return new Response(
        JSON.stringify({ error: "Failed to save report" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Report saved successfully", { reportId: savedReport.id });

    return new Response(
      JSON.stringify({ success: true, reportId: savedReport.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Save report error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
