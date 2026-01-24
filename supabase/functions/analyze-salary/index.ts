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

interface AggregatedSalaryData {
  government: {
    source: string;
    occupation: string;
    socCode: string;
    location: string;
    percentiles: {
      p10: number;
      p25: number;
      median: number;
      p75: number;
      p90: number;
    };
    dataYear: string;
  } | null;
  webSearch: {
    source: string;
    citations: string[];
    estimatedRange: { min: number; max: number };
    summary: string;
  } | null;
  crowdsourced: {
    source: string;
    sampleSize: number;
    percentiles: { p25: number; median: number; p75: number };
    recency: string;
  } | null;
  benchmark: {
    source: string;
    industry: string;
    level: string;
    location: string;
    range: { min: number; median: number; max: number };
  } | null;
  confidence: "high" | "medium" | "low";
  dataQuality: {
    governmentMatch: boolean;
    webDataAvailable: boolean;
    crowdsourcedSampleSize: number;
    benchmarkMatch: boolean;
  };
}

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ANALYZE-SALARY] ${step}${detailsStr}`);
};

function buildReferenceDataPrompt(data: AggregatedSalaryData): string {
  const sections: string[] = [];
  
  if (data.government) {
    sections.push(`GOVERNMENT DATA (Bureau of Labor Statistics via CareerOneStop):
- Occupation: ${data.government.occupation} (SOC ${data.government.socCode})
- Location: ${data.government.location}
- 10th percentile: $${data.government.percentiles.p10.toLocaleString()}
- 25th percentile: $${data.government.percentiles.p25.toLocaleString()}
- Median: $${data.government.percentiles.median.toLocaleString()}
- 75th percentile: $${data.government.percentiles.p75.toLocaleString()}
- 90th percentile: $${data.government.percentiles.p90.toLocaleString()}
- Data year: ${data.government.dataYear}`);
  }
  
  if (data.webSearch && data.webSearch.estimatedRange.min > 0) {
    sections.push(`WEB SEARCH DATA (Perplexity - sources: Glassdoor, Indeed, Levels.fyi, LinkedIn):
- Estimated salary range: $${data.webSearch.estimatedRange.min.toLocaleString()} - $${data.webSearch.estimatedRange.max.toLocaleString()}
- Summary: ${data.webSearch.summary.slice(0, 300)}
- Sources: ${data.webSearch.citations.slice(0, 3).join(", ")}`);
  }
  
  if (data.crowdsourced && data.crowdsourced.sampleSize >= 3) {
    sections.push(`CROWDSOURCED DATA (n=${data.crowdsourced.sampleSize} similar roles in database):
- 25th percentile: $${data.crowdsourced.percentiles.p25.toLocaleString()}
- Median: $${data.crowdsourced.percentiles.median.toLocaleString()}
- 75th percentile: $${data.crowdsourced.percentiles.p75.toLocaleString()}
- Data freshness: ${data.crowdsourced.recency}`);
  }
  
  if (data.benchmark) {
    sections.push(`STATIC BENCHMARK DATA:
- Industry: ${data.benchmark.industry}, Level: ${data.benchmark.level}, Location: ${data.benchmark.location}
- Range: $${data.benchmark.range.min.toLocaleString()} - $${data.benchmark.range.median.toLocaleString()} - $${data.benchmark.range.max.toLocaleString()} (min/median/max)`);
  }
  
  if (sections.length === 0) {
    return "No reference data available. Use your best judgment based on general market knowledge.";
  }
  
  return `REFERENCE DATA (weight your analysis toward this data, especially government sources):

${sections.join("\n\n")}

DATA CONFIDENCE: ${data.confidence.toUpperCase()}
- Government data: ${data.dataQuality.governmentMatch ? "Available" : "Not available"}
- Web search data: ${data.dataQuality.webDataAvailable ? "Available" : "Not available"}
- Crowdsourced sample: ${data.dataQuality.crowdsourcedSampleSize} entries
- Benchmark match: ${data.dataQuality.benchmarkMatch ? "Yes" : "No"}

