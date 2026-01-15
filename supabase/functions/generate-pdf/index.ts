import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { STRIPE_PRODUCTS, isProProduct, isOneTimeProduct } from "../_shared/stripe-config.ts";

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

interface PremiumInsights {
  negotiationScript: {
    opening: string;
    valueProposition: string;
    askStatement: string;
    handlePushback: string;
    closing: string;
  };
  talkingPoints: Array<{ point: string; evidence: string; delivery: string }>;
  alternativeRoles: Array<{
    title: string;
    industry: string;
    salaryRange: string;
    salaryIncrease: string;
    transitionPath: string;
    keySkills: string[];
  }>;
}

async function verifyPremium(email: string, stripe: Stripe): Promise<boolean> {
  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length === 0) return false;

  const customerId = customers.data[0].id;

  // Check for Pro subscriptions (monthly or annual)
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: "active",
    limit: 10,
  });

  for (const sub of subscriptions.data) {
    const productId = sub.items.data[0]?.price?.product;
    if (isProProduct(productId as string)) return true;
  }

  // Check for one-time purchases
  const sessions = await stripe.checkout.sessions.list({
    customer: customerId,
    status: "complete",
    limit: 100,
  });

  for (const session of sessions.data) {
    if (session.mode === "payment") {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      for (const item of lineItems.data) {
        if (item.price?.id) {
          const price = await stripe.prices.retrieve(item.price.id);
          if (isOneTimeProduct(price.product as string)) return true;
        }
      }
    }
  }

  return false;
}

