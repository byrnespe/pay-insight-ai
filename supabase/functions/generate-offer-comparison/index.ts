import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { STRIPE_PRODUCTS, isProProduct } from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[OFFER-COMPARISON] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    // Verify Pro subscription
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user?.email) {
      throw new Error("User not authenticated");
    }
    logStep("User authenticated", { email: userData.user.email });

    // Check Stripe subscription
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: userData.user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      throw new Error("Pro subscription required");
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: "active",
      limit: 10,
    });

    // Check for either monthly or annual Pro subscription
    const hasProSubscription = subscriptions.data.some((sub: any) =>
      sub.items.data.some((item: any) => isProProduct(item.price.product as string))
    );

    if (!hasProSubscription) {
      throw new Error("Pro subscription required");
    }
    logStep("Pro subscription verified");

    const { currentRole, newOffer } = await req.json();
    logStep("Request data", { currentRole, newOffer });

    // Call Lovable AI to generate comparison
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY not set");

    const prompt = `You are a career advisor helping someone compare job offers. Generate a detailed comparison analysis.

Current Role:
- Title: ${currentRole.title}
- Base Salary: $${currentRole.baseSalary}
- Bonus: $${currentRole.bonus || 0}
- Benefits: ${currentRole.benefits || "Not specified"}
- Work Style: ${currentRole.workStyle || "Not specified"}
- Commute: ${currentRole.commute || "N/A"} minutes

New Offer:
- Title: ${newOffer.title}
- Company: ${newOffer.company}
- Base Salary: $${newOffer.baseSalary}
- Bonus: $${newOffer.bonus || 0}
- Signing Bonus: $${newOffer.signingBonus || 0}
- Benefits: ${newOffer.benefits || "Not specified"}
- Work Style: ${newOffer.workStyle || "Not specified"}
- Commute: ${newOffer.commute || "N/A"} minutes

Provide a comprehensive comparison in this JSON format:
{
  "summary": {
    "salaryDifference": "Formatted string like '+$15,000/year (+12%)'",
    "totalCompDifference": "Formatted string including bonus",
    "verdict": "ACCEPT", "NEGOTIATE", or "DECLINE",
    "confidenceLevel": "high", "medium", or "low"
  },
  "financialAnalysis": {
    "yearOneValue": "Total value in year one including signing bonus",
    "yearTwoPlus": "Ongoing annual value after year one",
    "hiddenCosts": ["List of potential hidden costs like commute, less PTO, etc."],
    "lifetimeImpact": "5-year projection explanation"
  },
  "qualitativeFactors": [
    {
      "factor": "Factor name",
      "currentScore": 1-10,
      "newScore": 1-10,
      "analysis": "Brief analysis"
    }
  ],
  "riskAnalysis": {
    "risks": ["List of risks with taking the new offer"],
    "opportunities": ["List of opportunities"],
    "marketTiming": "Analysis of job market timing"
  },
  "negotiationLeverage": {
    "leverageLevel": "high", "medium", or "low",
    "suggestedCounterOffer": "Specific counter-offer suggestion",
    "talkingPoints": ["Key negotiation points"]
  },
  "recommendation": {
    "decision": "Detailed recommendation",
    "nextSteps": ["Actionable next steps"],
    "questionsToAsk": ["Questions to ask the new employer"]
  }
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert career advisor and compensation analyst. Always respond with valid JSON only, no markdown."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      logStep("AI API error", { error: errorText });
      throw new Error("Failed to generate comparison");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    logStep("AI response received");

    // Parse the JSON response
    let comparison;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        comparison = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      logStep("Parse error", { error: parseError, content });
      throw new Error("Failed to parse AI response");
    }

    logStep("Comparison generated successfully");

    return new Response(JSON.stringify(comparison), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error instanceof Error && error.message.includes("subscription") ? 403 : 500,
    });
  }
});
