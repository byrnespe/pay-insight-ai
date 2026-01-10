import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Loader2, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Lock,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { RejectionResponse } from "@/types/premium";

interface RejectionResponseGeneratorProps {
  formData: SalaryFormData;
  analysis: SalaryAnalysis;
}

export function RejectionResponseGenerator({ formData, analysis }: RejectionResponseGeneratorProps) {
  const { toast } = useToast();
  const { session, canAccessFeature } = useAuth();
  
  const [responses, setResponses] = useState<RejectionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [customScenario, setCustomScenario] = useState("");
  const [expandedResponses, setExpandedResponses] = useState<number[]>([0]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const isProSubscriber = canAccessFeature("rejection_responses");

  const generateResponses = async (scenario?: string) => {
    if (!isProSubscriber) {
      toast({
        title: "Pro subscription required",
        description: "This feature is available for Pro subscribers only.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-rejection-responses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ 
            formData, 
            analysis,
            scenario: scenario || undefined 
          }),
        }
      );

      if (response.status === 403) {
        toast({
          title: "Pro subscription required",
          description: "Upgrade to Pro to access this feature.",
          variant: "destructive",
        });
        return;
      }

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment and try again.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to generate responses");
      }

      const data = await response.json();
      setResponses(data.responses || []);
      setHasGenerated(true);
      setExpandedResponses([0]); // Expand first response
    } catch (error) {
      console.error("Error generating rejection responses:", error);
      toast({
        title: "Generation failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleResponse = (index: number) => {
    setExpandedResponses(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleCustomScenario = () => {
    if (customScenario.trim()) {
      generateResponses(customScenario.trim());
    }
  };

  if (!isProSubscriber) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">What If They Say No?</h2>
          <span className="bg-gradient-to-r from-success to-success/80 text-success-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Pro
          </span>
        </div>

        <Card className="p-6 border-dashed">
          <div className="text-center space-y-3">
            <Lock className="w-8 h-8 mx-auto text-muted-foreground" />
            <h3 className="font-medium text-foreground">Pro Feature</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Get battle-tested responses for handling rejections and objections during your salary negotiation.
            </p>
            <Button variant="outline" disabled>
              Upgrade to Pro to unlock
            </Button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">What If They Say No?</h2>
        <span className="bg-gradient-to-r from-success to-success/80 text-success-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Pro
        </span>
      </div>

      {!hasGenerated ? (
        <Card className="p-6 space-y-4">
          <p className="text-muted-foreground">
            Generate personalized responses for handling common objections and rejections during your salary negotiation.
          </p>
          
          <div className="space-y-3">
            <Button 
              onClick={() => generateResponses()} 
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Generate Rejection Responses
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>or</span>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Enter a specific objection you're worried about..."
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomScenario()}
              />
              <Button 
                variant="outline" 
                onClick={handleCustomScenario}
                disabled={isLoading || !customScenario.trim()}
              >
                Generate
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Regenerate options */}
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => generateResponses()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              Regenerate All
            </Button>
            <div className="flex gap-2 flex-1 min-w-[200px]">
              <Input
                placeholder="Custom scenario..."
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomScenario()}
                className="text-sm"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleCustomScenario}
                disabled={isLoading || !customScenario.trim()}
              >
                Go
              </Button>
            </div>
          </div>

          {/* Responses list */}
          <div className="space-y-3">
            {responses.map((resp, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleResponse(index)}
                  className="w-full p-4 flex items-start justify-between text-left hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">{resp.scenario}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        "{resp.objection}"
                      </p>
                    </div>
                  </div>
                  {expandedResponses.includes(index) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {expandedResponses.includes(index) && (
                  <div className="px-4 pb-4 pt-0 border-t border-border">
                    <div className="pt-4 space-y-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                          They might say:
                        </p>
                        <p className="text-sm text-foreground italic">"{resp.objection}"</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-muted-foreground uppercase">
                            Your response:
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(resp.response, index)}
                            className="h-7 px-2"
                          >
                            {copiedIndex === index ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <p className="text-foreground bg-muted/50 p-3 rounded-lg">
                          {resp.response}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase mb-1">
                          Follow up with:
                        </p>
                        <p className="text-sm text-muted-foreground">{resp.followUp}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
