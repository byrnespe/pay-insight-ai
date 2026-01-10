import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Scale, 
  Lock, 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  DollarSign,
  Building,
  Briefcase,
  Car,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OfferComparisonToolProps {
  formData: { jobTitle: string; currentSalary: number; bonus: number };
}

interface ComparisonResult {
  summary: {
    salaryDifference: string;
    totalCompDifference: string;
    verdict: "ACCEPT" | "NEGOTIATE" | "DECLINE";
    confidenceLevel: "high" | "medium" | "low";
  };
  financialAnalysis: {
    yearOneValue: string;
    yearTwoPlus: string;
    hiddenCosts: string[];
    lifetimeImpact: string;
  };
  qualitativeFactors: Array<{
    factor: string;
    currentScore: number;
    newScore: number;
    analysis: string;
  }>;
  riskAnalysis: {
    risks: string[];
    opportunities: string[];
    marketTiming: string;
  };
  negotiationLeverage: {
    leverageLevel: "high" | "medium" | "low";
    suggestedCounterOffer: string;
    talkingPoints: string[];
  };
  recommendation: {
    decision: string;
    nextSteps: string[];
    questionsToAsk: string[];
  };
}

export const OfferComparisonTool = ({ formData }: OfferComparisonToolProps) => {
  const { canAccessFeature } = useAuth();
  const { toast } = useToast();
  const isPro = canAccessFeature("comparison_tool");

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const [currentRole, setCurrentRole] = useState({
    title: formData.jobTitle,
    baseSalary: formData.currentSalary,
    bonus: formData.bonus,
    benefits: "",
    workStyle: "hybrid",
    commute: "",
  });

  const [newOffer, setNewOffer] = useState({
    title: "",
    company: "",
    baseSalary: "",
    bonus: "",
    signingBonus: "",
    benefits: "",
    workStyle: "hybrid",
    commute: "",
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleCompare = async () => {
    if (!newOffer.title || !newOffer.company || !newOffer.baseSalary) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the job title, company, and base salary for the new offer.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-offer-comparison`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            currentRole: {
              ...currentRole,
              baseSalary: currentRole.baseSalary,
              bonus: currentRole.bonus,
            },
            newOffer: {
              ...newOffer,
              baseSalary: parseFloat(newOffer.baseSalary) || 0,
              bonus: parseFloat(newOffer.bonus) || 0,
              signingBonus: parseFloat(newOffer.signingBonus) || 0,
              commute: newOffer.commute ? parseInt(newOffer.commute) : null,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate comparison");
      }

      const data = await response.json();
      setResult(data);
      setExpandedSections(["summary", "financial", "recommendation"]);
    } catch (err) {
      console.error("Comparison error:", err);
      toast({
        title: "Comparison failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "ACCEPT": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "NEGOTIATE": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "DECLINE": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "ACCEPT": return <CheckCircle className="w-5 h-5" />;
      case "NEGOTIATE": return <Target className="w-5 h-5" />;
      case "DECLINE": return <AlertTriangle className="w-5 h-5" />;
      default: return null;
    }
  };

  if (!isPro) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Offer Comparison Tool</h2>
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
            PRO
          </span>
        </div>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center space-y-3 p-6">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground max-w-xs">
                Compare job offers with detailed financial and qualitative analysis. Available with Pro subscription.
              </p>
            </div>
          </div>

          <div className="opacity-30 pointer-events-none">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Role</Label>
                <Input disabled placeholder="Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label>New Offer</Label>
                <Input disabled placeholder="Senior Engineer @ Tech Co" />
              </div>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Scale className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Offer Comparison Tool</h2>
        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full">
          PRO
        </span>
      </div>

      <Card className="p-6">
        {!result ? (
          <div className="space-y-6">
            {/* Current Role */}
            <div>
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Building className="w-4 h-4" />
                Your Current Role
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={currentRole.title}
                    onChange={(e) => setCurrentRole(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base Salary ($)</Label>
                  <Input
                    type="number"
                    value={currentRole.baseSalary}
                    onChange={(e) => setCurrentRole(prev => ({ ...prev, baseSalary: parseFloat(e.target.value) || 0 }))}
                    placeholder="85000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Bonus ($)</Label>
                  <Input
                    type="number"
                    value={currentRole.bonus}
                    onChange={(e) => setCurrentRole(prev => ({ ...prev, bonus: parseFloat(e.target.value) || 0 }))}
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Work Style</Label>
                  <Select 
                    value={currentRole.workStyle} 
                    onValueChange={(value) => setCurrentRole(prev => ({ ...prev, workStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Commute (minutes one-way)</Label>
                  <Input
                    type="number"
                    value={currentRole.commute}
                    onChange={(e) => setCurrentRole(prev => ({ ...prev, commute: e.target.value }))}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Benefits</Label>
                  <Input
                    value={currentRole.benefits}
                    onChange={(e) => setCurrentRole(prev => ({ ...prev, benefits: e.target.value }))}
                    placeholder="401k match, health insurance, 3 weeks PTO"
                  />
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* New Offer */}
            <div>
              <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                The New Offer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title *</Label>
                  <Input
                    value={newOffer.title}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input
                    value={newOffer.company}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Tech Corp Inc"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base Salary ($) *</Label>
                  <Input
                    type="number"
                    value={newOffer.baseSalary}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, baseSalary: e.target.value }))}
                    placeholder="105000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Annual Bonus ($)</Label>
                  <Input
                    type="number"
                    value={newOffer.bonus}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, bonus: e.target.value }))}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signing Bonus ($)</Label>
                  <Input
                    type="number"
                    value={newOffer.signingBonus}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, signingBonus: e.target.value }))}
                    placeholder="15000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Work Style</Label>
                  <Select 
                    value={newOffer.workStyle} 
                    onValueChange={(value) => setNewOffer(prev => ({ ...prev, workStyle: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="remote">Remote</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                      <SelectItem value="onsite">On-site</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Commute (minutes one-way)</Label>
                  <Input
                    type="number"
                    value={newOffer.commute}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, commute: e.target.value }))}
                    placeholder="45"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Key Benefits</Label>
                  <Input
                    value={newOffer.benefits}
                    onChange={(e) => setNewOffer(prev => ({ ...prev, benefits: e.target.value }))}
                    placeholder="401k match, health insurance, 4 weeks PTO, equity"
                  />
                </div>
              </div>
            </div>

            <Button onClick={handleCompare} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Offers...
                </>
              ) : (
                <>
                  <Scale className="w-4 h-4 mr-2" />
                  Compare Offers
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Section */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection("summary")}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Summary
                </h3>
                {expandedSections.includes("summary") ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>
            
            {expandedSections.includes("summary") && (
              <div className="space-y-4 pt-2">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium ${getVerdictColor(result.summary.verdict)}`}>
                  {getVerdictIcon(result.summary.verdict)}
                  {result.summary.verdict}
                  <span className="text-xs opacity-75">({result.summary.confidenceLevel} confidence)</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Salary Difference</p>
                    <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                      {result.summary.salaryDifference.includes("+") ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                      {result.summary.salaryDifference}
                    </p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Total Comp Difference</p>
                    <p className="text-lg font-semibold text-foreground">
                      {result.summary.totalCompDifference}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <hr className="border-border" />

            {/* Financial Analysis */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection("financial")}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financial Analysis
                </h3>
                {expandedSections.includes("financial") ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedSections.includes("financial") && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Year 1 Value</p>
                    <p className="font-medium text-foreground">{result.financialAnalysis.yearOneValue}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground mb-1">Year 2+ Value</p>
                    <p className="font-medium text-foreground">{result.financialAnalysis.yearTwoPlus}</p>
                  </div>
                </div>
                
                {result.financialAnalysis.hiddenCosts.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Hidden Costs to Consider
                    </p>
                    <ul className="space-y-1">
                      {result.financialAnalysis.hiddenCosts.map((cost, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-muted-foreground">•</span>
                          {cost}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm font-medium text-primary mb-1">5-Year Impact</p>
                  <p className="text-sm text-foreground">{result.financialAnalysis.lifetimeImpact}</p>
                </div>
              </div>
            )}

            <hr className="border-border" />

            {/* Qualitative Factors */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection("qualitative")}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Quality of Life Factors</h3>
                {expandedSections.includes("qualitative") ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedSections.includes("qualitative") && (
              <div className="space-y-3 pt-2">
                {result.qualitativeFactors.map((factor, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground">{factor.factor}</p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Current: {factor.currentScore}/10</span>
                        <span className="text-muted-foreground">→</span>
                        <span className={factor.newScore > factor.currentScore ? "text-green-600" : factor.newScore < factor.currentScore ? "text-red-600" : "text-muted-foreground"}>
                          New: {factor.newScore}/10
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{factor.analysis}</p>
                  </div>
                ))}
              </div>
            )}

            <hr className="border-border" />

            {/* Risk Analysis */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection("risk")}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Risk & Opportunity Analysis
                </h3>
                {expandedSections.includes("risk") ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedSections.includes("risk") && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-red-600 mb-2">Risks</p>
                    <ul className="space-y-1">
                      {result.riskAnalysis.risks.map((risk, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-2">Opportunities</p>
                    <ul className="space-y-1">
                      {result.riskAnalysis.opportunities.map((opp, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-green-500">•</span>
                          {opp}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Market Timing</p>
                  <p className="text-sm text-foreground">{result.riskAnalysis.marketTiming}</p>
                </div>
              </div>
            )}

            <hr className="border-border" />

            {/* Negotiation Leverage */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection("negotiation")}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Negotiation Strategy
                </h3>
                {expandedSections.includes("negotiation") ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedSections.includes("negotiation") && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Your leverage:</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    result.negotiationLeverage.leverageLevel === "high" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                    result.negotiationLeverage.leverageLevel === "medium" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" :
                    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {result.negotiationLeverage.leverageLevel.toUpperCase()}
                  </span>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm font-medium text-primary mb-1">Suggested Counter-Offer</p>
                  <p className="text-foreground">{result.negotiationLeverage.suggestedCounterOffer}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Key Talking Points</p>
                  <ul className="space-y-1">
                    {result.negotiationLeverage.talkingPoints.map((point, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <hr className="border-border" />

            {/* Recommendation */}
            <div 
              className="cursor-pointer"
              onClick={() => toggleSection("recommendation")}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Recommendation
                </h3>
                {expandedSections.includes("recommendation") ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedSections.includes("recommendation") && (
              <div className="space-y-4 pt-2">
                <p className="text-foreground">{result.recommendation.decision}</p>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Next Steps</p>
                  <ol className="space-y-1">
                    {result.recommendation.nextSteps.map((step, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-primary font-medium">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Questions to Ask</p>
                  <ul className="space-y-1">
                    {result.recommendation.questionsToAsk.map((q, i) => (
                      <li key={i} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-muted-foreground">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <Button 
              variant="outline" 
              onClick={() => setResult(null)} 
              className="w-full"
            >
              Compare Another Offer
            </Button>
          </div>
        )}
      </Card>
    </section>
  );
};
