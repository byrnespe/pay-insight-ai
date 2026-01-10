import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUBSCRIPTION_PRODUCT_ID = "prod_TlPSh6bqmfCjT9";

type ManagerType = "supportive" | "skeptical" | "numbers-focused" | "busy" | "new";
type Tone = "assertive" | "collaborative" | "diplomatic";

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
  percentile75Salary: number;
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

    // Check if user has Pro subscription
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
    const { formData, analysis, managerType, tone }: { 
      formData: SalaryFormData; 
      analysis: SalaryAnalysis;
      managerType: ManagerType;
      tone: Tone;
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const totalComp = formData.currentSalary + formData.bonus;
    const targetSalary = Math.round(analysis.medianSalary * 1.1);

    const managerDescriptions: Record<ManagerType, string> = {
      supportive: "A supportive manager who generally advocates for their team. They want to help but may face budget constraints or need justification for higher-ups.",
      skeptical: "A skeptical manager who questions everything and needs solid proof. They may push back on claims and want detailed evidence before agreeing.",
      "numbers-focused": "A data-driven manager who only responds to metrics, ROI, and concrete numbers. Emotional appeals don't work; they need spreadsheet-ready justification.",
      busy: "An extremely busy manager with limited time. They need concise, high-impact points and may try to defer the conversation. You need to be efficient and persistent.",
      new: "A new manager who may not know the employee's full history or contributions. They need context but also don't want to inherit problems. They may defer to HR or precedent."
    };

    const toneDescriptions: Record<Tone, string> = {
      assertive: "Confident and direct. State your worth clearly without hedging. Use 'I expect' and 'I will need' language.",
      collaborative: "Partnership-focused. Frame it as solving a problem together. Use 'we' language and acknowledge their constraints.",
      diplomatic: "Polite but firm. Acknowledge the situation's complexity while still advocating for yourself. Use softer language but maintain your position."
    };

    const systemPrompt = `You are an expert salary negotiation coach specializing in adapting communication styles to different manager personalities.

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "managerScript": {
    "managerType": string,
    "tone": string,
    "opening": string (2-3 sentences tailored to this manager type),
    "valueProposition": string (3-4 sentences with evidence style matching the manager),
    "askStatement": string (the specific ask, framed for this manager),
    "handlePushback": string (2-3 sentences anticipating this manager's likely objections),
    "closing": string (2-3 sentences matching the tone)
  },
  "tips": string[] (5 specific tips for dealing with this manager type),
  "warnings": string[] (3 things to avoid with this manager type),
  "openingVariations": string[] (3 alternative opening lines)
}

Be specific and practical. Write scripts they can use word-for-word.`;

    const userPrompt = `Create a manager-specific negotiation script for:

Role: ${formData.jobTitle}
Industry: ${formData.industry}
Location: ${formData.location}
Experience: ${formData.yearsExperience} years
Current Total Comp: $${totalComp.toLocaleString()}
Market Median: $${analysis.medianSalary.toLocaleString()}
75th Percentile: $${analysis.percentile75Salary.toLocaleString()}
Target Salary: $${targetSalary.toLocaleString()}
Market Position: ${analysis.verdict} by ${Math.abs(analysis.differencePercent)}%
Negotiation Leverage: ${analysis.negotiationLeverage}

MANAGER TYPE: ${managerType}
${managerDescriptions[managerType]}

TONE: ${tone}
${toneDescriptions[tone]}

Create a complete negotiation script tailored specifically for this manager type and tone combination. Include practical tips and warnings specific to this manager personality.`;

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
    console.error("generate-manager-scripts error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
