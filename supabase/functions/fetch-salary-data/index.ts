import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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

// SOC code mapping for common job titles
const SOC_CODES: Record<string, { code: string; title: string }> = {
  "software engineer": { code: "15-1252", title: "Software Developers" },
  "software developer": { code: "15-1252", title: "Software Developers" },
  "data scientist": { code: "15-2051", title: "Data Scientists" },
  "data analyst": { code: "15-2051", title: "Data Scientists" },
  "product manager": { code: "11-2021", title: "Marketing Managers" },
  "project manager": { code: "11-9199", title: "Managers, All Other" },
  "accountant": { code: "13-2011", title: "Accountants and Auditors" },
  "financial analyst": { code: "13-2051", title: "Financial Analysts" },
  "marketing manager": { code: "11-2021", title: "Marketing Managers" },
  "sales manager": { code: "11-2022", title: "Sales Managers" },
  "hr manager": { code: "11-3121", title: "Human Resources Managers" },
  "nurse": { code: "29-1141", title: "Registered Nurses" },
  "physician": { code: "29-1228", title: "Physicians, All Other" },
  "lawyer": { code: "23-1011", title: "Lawyers" },
  "teacher": { code: "25-2031", title: "Secondary School Teachers" },
  "engineer": { code: "17-2199", title: "Engineers, All Other" },
  "designer": { code: "27-1024", title: "Graphic Designers" },
  "ux designer": { code: "27-1021", title: "Commercial and Industrial Designers" },
  "consultant": { code: "13-1111", title: "Management Analysts" },
  "analyst": { code: "13-1111", title: "Management Analysts" },
  "manager": { code: "11-9199", title: "Managers, All Other" },
  "director": { code: "11-1021", title: "General and Operations Managers" },
  "executive": { code: "11-1011", title: "Chief Executives" },
  "ceo": { code: "11-1011", title: "Chief Executives" },
  "cto": { code: "11-3021", title: "Computer and Information Systems Managers" },
  "cfo": { code: "11-3031", title: "Financial Managers" },
};

// Location to state code mapping
const LOCATION_TO_STATE: Record<string, string> = {
  "san francisco": "CA", "bay area": "CA", "sf": "CA", "california": "CA",
  "new york": "NY", "nyc": "NY", "manhattan": "NY",
  "seattle": "WA", "washington": "WA",
  "austin": "TX", "texas": "TX", "dallas": "TX", "houston": "TX",
  "chicago": "IL", "illinois": "IL",
  "boston": "MA", "massachusetts": "MA",
  "denver": "CO", "colorado": "CO",
  "los angeles": "CA", "la": "CA",
  "miami": "FL", "florida": "FL",
  "atlanta": "GA", "georgia": "GA",
  "phoenix": "AZ", "arizona": "AZ",
  "remote": "US", "usa": "US", "united states": "US",
};

// Industry to benchmark ID mapping
const INDUSTRY_MAPPING: Record<string, string> = {
  "technology": "technology", "tech": "technology", "software": "technology", "it": "technology",
  "finance": "finance", "banking": "finance", "fintech": "finance", "financial services": "finance",
  "healthcare": "healthcare", "health": "healthcare", "medical": "healthcare", "pharma": "healthcare",
  "sales": "sales", "business development": "sales",
  "marketing": "marketing", "advertising": "marketing",
  "consulting": "consulting", "management consulting": "consulting",
  "legal": "legal", "law": "legal",
  "education": "education", "teaching": "education", "academia": "education",
  "engineering": "engineering", "mechanical": "engineering", "electrical": "engineering",
  "government": "government", "public sector": "government",
  "retail": "retail", "ecommerce": "retail",
  "manufacturing": "manufacturing", "industrial": "manufacturing",
  "nonprofit": "nonprofit", "non-profit": "nonprofit", "ngo": "nonprofit",
  "media": "media", "entertainment": "media", "journalism": "media",
};

