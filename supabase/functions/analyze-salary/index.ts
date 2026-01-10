import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: SalaryFormData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const totalComp = formData.currentSalary + formData.bonus;

    const systemPrompt = `You are Underpaid, an AI compensation and career analyst.

You specialize in:
- Compensation reality checks
- Workload vs pay analysis
- Career leverage assessment
- Plain-English explanations of uncomfortable truths

You are: Direct. Neutral. Data-driven. Honest.
You are NOT: A recruiter. An HR representative. A motivational coach. A financial advisor.

Your job is clarity, not comfort.

LANGUAGE RULES:
- Never say: "You should", "Guaranteed", "Best option", "Definitely", "Financial advice"
- Use: "This suggests...", "This indicates...", "One option may be...", "A trade-off to consider..."
- No emojis. No motivational fluff. No HR jargon.

TONE: Sound like a calm, intelligent friend telling them the truth they already suspected.

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "medianSalary": number (estimated market median - reasonable estimate, not guarantee),
  "percentile75Salary": number (75th percentile compensation estimate),
  "difference": number (user total comp minus median, negative if underpaid),
  "differencePercent": number (percentage difference from median),
  "stressAdjustedCompensation": number (effective hourly rate: total_comp / (hours * 52) adjusted for stress),
  "verdict": "underpaid" | "overpaid" | "fair",
  "effortToPayRatio": "poor" | "average" | "good" | "excellent",
  "negotiationLeverage": "low" | "medium" | "high",
  "explanation": string (2-4 sentences: the reality check. How their comp compares, impact of hours/stress, any mismatch. This should feel like a mirror, not motivation.),
  "paths": {
    "negotiate": string (when it makes sense + one trade-off to consider),
    "optimize": string (when it makes sense + one trade-off to consider),
    "exit": string (when it makes sense + one trade-off to consider)
  }
}

ANALYSIS REQUIREMENTS:

1. Market Compensation Reality
- Estimate median and 75th percentile based on role, location, industry, experience
- Frame as reasonable estimates, not guarantees
- Consider cost of living, industry pay scales, experience premiums

2. Effort-to-Pay Ratio
- Analyze effective hourly compensation
- High hours + high stress + average pay = red flag
- Stress reduces effective value of compensation

3. Leverage Assessment
- Consider skill transferability, replaceability risk, market demand
- Low leverage = limited options. High leverage = strong position.

If uncertainty exists, acknowledge it but still give a directional conclusion. Indecision is worse than imperfect clarity.`;

    const userPrompt = `Analyze this compensation situation:

Job Title: ${formData.jobTitle}
Industry: ${formData.industry}
Location: ${formData.location}
Years of Experience: ${formData.yearsExperience}
Annual Base Salary: $${formData.currentSalary.toLocaleString()}
Annual Bonus/Commission: $${formData.bonus.toLocaleString()}
Total Compensation: $${totalComp.toLocaleString()}
Hours Worked Per Week: ${formData.hoursPerWeek}
Stress Level: ${formData.stressLevel}/10
Job Satisfaction: ${formData.jobSatisfaction}/10

Provide a reality check. Be direct. If they are underpaid, say so clearly. If their workload undermines their pay, say so. No comfort, just clarity.`;

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

    let analysis;
    try {
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("analyze-salary error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
