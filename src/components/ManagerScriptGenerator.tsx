import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  Lock,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { ManagerScript } from "@/types/premium";

interface ManagerScriptGeneratorProps {
  formData: SalaryFormData;
  analysis: SalaryAnalysis;
}

type ManagerType = "supportive" | "skeptical" | "numbers-focused" | "busy" | "new";
type Tone = "assertive" | "collaborative" | "diplomatic";

interface GeneratedScript {
  managerScript: ManagerScript["script"] & { managerType: string; tone: string };
  tips: string[];
  warnings: string[];
  openingVariations: string[];
}

const managerTypes: { value: ManagerType; label: string; description: string; icon: string }[] = [
  { value: "supportive", label: "Supportive", description: "Advocates for their team", icon: "💚" },
  { value: "skeptical", label: "Skeptical", description: "Questions everything", icon: "🤔" },
  { value: "numbers-focused", label: "Numbers-Focused", description: "Data-driven decisions", icon: "📊" },
  { value: "busy", label: "Always Busy", description: "Limited time, needs efficiency", icon: "⏰" },
  { value: "new", label: "New Manager", description: "Doesn't know your history", icon: "🆕" },
];

const tones: { value: Tone; label: string; description: string }[] = [
  { value: "assertive", label: "Assertive", description: "Direct and confident" },
  { value: "collaborative", label: "Collaborative", description: "Partnership-focused" },
  { value: "diplomatic", label: "Diplomatic", description: "Polite but firm" },
];

export function ManagerScriptGenerator({ formData, analysis }: ManagerScriptGeneratorProps) {
  const { toast } = useToast();
  const { session, premium } = useAuth();
  
  const [selectedManager, setSelectedManager] = useState<ManagerType>("supportive");
  const [selectedTone, setSelectedTone] = useState<Tone>("collaborative");
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);

  const isProSubscriber = premium.isPremium && premium.type === "subscription";

  const generateScript = async () => {
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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-manager-scripts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ 
            formData, 
            analysis,
            managerType: selectedManager,
            tone: selectedTone
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
        throw new Error("Failed to generate script");
      }

      const data = await response.json();
      setScript(data);
      setShowTips(false);
      setShowWarnings(false);
    } catch (error) {
      console.error("Error generating manager script:", error);
      toast({
        title: "Generation failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    toast({ title: "Copied to clipboard" });
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getFullScript = () => {
    if (!script) return "";
    const s = script.managerScript;
    return `${s.opening}\n\n${s.valueProposition}\n\n${s.askStatement}\n\n${s.handlePushback}\n\n${s.closing}`;
  };

  if (!isProSubscriber) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Manager-Specific Scripts</h2>
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
              Get negotiation scripts tailored to your manager's personality type, with multiple tone options.
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
          <Users className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Manager-Specific Scripts</h2>
        <span className="bg-gradient-to-r from-success to-success/80 text-success-foreground text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          Pro
        </span>
      </div>

      <Card className="p-6 space-y-6">
        {/* Manager Type Selection */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">What's your manager like?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {managerTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedManager(type.value)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedManager === type.value
                    ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <p className="font-medium text-foreground text-sm mt-1">{type.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tone Selection */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">Choose your tone</p>
          <div className="flex flex-wrap gap-2">
            {tones.map((tone) => (
              <button
                key={tone.value}
                onClick={() => setSelectedTone(tone.value)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  selectedTone === tone.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <span className="font-medium text-sm">{tone.label}</span>
                <span className="text-xs opacity-75 ml-1">· {tone.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          onClick={generateScript} 
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
              <Users className="w-4 h-4 mr-2" />
              Generate {managerTypes.find(m => m.value === selectedManager)?.label} Script
            </>
          )}
        </Button>

        {/* Generated Script */}
        {script && (
          <div className="space-y-6 pt-4 border-t">
            {/* Script Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">
                  Script for <span className="font-medium text-foreground">{script.managerScript.managerType}</span> manager
                  {" · "}<span className="font-medium text-foreground">{script.managerScript.tone}</span> tone
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => copyToClipboard(getFullScript(), "full")}
              >
                {copiedSection === "full" ? (
                  <><Check className="w-4 h-4 mr-2" /> Copied</>
                ) : (
                  <><Copy className="w-4 h-4 mr-2" /> Copy Full Script</>
                )}
              </Button>
            </div>

            {/* Script Sections */}
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Opening</p>
                <p className="text-foreground">{script.managerScript.opening}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Your Value Proposition</p>
                <p className="text-foreground">{script.managerScript.valueProposition}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">The Ask</p>
                <p className="text-foreground font-medium">{script.managerScript.askStatement}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Handling Pushback</p>
                <p className="text-foreground">{script.managerScript.handlePushback}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase mb-1">Closing</p>
                <p className="text-foreground">{script.managerScript.closing}</p>
              </div>
            </div>

            {/* Opening Variations */}
            {script.openingVariations && script.openingVariations.length > 0 && (
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-xs font-medium text-muted-foreground uppercase mb-2">Alternative Opening Lines</p>
                <ul className="space-y-2">
                  {script.openingVariations.map((variation, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary font-medium">{i + 1}.</span>
                      <span>"{variation}"</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips & Warnings */}
            <div className="grid gap-3 sm:grid-cols-2">
              {/* Tips */}
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full text-left"
              >
                <Card className={`p-4 transition-all hover:bg-muted/50 ${showTips ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-success" />
                      <span className="font-medium text-foreground text-sm">Tips for this manager</span>
                    </div>
                    {showTips ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  {showTips && script.tips && (
                    <ul className="mt-3 space-y-2">
                      {script.tips.map((tip, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <Check className="w-3 h-3 text-success mt-1 shrink-0" />
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </button>

              {/* Warnings */}
              <button
                onClick={() => setShowWarnings(!showWarnings)}
                className="w-full text-left"
              >
                <Card className={`p-4 transition-all hover:bg-muted/50 ${showWarnings ? 'bg-muted/50' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      <span className="font-medium text-foreground text-sm">Things to avoid</span>
                    </div>
                    {showWarnings ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  {showWarnings && script.warnings && (
                    <ul className="mt-3 space-y-2">
                      {script.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <AlertTriangle className="w-3 h-3 text-warning mt-1 shrink-0" />
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </button>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