IMPORTANT: Use government data as the authoritative baseline when available. Web search and crowdsourced data provide current market context. Adjust estimates based on role specifics.`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: SalaryFormData = await req.json();
    logStep("Request received", { jobTitle: formData.jobTitle, location: formData.location });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Fetch aggregated salary data from all sources
    let aggregatedData: AggregatedSalaryData | null = null;
    
    try {
      logStep("Fetching aggregated salary data...");
      const fetchUrl = `${SUPABASE_URL}/functions/v1/fetch-salary-data`;
      
      const fetchResponse = await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (fetchResponse.ok) {
        aggregatedData = await fetchResponse.json();
        logStep("Aggregated data received", { confidence: aggregatedData?.confidence });
      } else {
        const errorText = await fetchResponse.text();
        logStep("Failed to fetch aggregated data", { status: fetchResponse.status, error: errorText });
      }
    } catch (fetchError) {
      logStep("Error fetching aggregated data", { error: fetchError instanceof Error ? fetchError.message : String(fetchError) });
    }

    const totalComp = formData.currentSalary + formData.bonus;
    
    // Build reference data section for the prompt
    const referenceDataSection = aggregatedData 
      ? buildReferenceDataPrompt(aggregatedData)
      : "No reference data available. Use your best judgment based on general market knowledge.";

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

${referenceDataSection}

You must respond with a valid JSON object (no markdown, no code blocks) with this exact structure:
{
  "medianSalary": number (estimated market median - use reference data as primary source),
  "percentile75Salary": number (75th percentile compensation estimate - use reference data),
  "difference": number (user total comp minus median, negative if underpaid),
  "differencePercent": number (percentage difference from median),
  "stressAdjustedCompensation": number (effective hourly rate: total_comp / (hours * 52) adjusted for stress),
  "verdict": "underpaid" | "overpaid" | "fair",
  "effortToPayRatio": "poor" | "average" | "good" | "excellent",
  "negotiationLeverage": "low" | "medium" | "high",
  "explanation": string (2-4 sentences: the reality check. How their comp compares to the reference data, impact of hours/stress, any mismatch. Cite specific data sources when available.),
  "paths": {
    "negotiate": string (when it makes sense + one trade-off to consider),
    "optimize": string (when it makes sense + one trade-off to consider),
    "exit": string (when it makes sense + one trade-off to consider)
  },
  "dataSources": {
    "government": boolean,
    "webSearch": boolean,
    "crowdsourced": number (sample size, 0 if none),
    "benchmark": boolean
  },
  "confidence": "high" | "medium" | "low",
  "citations": string[] (list of source URLs if available from web search)
}

ANALYSIS REQUIREMENTS:

1. Market Compensation Reality
- Use the REFERENCE DATA as your primary source for salary estimates
- If government data is available, weight it heavily as the authoritative baseline
- Adjust based on web search data for current market conditions
- Consider crowdsourced data for real-world validation

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

Provide a reality check grounded in the reference data. Be direct. If they are underpaid according to the data, say so clearly. If their workload undermines their pay, say so. No comfort, just clarity.`;

    logStep("Calling AI gateway...");
    
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
    
    // Ensure data source fields are present (fallback if AI doesn't include them)
    if (!analysis.dataSources && aggregatedData) {
      analysis.dataSources = {
        government: aggregatedData.dataQuality.governmentMatch,
        webSearch: aggregatedData.dataQuality.webDataAvailable,
        crowdsourced: aggregatedData.dataQuality.crowdsourcedSampleSize,
        benchmark: aggregatedData.dataQuality.benchmarkMatch,
      };
    }
    
    if (!analysis.confidence && aggregatedData) {
      analysis.confidence = aggregatedData.confidence;
    }
    
    if (!analysis.citations && aggregatedData?.webSearch?.citations) {
      analysis.citations = aggregatedData.webSearch.citations;
    }
    
    logStep("Analysis complete", { 
      verdict: analysis.verdict, 
      confidence: analysis.confidence,
      dataSources: analysis.dataSources 
    });

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
