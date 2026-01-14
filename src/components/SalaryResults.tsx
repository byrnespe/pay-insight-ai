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
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ShareResults } from "./ShareResults";
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
  const navigate = useNavigate();
  const { user, session, isPro, hasReport } = useAuth();
  const totalComp = formData.currentSalary + formData.bonus;

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
    // Store data in sessionStorage for the premium page
    sessionStorage.setItem("underpaid_formData", JSON.stringify(formData));
    sessionStorage.setItem("underpaid_analysis", JSON.stringify(analysis));

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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
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

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Start over
        </button>

        {user ? (
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <User className="w-4 h-4" />
            {user.email}
          </span>
        ) : (
          <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
            Sign in
          </Button>
        )}
      </div>

      {/* Verdict */}
      <div className={`p-6 rounded-lg ${verdictBgColors[analysis.verdict]}`}>
        <p className="text-sm font-medium text-muted-foreground mb-2">The Verdict</p>
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

      {/* Premium Tier Comparison */}
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
        <div className="grid gap-4 lg:grid-cols-3">
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
        <div className="text-center space-y-1.5">
          <p className="text-sm text-muted-foreground">
            <Shield className="w-3.5 h-3.5 inline mr-1" />
            30-day money-back guarantee
          </p>
          <p className="text-xs text-muted-foreground">
            Cancel Pro anytime — your $9 report stays forever
          </p>
        </div>
      </div>

      {/* Upsell Popup for PDF Export */}
      <Dialog open={showUpsellPopup} onOpenChange={setShowUpsellPopup}>
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
