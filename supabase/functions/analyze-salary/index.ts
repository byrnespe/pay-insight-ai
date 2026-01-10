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

    const systemPrompt = `You are a salary analysis expert with deep knowledge of compensation data across industries and locations. Your role is to provide honest, data-driven salary assessments.

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "medianSalary": number (estimated market median for this role/location/experience),
  "percentile75Salary": number (75th percentile compensation),
  "difference": number (user salary minus median, can be negative),
  "differencePercent": number (percentage difference from median),
  "verdict": "underpaid" | "overpaid" | "fair",
  "effortToPayRatio": "poor" | "average" | "good" | "excellent",
  "negotiationLeverage": "low" | "medium" | "high",
  "explanation": string (2-3 sentences explaining the analysis in plain English),
  "paths": {
    "negotiate": string (specific negotiation advice for their situation),
    "optimize": string (workload optimization advice based on hours/stress),
    "exit": string (advice on exploring higher-paying roles)
  }
}

Base your analysis on realistic market data for 2024-2025. Consider:
- Cost of living differences by location
- Industry pay scales
- Experience level premiums
- Workload (hours) and stress factors in effort-to-pay ratio
- Job satisfaction as a factor in negotiation leverage

Be direct and honest. If someone is significantly underpaid, say so clearly.`;

    const userPrompt = `Analyze this person's salary situation:

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

Provide a comprehensive salary analysis with market comparisons and actionable recommendations.`;

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

    // Parse the JSON response from the AI
    let analysis;
    try {
      // Clean any potential markdown code blocks
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
