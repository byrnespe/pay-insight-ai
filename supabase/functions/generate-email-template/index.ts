import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEMPLATE_CATEGORIES = {
  raise_request: {
    name: "Raise Request",
    description: "Initial request for a salary increase",
    prompts: [
      "Recent accomplishments or results",
      "Time since last raise",
      "Market rate research findings"
    ]
  },
  offer_counter: {
    name: "Offer Counter-Proposal", 
    description: "Responding to a job offer with a counter",
    prompts: [
      "Original offer details",
      "Your target compensation",
      "Key leverage points"
    ]
  },
  denial_followup: {
    name: "Following Up After Denial",
    description: "Professional response when a raise is declined",
    prompts: [
      "Reason given for denial",
      "What you're asking for next",
      "Timeline for revisiting"
    ]
  },
  offer_acceptance: {
    name: "Offer Acceptance",
    description: "Accepting an offer with negotiated terms",
    prompts: [
      "Final agreed terms",
      "Start date",
      "Any remaining items to confirm"
    ]
  },
  offer_decline: {
    name: "Declining an Offer",
    description: "Professionally turning down an opportunity",
    prompts: [
      "Reason for declining (optional)",
      "Maintain relationship emphasis"
    ]
  },
  promotion_request: {
    name: "Promotion Request",
    description: "Requesting advancement to a new role",
    prompts: [
      "Target role/title",
      "Qualifications and achievements",
      "Business case for promotion"
    ]
  },
  reference_request: {
    name: "Reference Request",
    description: "Asking a colleague or manager to be a reference",
    prompts: [
      "Your relationship to them",
      "Role you're applying for",
      "Specific skills to highlight"
    ]
  }
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { category, context } = await req.json();

    if (!category || !TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES]) {
      return new Response(
        JSON.stringify({ error: "Invalid template category" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const templateConfig = TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES];

    // Call Lovable AI to generate the template
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a professional career advisor helping craft workplace emails. Generate a professional, direct email template based on the user's situation. 

Guidelines:
- Be professional but not stiff
- Be direct and clear about the ask
- Avoid sycophantic language or excessive pleasantries
- Keep it concise (under 200 words typically)
- Include [PLACEHOLDER] brackets for any specific details the user should fill in
- Do not include a subject line unless asked
- Focus on the specific scenario: ${templateConfig.name}`;

    const userPrompt = `Generate a ${templateConfig.name} email template.

Context provided:
${context || "No specific context provided."}

Template purpose: ${templateConfig.description}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to generate template");
    }

    const aiResult = await response.json();
    const template = aiResult.choices?.[0]?.message?.content || "";

    console.log(`Email template generated for user ${user.id}: category ${category}`);

    return new Response(
      JSON.stringify({
        template,
        category: templateConfig.name,
        prompts: templateConfig.prompts,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error generating email template:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate email template" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
