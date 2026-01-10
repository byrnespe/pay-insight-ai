import { SalaryAnalysis, SalaryFormData } from "@/types/salary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Scale, Target, MessageSquare, Settings, ExternalLink, Lock, Loader2 } from "lucide-react";
import { useState } from "react";

interface SalaryResultsProps {
  analysis: SalaryAnalysis;
  formData: SalaryFormData;
  onReset: () => void;
}

export function SalaryResults({ analysis, formData, onReset }: SalaryResultsProps) {
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const totalComp = formData.currentSalary + formData.bonus;
  
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

  const handleUpgrade = async () => {
    setIsCheckoutLoading(true);
    
    // Store data in sessionStorage for the premium page
    sessionStorage.setItem("underpaid_formData", JSON.stringify(formData));
    sessionStorage.setItem("underpaid_analysis", JSON.stringify(analysis));
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            priceType: "one_time",
          }),
        }
      );

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button */}
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Start over
      </button>

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

      {/* Premium Upsell */}
      <Card className="p-6 border-2 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Unlock Premium Insights</h3>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Personalized negotiation script</li>
              <li>• Talking points for raise discussions</li>
              <li>• 10 alternative roles with higher pay</li>
              <li>• Exportable PDF report</li>
            </ul>
            <Button 
              className="mt-4" 
              variant="default"
              onClick={handleUpgrade}
              disabled={isCheckoutLoading}
            >
              {isCheckoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Upgrade for $9"
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
