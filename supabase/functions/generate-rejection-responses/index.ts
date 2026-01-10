import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Stripe product IDs
const SUBSCRIPTION_PRODUCT_ID = "prod_TlPSh6bqmfCjT9";

interface SalaryFormData {
  jobTitle: string;
  industry: string;
  location: string;
  yearsExperience: number;
  currentSalary: number;
  bonus: number;
}

interface SalaryAnalysis {
  medianSalary: number;
  difference: number;
  differencePercent: number;
  verdict: string;
  negotiationLeverage: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user is a Pro subscriber
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
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
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has Pro subscription (not just one-time)
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) {
      throw new Error("Stripe not configured");
    }

    const Stripe = (await import("https://esm.sh/stripe@18.5.0")).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-08-27.basil" });

    const customers = await stripe.customers.list({ email: userData.user.email, limit: 1 });
    if (customers.data.length === 0) {
      return new Response(
        JSON.stringify({ error: "Pro subscription required for this feature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    const hasProSubscription = subscriptions.data.some((sub: { items: { data: Array<{ price: { product: string } }> } }) => 
      sub.items.data.some((item: { price: { product: string } }) => item.price.product === SUBSCRIPTION_PRODUCT_ID)
    );

    if (!hasProSubscription) {
      return new Response(
        JSON.stringify({ error: "Pro subscription required for this feature" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { formData, analysis, scenario }: { 
      formData: SalaryFormData; 
      analysis: SalaryAnalysis;
      scenario?: string;
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const totalComp = formData.currentSalary + formData.bonus;
    const targetSalary = Math.round(analysis.medianSalary * 1.1);

    const systemPrompt = `You are an expert salary negotiation coach. Generate specific, battle-tested responses for handling rejection and objections during salary negotiations.

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "responses": [
    {
      "scenario": string (the specific objection or "no" scenario),
      "objection": string (what the employer might say),
      "response": string (your recommended response, 2-4 sentences),
      "followUp": string (what to say next or do after, 1-2 sentences)
    }
  ]
}

Provide exactly 6 responses covering common negotiation rejections. Be specific, direct, and confident. No weak language.`;

    const userPrompt = scenario 
      ? `Generate a specific response for this negotiation scenario:

Role: ${formData.jobTitle}
Industry: ${formData.industry}
Current Comp: $${totalComp.toLocaleString()}
Target: $${targetSalary.toLocaleString()}
Market Position: ${analysis.verdict} by ${Math.abs(analysis.differencePercent)}%

Specific scenario to address: "${scenario}"

Generate 6 variations of responses for this exact scenario, with different tones (assertive, collaborative, diplomatic, etc.).`
      : `Generate "What if they say no?" responses for this person:

Role: ${formData.jobTitle}
Industry: ${formData.industry}
Location: ${formData.location}
Experience: ${formData.yearsExperience} years
Current Total Comp: $${totalComp.toLocaleString()}
Target Salary: $${targetSalary.toLocaleString()}
Market Position: ${analysis.verdict} by ${Math.abs(analysis.differencePercent)}%
Negotiation Leverage: ${analysis.negotiationLeverage}

Generate responses for these common objections:
1. "We don't have the budget right now"
2. "That's above our salary band for this role"
3. "You haven't been here long enough"
4. "Let's revisit this during the next review cycle"
5. "We can't make exceptions for one person"
6. "The economy is uncertain right now"

Make each response specific to their situation and salary target.`;

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
          JSON.stringify({ error: "AI service credits exhausted." }),
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

    let result;
    try {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("generate-rejection-responses error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