// Location to benchmark ID mapping
const LOCATION_BENCHMARK_MAPPING: Record<string, string> = {
  "san francisco": "sf", "sf": "sf", "bay area": "sf",
  "new york": "nyc", "nyc": "nyc", "manhattan": "nyc",
  "seattle": "seattle",
  "austin": "austin", "denver": "austin",
  "chicago": "chicago", "boston": "chicago",
  "remote": "remote_us",
  "london": "london", "uk": "london",
  "toronto": "toronto", "canada": "toronto",
  "berlin": "berlin", "germany": "berlin",
  "sydney": "sydney", "australia": "sydney",
  "amsterdam": "amsterdam", "netherlands": "amsterdam",
  "singapore": "singapore",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[FETCH-SALARY-DATA] ${step}${detailsStr}`);
};

function findSOCCode(jobTitle: string): { code: string; title: string } | null {
  const normalizedTitle = jobTitle.toLowerCase().trim();
  
  // Direct match
  if (SOC_CODES[normalizedTitle]) {
    return SOC_CODES[normalizedTitle];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(SOC_CODES)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      return value;
    }
  }
  
  return null;
}

function findStateCode(location: string): string {
  const normalizedLocation = location.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(LOCATION_TO_STATE)) {
    if (normalizedLocation.includes(key)) {
      return value;
    }
  }
  
  return "US"; // Default to national data
}

function mapExperienceToLevel(years: number): string {
  if (years <= 2) return "entry";
  if (years <= 5) return "mid";
  if (years <= 10) return "senior";
  if (years <= 15) return "lead";
  return "director";
}

function findIndustryId(industry: string): string | null {
  const normalized = industry.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(INDUSTRY_MAPPING)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  return null;
}

function findLocationId(location: string): string {
  const normalized = location.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(LOCATION_BENCHMARK_MAPPING)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  return "other_us"; // Default
}

// Static benchmark data (subset for edge function - full data in frontend)
const BENCHMARK_DATA: Record<string, Record<string, Record<string, { min: number; median: number; max: number }>>> = {
  technology: {
    entry: { sf: { min: 95000, median: 120000, max: 150000 }, nyc: { min: 90000, median: 114000, max: 142500 }, seattle: { min: 85500, median: 108000, max: 135000 }, austin: { min: 76000, median: 96000, max: 120000 }, chicago: { min: 80750, median: 102000, max: 127500 }, remote_us: { min: 80750, median: 102000, max: 127500 }, other_us: { min: 71250, median: 90000, max: 112500 } },
    mid: { sf: { min: 140000, median: 175000, max: 220000 }, nyc: { min: 133000, median: 166250, max: 209000 }, seattle: { min: 126000, median: 157500, max: 198000 }, austin: { min: 112000, median: 140000, max: 176000 }, chicago: { min: 119000, median: 148750, max: 187000 }, remote_us: { min: 119000, median: 148750, max: 187000 }, other_us: { min: 105000, median: 131250, max: 165000 } },
    senior: { sf: { min: 180000, median: 230000, max: 300000 }, nyc: { min: 171000, median: 218500, max: 285000 }, seattle: { min: 162000, median: 207000, max: 270000 }, austin: { min: 144000, median: 184000, max: 240000 }, chicago: { min: 153000, median: 195500, max: 255000 }, remote_us: { min: 153000, median: 195500, max: 255000 }, other_us: { min: 135000, median: 172500, max: 225000 } },
    lead: { sf: { min: 250000, median: 320000, max: 420000 }, nyc: { min: 237500, median: 304000, max: 399000 }, seattle: { min: 225000, median: 288000, max: 378000 }, austin: { min: 200000, median: 256000, max: 336000 }, chicago: { min: 212500, median: 272000, max: 357000 }, remote_us: { min: 212500, median: 272000, max: 357000 }, other_us: { min: 187500, median: 240000, max: 315000 } },
    director: { sf: { min: 300000, median: 400000, max: 550000 }, nyc: { min: 285000, median: 380000, max: 522500 }, seattle: { min: 270000, median: 360000, max: 495000 }, austin: { min: 240000, median: 320000, max: 440000 }, chicago: { min: 255000, median: 340000, max: 467500 }, remote_us: { min: 255000, median: 340000, max: 467500 }, other_us: { min: 225000, median: 300000, max: 412500 } },
  },
  finance: {
    entry: { sf: { min: 75000, median: 95000, max: 120000 }, nyc: { min: 85000, median: 105000, max: 135000 }, other_us: { min: 56250, median: 71250, max: 90000 } },
    mid: { sf: { min: 120000, median: 150000, max: 190000 }, nyc: { min: 130000, median: 165000, max: 210000 }, other_us: { min: 90000, median: 112500, max: 142500 } },
    senior: { sf: { min: 160000, median: 210000, max: 280000 }, nyc: { min: 180000, median: 230000, max: 310000 }, other_us: { min: 120000, median: 157500, max: 210000 } },
    lead: { sf: { min: 220000, median: 290000, max: 400000 }, nyc: { min: 250000, median: 330000, max: 450000 }, other_us: { min: 165000, median: 217500, max: 300000 } },
    director: { sf: { min: 280000, median: 380000, max: 550000 }, nyc: { min: 320000, median: 420000, max: 600000 }, other_us: { min: 210000, median: 285000, max: 412500 } },
  },
  healthcare: {
    entry: { sf: { min: 55000, median: 70000, max: 90000 }, nyc: { min: 52250, median: 66500, max: 85500 }, other_us: { min: 41250, median: 52500, max: 67500 } },
    mid: { sf: { min: 80000, median: 100000, max: 130000 }, nyc: { min: 76000, median: 95000, max: 123500 }, other_us: { min: 60000, median: 75000, max: 97500 } },
    senior: { sf: { min: 120000, median: 160000, max: 220000 }, nyc: { min: 114000, median: 152000, max: 209000 }, other_us: { min: 90000, median: 120000, max: 165000 } },
    lead: { sf: { min: 180000, median: 250000, max: 350000 }, nyc: { min: 171000, median: 237500, max: 332500 }, other_us: { min: 135000, median: 187500, max: 262500 } },
    director: { sf: { min: 250000, median: 350000, max: 500000 }, nyc: { min: 237500, median: 332500, max: 475000 }, other_us: { min: 187500, median: 262500, max: 375000 } },
  },
  consulting: {
    entry: { sf: { min: 70000, median: 85000, max: 105000 }, nyc: { min: 75000, median: 90000, max: 115000 }, other_us: { min: 52500, median: 63750, max: 78750 } },
    mid: { sf: { min: 110000, median: 140000, max: 180000 }, nyc: { min: 120000, median: 150000, max: 195000 }, other_us: { min: 82500, median: 105000, max: 135000 } },
    senior: { sf: { min: 160000, median: 200000, max: 260000 }, nyc: { min: 175000, median: 220000, max: 285000 }, other_us: { min: 120000, median: 150000, max: 195000 } },
    lead: { sf: { min: 220000, median: 280000, max: 380000 }, nyc: { min: 240000, median: 310000, max: 420000 }, other_us: { min: 165000, median: 210000, max: 285000 } },
    director: { sf: { min: 300000, median: 400000, max: 600000 }, nyc: { min: 330000, median: 450000, max: 700000 }, other_us: { min: 225000, median: 300000, max: 450000 } },
  },
};

async function fetchCareerOneStopData(
  jobTitle: string,
  location: string
): Promise<AggregatedSalaryData["government"]> {
  const apiKey = Deno.env.get("CAREERONESTOP_API_KEY");
  const userId = Deno.env.get("CAREERONESTOP_USER_ID");
  
  if (!apiKey || !userId) {
    logStep("CareerOneStop credentials not configured");
    return null;
  }
  
  const socMatch = findSOCCode(jobTitle);
  if (!socMatch) {
    logStep("No SOC code match for job title", { jobTitle });
    return null;
  }
  
  const stateCode = findStateCode(location);
  logStep("CareerOneStop lookup", { socCode: socMatch.code, state: stateCode });
  
  try {
    // CareerOneStop Wages API
    const url = `https://api.careeronestop.org/v1/occupation/${userId}/${socMatch.code}/${stateCode}?source=NationalAverage&wages=true`;
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logStep("CareerOneStop API error", { status: response.status, error: errorText });
      return null;
    }
    
    const data = await response.json();
    logStep("CareerOneStop response received", { hasWages: !!data.Wages });
    
    if (data.Wages && data.Wages.NationalWagesList?.length > 0) {
      const wages = data.Wages.NationalWagesList[0];
      return {
        source: "CareerOneStop/BLS",
        occupation: socMatch.title,
        socCode: socMatch.code,
        location: stateCode,
        percentiles: {
          p10: Math.round(wages.Pct10 * 1000), // API returns in thousands
          p25: Math.round(wages.Pct25 * 1000),
          median: Math.round(wages.Median * 1000),
          p75: Math.round(wages.Pct75 * 1000),
          p90: Math.round(wages.Pct90 * 1000),
        },
        dataYear: data.Wages.ReferenceDate || "2024",
      };
    }
    
    // Try alternative wage data structure
    if (data.OccupationDetail?.Wages) {
      const wages = data.OccupationDetail.Wages;
      return {
        source: "CareerOneStop/BLS",
        occupation: socMatch.title,
        socCode: socMatch.code,
        location: stateCode,
        percentiles: {
          p10: wages.NationalWagesList?.[0]?.Pct10 || 0,
          p25: wages.NationalWagesList?.[0]?.Pct25 || 0,
          median: wages.NationalWagesList?.[0]?.Median || 0,
          p75: wages.NationalWagesList?.[0]?.Pct75 || 0,
          p90: wages.NationalWagesList?.[0]?.Pct90 || 0,
        },
        dataYear: "2024",
      };
    }
    
    return null;
  } catch (error) {
    logStep("CareerOneStop fetch error", { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

async function fetchPerplexityData(
  jobTitle: string,
  location: string,
  industry: string
): Promise<AggregatedSalaryData["webSearch"]> {
  const apiKey = Deno.env.get("PERPLEXITY_API_KEY");
  
  if (!apiKey) {
    logStep("Perplexity API key not configured");
    return null;
  }
  
  logStep("Perplexity search", { jobTitle, location, industry });
  
  try {
    const query = `What is the current total compensation salary range for a ${jobTitle} in ${location} in the ${industry} industry? Provide specific salary numbers from Glassdoor, Indeed, Levels.fyi, LinkedIn, and recent job postings. Include base salary and total compensation ranges.`;
    
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar",
        messages: [
          { 
            role: "system", 
            content: "You are a salary research assistant. Provide specific salary numbers and ranges. Be concise and factual. Always include your sources." 
          },
          { role: "user", content: query }
        ],
        search_recency_filter: "month",
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logStep("Perplexity API error", { status: response.status, error: errorText });
      return null;
    }
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    const citations = data.citations || [];
    
    logStep("Perplexity response received", { contentLength: content.length, citations: citations.length });
    
    // Extract salary numbers from the response
    const salaryMatches = content.match(/\$[\d,]+(?:k|K)?/g) || [];
    const numbers = salaryMatches.map((s: string) => {
      let num = parseInt(s.replace(/[$,]/g, ""));
      if (s.toLowerCase().includes("k")) num *= 1000;
      return num;
    }).filter((n: number) => n >= 30000 && n <= 1000000); // Filter unrealistic values
    
    if (numbers.length >= 2) {
      const min = Math.min(...numbers);
      const max = Math.max(...numbers);
      
      return {
        source: "Perplexity",
        citations: citations.slice(0, 5),
        estimatedRange: { min, max },
        summary: content.slice(0, 500),
      };
    }
    
    return {
      source: "Perplexity",
      citations: citations.slice(0, 5),
      estimatedRange: { min: 0, max: 0 },
      summary: content.slice(0, 500),
    };
  } catch (error) {
    logStep("Perplexity fetch error", { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

async function fetchCrowdsourcedData(
  supabaseClient: any,
  jobTitle: string,
  industry: string,
  location: string,
  yearsExperience: number
): Promise<AggregatedSalaryData["crowdsourced"]> {
  logStep("Crowdsourced lookup", { jobTitle, industry, location, yearsExperience });
  
  try {
    // Query for similar roles with flexible matching
    const experienceMin = Math.max(0, yearsExperience - 3);
    const experienceMax = yearsExperience + 3;
    
    const { data: salaries, error } = await supabaseClient
      .from("anonymous_salaries")
      .select("base_salary, bonus, years_experience")
      .gte("years_experience", experienceMin)
      .lte("years_experience", experienceMax)
      .order("submitted_at", { ascending: false })
      .limit(200);
    
    if (error) {
      logStep("Crowdsourced query error", { error: error.message });
      return null;
    }
    
    if (!salaries || salaries.length < 3) {
      logStep("Insufficient crowdsourced data", { count: salaries?.length || 0 });
      return null;
    }
    
    // Calculate total compensation and percentiles
    const totalComps = salaries.map((s: { base_salary: number; bonus: number | null }) => s.base_salary + (s.bonus || 0)).sort((a: number, b: number) => a - b);
    const n = totalComps.length;
    
    const p25 = totalComps[Math.floor(n * 0.25)];
    const median = totalComps[Math.floor(n * 0.5)];
    const p75 = totalComps[Math.floor(n * 0.75)];
    
    logStep("Crowdsourced data computed", { sampleSize: n, p25, median, p75 });
    
    return {
      source: "anonymous_salaries",
      sampleSize: n,
      percentiles: { p25, median, p75 },
      recency: "Last 6 months",
    };
  } catch (error) {
    logStep("Crowdsourced fetch error", { error: error instanceof Error ? error.message : String(error) });
    return null;
  }
}

function fetchBenchmarkData(
  jobTitle: string,
  industry: string,
  location: string,
  yearsExperience: number
): AggregatedSalaryData["benchmark"] {
  const industryId = findIndustryId(industry);
  const locationId = findLocationId(location);
  const level = mapExperienceToLevel(yearsExperience);
  
  logStep("Benchmark lookup", { industryId, locationId, level });
  
  if (!industryId) {
    logStep("No matching industry for benchmark");
    return null;
  }
  
  const industryData = BENCHMARK_DATA[industryId];
  if (!industryData) {
    logStep("Industry not in benchmark data", { industryId });
    return null;
  }
  
  const levelData = industryData[level];
  if (!levelData) {
    logStep("Level not in industry data", { level });
    return null;
  }
  
  // Try exact location, then fall back to other_us
  let range = levelData[locationId];
  if (!range) {
    range = levelData["other_us"];
    if (!range) {
      // Take first available location
      const firstLocation = Object.keys(levelData)[0];
      range = levelData[firstLocation];
    }
  }
  
  if (!range) {
    return null;
  }
  
  return {
    source: "industryBenchmarks",
    industry: industryId,
    level: level,
    location: locationId,
    range,
  };
}

function calculateConfidence(
  dataQuality: AggregatedSalaryData["dataQuality"]
): "high" | "medium" | "low" {
  let score = 0;
  
  if (dataQuality.governmentMatch) score += 3;
  if (dataQuality.webDataAvailable) score += 2;
  if (dataQuality.crowdsourcedSampleSize >= 20) score += 2;
  else if (dataQuality.crowdsourcedSampleSize >= 5) score += 1;
  if (dataQuality.benchmarkMatch) score += 1;
  
  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");
    
    const formData: SalaryFormData = await req.json();
    logStep("Input received", { 
      jobTitle: formData.jobTitle, 
      industry: formData.industry, 
      location: formData.location,
      yearsExperience: formData.yearsExperience 
    });
    
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Fetch data from all sources in parallel
    const [government, webSearch, crowdsourced] = await Promise.all([
      fetchCareerOneStopData(formData.jobTitle, formData.location),
      fetchPerplexityData(formData.jobTitle, formData.location, formData.industry),
      fetchCrowdsourcedData(
        supabaseClient,
        formData.jobTitle,
        formData.industry,
        formData.location,
        formData.yearsExperience
      ),
    ]);
    
    // Synchronous benchmark lookup
    const benchmark = fetchBenchmarkData(
      formData.jobTitle,
      formData.industry,
      formData.location,
      formData.yearsExperience
    );
    
    const dataQuality = {
      governmentMatch: !!government,
      webDataAvailable: !!(webSearch && webSearch.estimatedRange.min > 0),
      crowdsourcedSampleSize: crowdsourced?.sampleSize || 0,
      benchmarkMatch: !!benchmark,
    };
    
    const confidence = calculateConfidence(dataQuality);
    
    const result: AggregatedSalaryData = {
      government,
      webSearch,
      crowdsourced,
      benchmark,
      confidence,
      dataQuality,
    };
    
    logStep("Aggregation complete", { confidence, dataQuality });
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("fetch-salary-data error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