function generatePDFContent(
  formData: SalaryFormData,
  analysis: SalaryAnalysis,
  insights: PremiumInsights
): string {
  const totalComp = formData.currentSalary + formData.bonus;
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const verdictText =
    analysis.verdict === "underpaid"
      ? `underpaid by $${Math.abs(analysis.difference).toLocaleString()}`
      : analysis.verdict === "overpaid"
      ? `paid $${analysis.difference.toLocaleString()} above market`
      : "at market rate";

  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Salary Analysis Report - Underpaid</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; line-height: 1.6; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 28px; margin-bottom: 8px; }
    h2 { font-size: 20px; margin: 32px 0 16px; border-bottom: 2px solid #e5e5e5; padding-bottom: 8px; }
    h3 { font-size: 16px; margin: 16px 0 8px; }
    p { margin-bottom: 12px; }
    .header { margin-bottom: 32px; }
    .date { color: #666; font-size: 14px; }
    .verdict { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 24px 0; }
    .verdict-title { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
    .verdict-underpaid { color: #dc2626; }
    .verdict-overpaid { color: #16a34a; }
    .verdict-fair { color: #2563eb; }
    .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0; }
    .metric { background: #fafafa; padding: 16px; border-radius: 8px; }
    .metric-label { font-size: 12px; color: #666; text-transform: uppercase; }
    .metric-value { font-size: 20px; font-weight: bold; }
    .script-section { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 16px 0; }
    .script-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 4px; }
    .talking-point { background: #fff; border: 1px solid #e5e5e5; padding: 16px; border-radius: 8px; margin: 12px 0; }
    .tp-number { display: inline-block; width: 24px; height: 24px; background: #2563eb; color: white; border-radius: 50%; text-align: center; line-height: 24px; font-size: 12px; margin-right: 8px; }
    .role { border: 1px solid #e5e5e5; padding: 16px; border-radius: 8px; margin: 12px 0; }
    .role-header { display: flex; justify-content: space-between; align-items: center; }
    .role-increase { color: #16a34a; font-weight: bold; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
    .skill { background: #e5e5e5; padding: 4px 12px; border-radius: 16px; font-size: 12px; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e5e5; color: #666; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Salary Analysis Report</h1>
    <p class="date">Generated on ${date}</p>
  </div>

  <div class="verdict">
    <p class="date">THE VERDICT</p>
    <p class="verdict-title verdict-${analysis.verdict}">You are likely ${verdictText}</p>
    <p>${Math.abs(analysis.differencePercent)}% ${analysis.verdict === "underpaid" ? "below" : analysis.verdict === "overpaid" ? "above" : "of"} the median for your role</p>
  </div>

  <h2>Your Profile</h2>
  <div class="metrics">
    <div class="metric">
      <p class="metric-label">Role</p>
      <p class="metric-value">${formData.jobTitle}</p>
    </div>
    <div class="metric">
      <p class="metric-label">Industry</p>
      <p class="metric-value">${formData.industry}</p>
    </div>
    <div class="metric">
      <p class="metric-label">Location</p>
      <p class="metric-value">${formData.location}</p>
    </div>
    <div class="metric">
      <p class="metric-label">Experience</p>
      <p class="metric-value">${formData.yearsExperience} years</p>
    </div>
  </div>

  <h2>Compensation Analysis</h2>
  <div class="metrics">
    <div class="metric">
      <p class="metric-label">Your Total Comp</p>
      <p class="metric-value">$${totalComp.toLocaleString()}</p>
    </div>
    <div class="metric">
      <p class="metric-label">Market Median</p>
      <p class="metric-value">$${analysis.medianSalary.toLocaleString()}</p>
    </div>
    <div class="metric">
      <p class="metric-label">75th Percentile</p>
      <p class="metric-value">$${analysis.percentile75Salary.toLocaleString()}</p>
    </div>
    <div class="metric">
      <p class="metric-label">Stress-Adjusted Rate</p>
      <p class="metric-value">$${Math.round(analysis.stressAdjustedCompensation)}/hr</p>
    </div>
  </div>

  <p><strong>Analysis:</strong> ${analysis.explanation}</p>

  <h2>Negotiation Script</h2>
  <div class="script-section">
    <p class="script-label">Opening</p>
    <p>${insights.negotiationScript.opening}</p>
  </div>
  <div class="script-section">
    <p class="script-label">Your Value Proposition</p>
    <p>${insights.negotiationScript.valueProposition}</p>
  </div>
  <div class="script-section">
    <p class="script-label">The Ask</p>
    <p><strong>${insights.negotiationScript.askStatement}</strong></p>
  </div>
  <div class="script-section">
    <p class="script-label">Handling Pushback</p>
    <p>${insights.negotiationScript.handlePushback}</p>
  </div>
  <div class="script-section">
    <p class="script-label">Closing</p>
    <p>${insights.negotiationScript.closing}</p>
  </div>

  <h2>Talking Points</h2>
  ${insights.talkingPoints
    .map(
      (tp, i) => `
  <div class="talking-point">
    <p><span class="tp-number">${i + 1}</span><strong>${tp.point}</strong></p>
    <p style="margin-top: 8px;"><strong>Evidence:</strong> ${tp.evidence}</p>
    <p><strong>How to deliver:</strong> ${tp.delivery}</p>
  </div>`
    )
    .join("")}

  <h2>Higher-Paying Alternative Roles</h2>
  ${insights.alternativeRoles
    .map(
      (role) => `
  <div class="role">
    <div class="role-header">
      <div>
        <h3>${role.title}</h3>
        <p style="color: #666; font-size: 14px;">${role.industry}</p>
      </div>
      <div style="text-align: right;">
        <p class="role-increase">${role.salaryIncrease}</p>
        <p style="font-size: 14px;">${role.salaryRange}</p>
      </div>
    </div>
    <p style="margin-top: 12px;"><strong>Transition path:</strong> ${role.transitionPath}</p>
    <div class="skills">
      ${role.keySkills.map((skill) => `<span class="skill">${skill}</span>`).join("")}
    </div>
  </div>`
    )
    .join("")}

  <div class="footer">
    <p>Generated by Underpaid • underpaid.app</p>
    <p>This report is for informational purposes only. Compensation data is estimated based on market research.</p>
  </div>
</body>
</html>`;

  return html;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !userData.user?.email) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify premium status
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const isPremium = await verifyPremium(userData.user.email, stripe);
    if (!isPremium) {
      return new Response(
        JSON.stringify({ error: "Premium subscription required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { formData, analysis, insights } = await req.json();

    if (!formData || !analysis || !insights) {
      return new Response(
        JSON.stringify({ error: "Missing required data" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const htmlContent = generatePDFContent(formData, analysis, insights);

    // Upload to storage bucket
    const sanitizedJobTitle = formData.jobTitle.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    const fileName = `${userData.user.id}/${Date.now()}-${sanitizedJobTitle}.html`;

    const { error: uploadError } = await supabaseAdmin
      .storage
      .from("salary-reports")
      .upload(fileName, new Blob([htmlContent], { type: "text/html" }), {
        contentType: "text/html",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Still return the HTML even if storage fails
      return new Response(
        JSON.stringify({ html: htmlContent, stored: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a signed URL for immediate download
    const { data: signedUrl } = await supabaseAdmin
      .storage
      .from("salary-reports")
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    return new Response(
      JSON.stringify({ 
        html: htmlContent, 
        stored: true,
        downloadUrl: signedUrl?.signedUrl,
        fileName 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("generate-pdf error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
