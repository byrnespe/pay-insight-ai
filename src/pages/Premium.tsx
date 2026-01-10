import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  MessageSquare, 
  Lightbulb, 
  Briefcase, 
  Copy, 
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Download,
  Lock
} from "lucide-react";
import { PremiumInsights } from "@/types/premium";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { RejectionResponseGenerator } from "@/components/RejectionResponseGenerator";

const Premium = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, premium, loading: authLoading } = useAuth();
  
  const [insights, setInsights] = useState<PremiumInsights | null>(null);
  const [formData, setFormData] = useState<SalaryFormData | null>(null);
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [expandedRoles, setExpandedRoles] = useState<number[]>([]);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    const loadInsights = async () => {
      const storedFormData = sessionStorage.getItem("underpaid_formData");
      const storedAnalysis = sessionStorage.getItem("underpaid_analysis");

      if (!storedFormData || !storedAnalysis) {
        setError("Session expired. Please run a new analysis.");
        setIsLoading(false);
        return;
      }

      const parsedFormData: SalaryFormData = JSON.parse(storedFormData);
      const parsedAnalysis: SalaryAnalysis = JSON.parse(storedAnalysis);
      
      setFormData(parsedFormData);
      setAnalysis(parsedAnalysis);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-premium-insights`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
            body: JSON.stringify({ formData: parsedFormData, analysis: parsedAnalysis }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate insights");
        }

        const data = await response.json();
        setInsights(data);
      } catch (err) {
        console.error("Error loading insights:", err);
        setError("Failed to generate premium insights. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, []);

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleRole = (index: number) => {
    setExpandedRoles(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getFullScript = () => {
    if (!insights) return "";
    const s = insights.negotiationScript;
    return `${s.opening}\n\n${s.valueProposition}\n\n${s.askStatement}\n\n${s.handlePushback}\n\n${s.closing}`;
  };

  const handleDownloadPdf = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download PDF reports.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!premium.isPremium) {
      toast({
        title: "Premium required",
        description: "PDF export is available for premium subscribers.",
        variant: "destructive",
      });
      return;
    }

    if (!formData || !analysis || !insights) return;

    setIsPdfLoading(true);
    try {
      const { data: { session } } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getSession());
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ formData, analysis, insights }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate PDF");
      }

      const { html } = await response.json();
      
      // Open HTML in new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.print();
      }

      toast({ title: "PDF ready", description: "Use your browser's print dialog to save as PDF." });
    } catch (err) {
      console.error("PDF generation error:", err);
      toast({
        title: "PDF generation failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Generating your premium insights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md mx-auto px-4">
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate("/")}>Start New Analysis</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 sm:py-16 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </button>

          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={isPdfLoading || !premium.isPremium}
          >
            {isPdfLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : !premium.isPremium ? (
              <Lock className="w-4 h-4 mr-2" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isPdfLoading ? "Generating..." : "Export PDF"}
          </Button>
        </div>

        <header className="mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Your Premium Insights
          </h1>
          <p className="text-muted-foreground">
            Personalized strategies to maximize your earning potential.
          </p>
          {premium.isPremium && (
            <p className="text-sm text-success mt-2">
              ✓ Premium {premium.type === "lifetime" ? "(Lifetime)" : "(Monthly)"}
            </p>
          )}
        </header>

        {insights && (
          <div className="space-y-10">
            {/* Negotiation Script */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Negotiation Script</h2>
              </div>
              
              <Card className="p-6 space-y-4">
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(getFullScript(), "script")}
                  >
                    {copiedSection === "script" ? (
                      <><Check className="w-4 h-4 mr-2" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4 mr-2" /> Copy Full Script</>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Opening</p>
                    <p className="text-foreground">{insights.negotiationScript.opening}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Your Value Proposition</p>
                    <p className="text-foreground">{insights.negotiationScript.valueProposition}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">The Ask</p>
                    <p className="text-foreground font-medium">{insights.negotiationScript.askStatement}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Handling Pushback</p>
                    <p className="text-foreground">{insights.negotiationScript.handlePushback}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Closing</p>
                    <p className="text-foreground">{insights.negotiationScript.closing}</p>
                  </div>
                </div>
              </Card>
            </section>

            {/* What If They Say No - Pro Feature */}
            {formData && analysis && (
              <RejectionResponseGenerator formData={formData} analysis={analysis} />
            )}

            {/* Talking Points */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Talking Points</h2>
              </div>

              <div className="space-y-3">
                {insights.talkingPoints.map((tp, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <div className="space-y-2">
                        <p className="font-medium text-foreground">{tp.point}</p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Evidence:</span> {tp.evidence}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">How to deliver:</span> {tp.delivery}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Alternative Roles */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Higher-Paying Alternatives</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                10 roles that could increase your compensation based on your skills.
              </p>

              <div className="space-y-3">
                {insights.alternativeRoles.map((role, index) => (
                  <Card key={index} className="overflow-hidden">
                    <button
                      onClick={() => toggleRole(index)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-semibold text-success">{role.salaryIncrease}</span>
                        <div>
                          <p className="font-medium text-foreground">{role.title}</p>
                          <p className="text-sm text-muted-foreground">{role.industry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-foreground hidden sm:block">
                          {role.salaryRange}
                        </span>
                        {expandedRoles.includes(index) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    
                    {expandedRoles.includes(index) && (
                      <div className="px-4 pb-4 pt-0 border-t border-border">
                        <div className="pt-4 space-y-3">
                          <p className="text-sm text-muted-foreground sm:hidden">
                            <span className="font-medium">Salary:</span> {role.salaryRange}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">How to transition:</span> {role.transitionPath}
                          </p>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Key skills needed:</p>
                            <div className="flex flex-wrap gap-2">
                              {role.keySkills.map((skill, i) => (
                                <span 
                                  key={i} 
                                  className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Premium;
