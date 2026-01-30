import { SalaryAnalysis, SalaryFormData } from "@/types/salary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  TrendingUp, 
  Scale, 
  Target, 
  MessageSquare, 
  Settings, 
  ExternalLink, 
  Loader2, 
  User,
  FileText,
  Sparkles,
  Check,
  ArrowRight,
  RefreshCw,
  BarChart3,
  History,
  Shield,
  Save,
  Crown
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShareResults } from "./ShareResults";
import { DataSourcesBadge } from "./DataSourcesBadge";
import { CareerOneStopAttribution } from "./CareerOneStopAttribution";
import { EmailCapture } from "./EmailCapture";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/integrations/backend/config";
import { trackEvent } from "@/hooks/useAnalytics";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SalaryResultsProps {
  analysis: SalaryAnalysis;
  formData: SalaryFormData;
  onReset: () => void;
}

export function SalaryResults({ analysis, formData, onReset }: SalaryResultsProps) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"one_time" | "pro_monthly" | "pro_annual">("one_time");
  const [showUpsellPopup, setShowUpsellPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const { user, session, isPro, hasReport, canAccessFeature } = useAuth();
  const { toast } = useToast();
  const totalComp = formData.currentSalary + formData.bonus;

  // Track analysis completed and scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent("analysis_completed", {
      verdict: analysis.verdict,
      difference_percent: analysis.differencePercent,
      leverage: analysis.negotiationLeverage,
    });
  }, [analysis]);

  // Store form data for premium page access
  useEffect(() => {
    sessionStorage.setItem("underpaid_formData", JSON.stringify(formData));
    sessionStorage.setItem("underpaid_analysis", JSON.stringify(analysis));
  }, [formData, analysis]);

  // Show upsell popup after 10 seconds for non-Pro, non-report users
  useEffect(() => {
    // Don't show to Pro subscribers or users who already have the report
    if (isPro || hasReport) return;

    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem("underpaid_upsell_shown");
    if (alreadyShown) return;

    const timer = setTimeout(() => {
      setShowUpsellPopup(true);
      sessionStorage.setItem("underpaid_upsell_shown", "true");
    }, 10000);

    return () => clearTimeout(timer);
  }, [isPro, hasReport]);
  
  const verdictColors = {
    underpaid: "text-verdict-underpaid",
    overpaid: "text-verdict-overpaid",
    fair: "text-verdict-fair",
  };
  
  const verdictBgColors = {
    underpaid: "bg-verdict-underpaid/10",
    overpaid: "bg-verdict-overpaid/10",
    fair: "bg-verdict-fair/10",
  };

  const leverageColors = {
    low: "text-muted-foreground",
    medium: "text-warning",
    high: "text-success",
  };

  const effortColors = {
    poor: "text-verdict-underpaid",
    average: "text-warning",
    good: "text-success",
    excellent: "text-success",
  };

  const handleUpgrade = async (plan: "one_time" | "pro_monthly" | "pro_annual") => {
    // Go directly to checkout - no auth required
    // User will enter email in Stripe Checkout if not logged in
    setIsCheckoutLoading(true);
    setSelectedPlan(plan);
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      
      // Add auth token if user is logged in
      if (session?.access_token) {
        headers.Authorization = `Bearer ${session.access_token}`;
      }

      const response = await fetch(
        `${BACKEND_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({
            priceType: plan,
          }),
        }
      );

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned", data);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Calculate the salary gap for dynamic headline
  const salaryGap = Math.abs(analysis.difference);

  const handleSaveReport = async () => {
    if (!session?.access_token) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save reports.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/functions/v1/save-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ formData, analysis }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save report");
      }

      setIsSaved(true);
      toast({ title: "Report saved", description: "You can access it anytime from your Premium dashboard." });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Failed to save",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if user is a paying customer (Pro or one-time purchase)
  const isPayingCustomer = isPro || hasReport;

  return (
    <div className="space-y-8">
      {/* Back button and save */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Start over
        </button>

        <div className="flex items-center gap-3">
          {/* Save button - Pro only */}
          {canAccessFeature("saved_reports") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveReport}
              disabled={isSaving || isSaved}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : isSaved ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}
            </Button>
          )}
          
          {user && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="w-4 h-4" />
              {user.email}
            </span>
          )}
        </div>
      </div>

      {/* Verdict */}
      <div className={`p-6 rounded-lg ${verdictBgColors[analysis.verdict]}`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-2">
          <p className="text-sm font-medium text-muted-foreground">The Verdict</p>
          <DataSourcesBadge 
            dataSources={analysis.dataSources}
            confidence={analysis.confidence}
            citations={analysis.citations}
          />
        </div>
        <h1 className={`text-2xl sm:text-3xl font-bold ${verdictColors[analysis.verdict]}`}>
          {analysis.verdict === 'underpaid' && (
            <>You are likely underpaid by ${Math.abs(analysis.difference).toLocaleString()}</>
          )}
          {analysis.verdict === 'overpaid' && (
            <>You are paid ${analysis.difference.toLocaleString()} above market</>
          )}
          {analysis.verdict === 'fair' && (
            <>Your compensation is at market rate</>
          )}
        </h1>
        <p className="text-muted-foreground mt-2">
          {Math.abs(analysis.differencePercent)}% {analysis.verdict === 'underpaid' ? 'below' : analysis.verdict === 'overpaid' ? 'above' : 'of'} the median for your role
        </p>
      </div>

      {/* Three Insight Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Market Card */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Market Position</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Your Comp</span>
              <span className="font-medium text-foreground">${totalComp.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Median</span>
              <span className="font-medium text-foreground">${analysis.medianSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">75th %ile</span>
              <span className="font-medium text-foreground">${analysis.percentile75Salary.toLocaleString()}</span>
            </div>
          </div>
        </Card>

        {/* Effort vs Pay Card */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Scale className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Effort vs Pay</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Hours/Week</span>
              <span className="font-medium text-foreground">{formData.hoursPerWeek}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stress Level</span>
              <span className="font-medium text-foreground">{formData.stressLevel}/10</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ratio</span>
              <span className={`font-semibold ${effortColors[analysis.effortToPayRatio]}`}>
                {analysis.effortToPayRatio.charAt(0).toUpperCase() + analysis.effortToPayRatio.slice(1)}
              </span>
            </div>
          </div>
        </Card>

        {/* Leverage Card */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-4 h-4 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Leverage</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Negotiation</span>
              <span className={`font-semibold ${leverageColors[analysis.negotiationLeverage]}`}>
                {analysis.negotiationLeverage.charAt(0).toUpperCase() + analysis.negotiationLeverage.slice(1)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Stress-Adj. Rate</span>
              <span className="font-medium text-foreground">${Math.round(analysis.stressAdjustedCompensation)}/hr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Satisfaction</span>
              <span className="font-medium text-foreground">{formData.jobSatisfaction}/10</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Explanation */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Analysis</h2>
        <p className="text-muted-foreground leading-relaxed">{analysis.explanation}</p>
      </div>

      {/* Share Results */}
      <ShareResults 
        verdict={analysis.verdict} 
        differencePercent={analysis.differencePercent} 
      />

      {/* Email Capture - Only for non-paying users */}
      {!isPayingCustomer && (
        <EmailCapture 
          jobTitle={formData.jobTitle}
          location={formData.location}
          source="salary_results"
        />
      )}

      {/* CareerOneStop Attribution - Required per API terms */}
      {analysis.dataSources?.government && (
        <CareerOneStopAttribution />
      )}

      {/* Action Paths */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Recommended Paths</h2>
        
        <Card className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Negotiate</h3>
              <p className="text-sm text-muted-foreground mt-1">{analysis.paths.negotiate}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Optimize Workload</h3>
              <p className="text-sm text-muted-foreground mt-1">{analysis.paths.optimize}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ExternalLink className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Explore New Roles</h3>
              <p className="text-sm text-muted-foreground mt-1">{analysis.paths.exit}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* For paying customers: Show "Go to Premium Insights" CTA instead of pricing */}
      {isPayingCustomer ? (
        <div className="space-y-4 pt-4">
          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                {isPro ? (
                  <Crown className="w-6 h-6 text-primary" />
                ) : (
                  <FileText className="w-6 h-6 text-primary" />
                )}
                <h2 className="text-xl font-bold text-foreground">
                  {isPro ? "Your Pro Tools Are Ready" : "Your Full Report Is Ready"}
                </h2>
              </div>
              <p className="text-muted-foreground max-w-md mx-auto">
                {isPro 
                  ? "Access negotiation scripts, manager-specific tactics, offer comparison, and more."
                  : "View your complete analysis with negotiation scripts and talking points."
                }
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate("/premium")}
                className="gap-2"
              >
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4" />
                    Go to Premium Insights
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    View Full Report
                  </>
                )}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        /* Premium Tier Comparison - Only for non-paying users */
        <div className="space-y-6 pt-4">
          {/* Dynamic Headline */}
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {analysis.verdict === 'underpaid' 
                ? `Get the tools to close that $${salaryGap.toLocaleString()} gap`
                : analysis.verdict === 'overpaid'
                ? `Protect your position and maximize your leverage`
                : `Prepare for your next move`
              }
            </h2>
            <p className="text-muted-foreground">
              This report gives clarity. <span className="font-medium text-foreground">Pro gives leverage when things change.</span>
            </p>
          </div>

          {/* Three-Tier Pricing */}
          <div className="grid gap-6 sm:gap-4 lg:grid-cols-3">
            {/* One-Time Tier */}
            <Card 
              className={`p-5 relative cursor-pointer transition-all ${
                selectedPlan === "one_time" 
                  ? "border-2 border-primary ring-2 ring-primary/20" 
                  : "border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("one_time")}
            >
              {/* Best For Most Badge */}
              <div className="absolute -top-3 left-4">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                  Best for most
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-foreground">$9</span>
                  <span className="text-sm text-muted-foreground">one-time</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">"I just want clarity"</p>

                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">Full compensation analysis</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">Verdict and shareable summary</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">Basic negotiation script</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">Action paths overview</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground">PDF export (one snapshot)</span>
                  </li>
                </ul>

                <Button 
                  className="w-full mt-5" 
                  variant={selectedPlan === "one_time" ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade("one_time");
                  }}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading && selectedPlan === "one_time" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Get Clarity — $9
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Pro Monthly Tier */}
            <Card 
              className={`p-5 relative cursor-pointer transition-all ${
                selectedPlan === "pro_monthly" 
                  ? "border-2 border-primary ring-2 ring-primary/20" 
                  : "border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("pro_monthly")}
            >
              {/* Pro Badge */}
              <div className="absolute -top-3 left-4">
                <span className="bg-gradient-to-r from-success to-success/80 text-success-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Pro
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-foreground">$5</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">"I want ongoing leverage"</p>

                <p className="text-xs font-medium text-muted-foreground mb-2">Everything in One-Time, plus:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Manager-specific scripts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">"What if they say no?" generator</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <RefreshCw className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Unlimited pay checks</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Offer comparison tool</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <History className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Career tracking & saved history</span>
                  </li>
                </ul>

                <Button 
                  className="w-full mt-5" 
                  variant={selectedPlan === "pro_monthly" ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade("pro_monthly");
                  }}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading && selectedPlan === "pro_monthly" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Go Pro — $5/mo
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Pro Annual Tier */}
            <Card 
              className={`p-5 relative cursor-pointer transition-all ${
                selectedPlan === "pro_annual" 
                  ? "border-2 border-primary ring-2 ring-primary/20" 
                  : "border hover:border-primary/50"
              }`}
              onClick={() => setSelectedPlan("pro_annual")}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-3 left-4">
                <span className="bg-gradient-to-r from-warning to-warning/80 text-warning-foreground text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                  Best Value
                </span>
              </div>

              <div className="pt-2">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-foreground">$49</span>
                  <span className="text-sm text-muted-foreground">/year</span>
                </div>
                <p className="text-sm text-success font-medium mb-4">Save $11 vs monthly</p>

                <p className="text-xs font-medium text-muted-foreground mb-2">Everything in Pro Monthly:</p>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Manager-specific scripts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">"What if they say no?" generator</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <RefreshCw className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Unlimited pay checks</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Offer comparison tool</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <History className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground">Career tracking & saved history</span>
                  </li>
                </ul>

                <Button 
                  className="w-full mt-5" 
                  variant={selectedPlan === "pro_annual" ? "default" : "outline"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpgrade("pro_annual");
                  }}
                  disabled={isCheckoutLoading}
                >
                  {isCheckoutLoading && selectedPlan === "pro_annual" ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Go Pro — $49/yr
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="text-center space-y-2 py-2">
            <p className="text-sm text-muted-foreground">
              <Shield className="w-3.5 h-3.5 inline mr-1" />
              30-day money-back guarantee
            </p>
            <p className="text-xs text-muted-foreground">
              No account required • Cancel Pro anytime — your $9 report stays forever
            </p>
          </div>
        </div>
      )}

      {/* Upsell Popup for PDF Export - Only for non-paying users */}
      <Dialog open={showUpsellPopup && !isPayingCustomer} onOpenChange={setShowUpsellPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Save this analysis for later</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Export your full report as a PDF for $9 (one-time). Includes your verdict, market data, and a basic negotiation script.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowUpsellPopup(false)}
            >
              Maybe later
            </Button>
            <Button
              onClick={() => {
                setShowUpsellPopup(false);
                handleUpgrade("one_time");
              }}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading && selectedPlan === "one_time" ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Get PDF Export — $9
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
