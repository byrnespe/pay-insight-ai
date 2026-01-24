import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { isProProduct } from "../_shared/stripe-config.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SalaryFormData {
  jobTitle: string;
  industry: string;
  location: string;
  yearsExperience: number;
  currentSalary: number;
  bonus: number;
  hoursPerWeek: number;
  stressLevel: number;
  jobSatisfaction: number;
}

interface SalaryAnalysis {
  medianSalary: number;
  percentile75Salary: number;
  difference: number;
  differencePercent: number;
  stressAdjustedCompensation: number;
  verdict: string;
  effortToPayRatio: string;
  negotiationLeverage: string;
  explanation: string;
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[GENERATE-PREMIUM-INSIGHTS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      logStep("No authorization header");
      return new Response(
        JSON.stringify({ error: "Authorization required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user?.email) {
      logStep("Invalid authentication", { error: userError?.message });
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("User authenticated", { email: userData.user.email });

    // Check Pro subscription via Stripe
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      logStep("Stripe not configured");
      throw new Error("Stripe not configured");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: userData.user.email, limit: 1 });
    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(
        JSON.stringify({ error: "Pro subscription required for this feature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    const hasProSubscription = subscriptions.data.some((sub: Stripe.Subscription) =>
      sub.items.data.some((item: Stripe.SubscriptionItem) => isProProduct(item.price.product as string))
    );

    if (!hasProSubscription) {
      logStep("No Pro subscription found");
      return new Response(
        JSON.stringify({ error: "Pro subscription required for this feature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    logStep("Pro subscription verified");

    const { formData, analysis }: { formData: SalaryFormData; analysis: SalaryAnalysis } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const totalComp = formData.currentSalary + formData.bonus;
    const targetSalary = Math.round(analysis.medianSalary * 1.1); // 10% above median

    const systemPrompt = `You are a career negotiation expert and salary coach. You provide specific, actionable advice tailored to each person's situation.

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "negotiationScript": {
    "opening": string (2-3 sentences to open the salary discussion),
    "valueProposition": string (3-4 sentences highlighting their value),
    "askStatement": string (the specific ask with numbers),
    "handlePushback": string (2-3 sentences for handling objections),
    "closing": string (2-3 sentences to close strong)
  },
  "talkingPoints": [
    {
      "point": string (the key point to make),
      "evidence": string (supporting evidence or example),
      "delivery": string (how to present this point)
    }
  ] (provide exactly 5 talking points),
  "alternativeRoles": [
    {
      "title": string (job title),
      "industry": string (industry sector),
      "salaryRange": string (e.g., "$120,000 - $150,000"),
      "salaryIncrease": string (e.g., "+25%"),
      "transitionPath": string (how to transition to this role),
      "keySkills": string[] (3-4 skills needed)
    }
  ] (provide exactly 10 alternative roles with higher pay)
}

Be specific, direct, and professional. No HR jargon. Focus on real, actionable advice.`;

    const userPrompt = `Create premium career insights for this person:

Current Role: ${formData.jobTitle}
Industry: ${formData.industry}
Location: ${formData.location}
Experience: ${formData.yearsExperience} years
Current Total Compensation: $${totalComp.toLocaleString()}
Market Median: $${analysis.medianSalary.toLocaleString()}
75th Percentile: $${analysis.percentile75Salary.toLocaleString()}
Target Salary: $${targetSalary.toLocaleString()} (10% above median)
Current Difference: ${analysis.verdict} by ${Math.abs(analysis.differencePercent)}%
Negotiation Leverage: ${analysis.negotiationLeverage}
Hours/Week: ${formData.hoursPerWeek}
Stress Level: ${formData.stressLevel}/10

Generate:
1. A complete negotiation script they can use word-for-word
2. 5 specific talking points with evidence and delivery tips
3. 10 alternative higher-paying roles they could transition to, considering their current skills and experience`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    let insights;
    try {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      insights = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(insights), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-premium-insights error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
