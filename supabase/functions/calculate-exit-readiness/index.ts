import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ExitReadinessInput {
  emergencyFundMonths: number;
  hasUpdatedResume: boolean;
  recentInterviews: number;
  networkStrength: "weak" | "moderate" | "strong";
  industryDemand: "low" | "moderate" | "high";
  currentJobStability: "unstable" | "moderate" | "stable";
  monthlyExpenses: number;
  currentSavings: number;
}

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

    const input: ExitReadinessInput = await req.json();

    // Calculate exit readiness score (0-100)
    let score = 0;
    const factors: { factor: string; points: number; recommendation?: string }[] = [];

    // Emergency fund (0-25 points)
    const fundScore = Math.min(input.emergencyFundMonths * 4, 25);
    score += fundScore;
    factors.push({
      factor: "Emergency Fund",
      points: fundScore,
      recommendation: input.emergencyFundMonths < 6 
        ? `Build your emergency fund to at least 6 months of expenses (currently ${input.emergencyFundMonths} months).`
        : undefined
    });

    // Resume readiness (0-10 points)
    const resumeScore = input.hasUpdatedResume ? 10 : 0;
    score += resumeScore;
    factors.push({
      factor: "Resume Status",
      points: resumeScore,
      recommendation: !input.hasUpdatedResume 
        ? "Update your resume with recent accomplishments and skills."
        : undefined
    });

    // Recent interview activity (0-15 points)
    const interviewScore = Math.min(input.recentInterviews * 5, 15);
    score += interviewScore;
    factors.push({
      factor: "Interview Activity",
      points: interviewScore,
      recommendation: input.recentInterviews < 2 
        ? "Consider scheduling exploratory interviews to test the market and build interview skills."
        : undefined
    });

    // Network strength (0-15 points)
    const networkScores = { weak: 5, moderate: 10, strong: 15 };
    const networkScore = networkScores[input.networkStrength];
    score += networkScore;
    factors.push({
      factor: "Professional Network",
      points: networkScore,
      recommendation: input.networkStrength === "weak" 
        ? "Strengthen your network by reconnecting with former colleagues and attending industry events."
        : input.networkStrength === "moderate"
        ? "Continue building your network—referrals often lead to better opportunities."
        : undefined
    });

    // Industry demand (0-20 points)
    const demandScores = { low: 5, moderate: 12, high: 20 };
    const demandScore = demandScores[input.industryDemand];
    score += demandScore;
    factors.push({
      factor: "Industry Demand",
      points: demandScore,
      recommendation: input.industryDemand === "low" 
        ? "Consider upskilling or exploring adjacent industries with higher demand."
        : undefined
    });

    // Current job stability impact (0-15 points, inverse)
    const stabilityScores = { unstable: 15, moderate: 10, stable: 5 };
    const stabilityScore = stabilityScores[input.currentJobStability];
    score += stabilityScore;
    factors.push({
      factor: "Current Role Stability",
      points: stabilityScore,
      recommendation: input.currentJobStability === "stable" 
        ? "Your current role is stable—use this time to prepare carefully rather than rushing an exit."
        : input.currentJobStability === "unstable"
        ? "Given instability in your current role, prioritize building your financial runway."
        : undefined
    });

    // Calculate months until safe exit
    const monthlyBurn = input.monthlyExpenses;
    const runway = monthlyBurn > 0 ? Math.floor(input.currentSavings / monthlyBurn) : 12;
    const targetRunway = 6;
    const monthsToTarget = Math.max(0, targetRunway - runway);

    // Generate interpretation
    let interpretation: string;
    let readinessLevel: "not_ready" | "getting_ready" | "ready" | "very_ready";

    if (score < 30) {
      interpretation = "You're not yet ready for a voluntary exit. Focus on building your financial runway and marketability before making a move.";
      readinessLevel = "not_ready";
    } else if (score < 50) {
      interpretation = "You're making progress but have some gaps to address. Strengthen your weakest areas before actively pursuing new opportunities.";
      readinessLevel = "getting_ready";
    } else if (score < 75) {
      interpretation = "You're in a reasonable position to explore opportunities. You could start actively interviewing while continuing to strengthen your position.";
      readinessLevel = "ready";
    } else {
      interpretation = "You're well-positioned for a transition. You have the financial runway and marketability to pursue opportunities confidently.";
      readinessLevel = "very_ready";
    }

    const result = {
      score,
      readinessLevel,
      interpretation,
      factors: factors.filter(f => f.recommendation), // Only return factors with recommendations
      timeline: {
        currentRunway: runway,
        targetRunway,
        monthsToTarget,
        safeExitDate: monthsToTarget > 0 
          ? new Date(Date.now() + monthsToTarget * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : "Now"
      }
    };

    console.log(`Exit readiness calculated for user ${user.id}: score ${score}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error calculating exit readiness:", error);
    return new Response(
      JSON.stringify({ error: "Failed to calculate exit readiness" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
