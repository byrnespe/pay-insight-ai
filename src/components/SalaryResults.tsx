import { SalaryAnalysis, SalaryFormData } from "@/types/salary";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Settings, ExternalLink, Lock } from "lucide-react";

interface SalaryResultsProps {
  analysis: SalaryAnalysis;
  formData: SalaryFormData;
  onReset: () => void;
}

export function SalaryResults({ analysis, formData, onReset }: SalaryResultsProps) {
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
    low: "bg-muted text-muted-foreground",
    medium: "bg-warning/10 text-warning",
    high: "bg-success/10 text-success",
  };

  const effortColors = {
    poor: "bg-verdict-underpaid/10 text-verdict-underpaid",
    average: "bg-warning/10 text-warning",
    good: "bg-success/10 text-success",
    excellent: "bg-success/10 text-success",
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

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Your Total Compensation</p>
          <p className="text-2xl font-bold text-foreground">${totalComp.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Market Median</p>
          <p className="text-2xl font-bold text-foreground">${analysis.medianSalary.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">75th Percentile</p>
          <p className="text-2xl font-bold text-foreground">${analysis.percentile75Salary.toLocaleString()}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Effort-to-Pay Ratio</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-sm font-medium px-2 py-1 rounded ${effortColors[analysis.effortToPayRatio]}`}>
              {analysis.effortToPayRatio.charAt(0).toUpperCase() + analysis.effortToPayRatio.slice(1)}
            </span>
          </div>
        </Card>
      </div>

      {/* Negotiation Leverage */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Negotiation Leverage</p>
            <p className="font-medium text-foreground mt-1">Your position strength for salary discussions</p>
          </div>
          <span className={`text-sm font-medium px-3 py-1.5 rounded ${leverageColors[analysis.negotiationLeverage]}`}>
            {analysis.negotiationLeverage.charAt(0).toUpperCase() + analysis.negotiationLeverage.slice(1)}
          </span>
        </div>
      </Card>

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
      <Card className="p-6 border-2 border-dashed border-muted">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-muted">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">Unlock Premium Insights</h3>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Personalized negotiation script for your role</li>
              <li>• 10 alternative roles with higher compensation</li>
              <li>• Exportable PDF report for your records</li>
              <li>• AI-powered interview prep tips</li>
            </ul>
            <Button className="mt-4" variant="default">
              Upgrade for $9
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
