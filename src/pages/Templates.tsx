import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, 
  Crown, 
  Loader2, 
  Copy, 
  Check, 
  ChevronRight,
  TrendingUp,
  HandshakeIcon,
  XCircle,
  CheckCircle,
  Award,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/integrations/backend/config";
import { useSEO } from "@/hooks/useSEO";

interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  prompts: string[];
}

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: "raise_request",
    name: "Raise Request",
    description: "Initial request for a salary increase",
    icon: <TrendingUp className="w-5 h-5" />,
    prompts: [
      "Recent accomplishments or results",
      "Time since last raise",
      "Market rate research findings"
    ]
  },
  {
    id: "offer_counter",
    name: "Offer Counter-Proposal",
    description: "Responding to a job offer with a counter",
    icon: <HandshakeIcon className="w-5 h-5" />,
    prompts: [
      "Original offer details",
      "Your target compensation",
      "Key leverage points"
    ]
  },
  {
    id: "denial_followup",
    name: "Following Up After Denial",
    description: "Professional response when a raise is declined",
    icon: <XCircle className="w-5 h-5" />,
    prompts: [
      "Reason given for denial",
      "What you're asking for next",
      "Timeline for revisiting"
    ]
  },
  {
    id: "offer_acceptance",
    name: "Offer Acceptance",
    description: "Accepting an offer with negotiated terms",
    icon: <CheckCircle className="w-5 h-5" />,
    prompts: [
      "Final agreed terms",
      "Start date",
      "Any remaining items to confirm"
    ]
  },
  {
    id: "offer_decline",
    name: "Declining an Offer",
    description: "Professionally turning down an opportunity",
    icon: <XCircle className="w-5 h-5" />,
    prompts: [
      "Reason for declining (optional)",
      "Maintain relationship emphasis"
    ]
  },
  {
    id: "promotion_request",
    name: "Promotion Request",
    description: "Requesting advancement to a new role",
    icon: <Award className="w-5 h-5" />,
    prompts: [
      "Target role/title",
      "Qualifications and achievements",
      "Business case for promotion"
    ]
  },
  {
    id: "reference_request",
    name: "Reference Request",
    description: "Asking a colleague or manager to be a reference",
    icon: <Users className="w-5 h-5" />,
    prompts: [
      "Your relationship to them",
      "Role you're applying for",
      "Specific skills to highlight"
    ]
  }
];

const Templates = () => {
  useSEO({
    title: "Email Templates | AI-Powered Negotiation Scripts",
    description: "Generate professional email templates for salary negotiations, raise requests, offer counter-proposals, and more. Pro feature.",
    canonical: "/templates",
    noIndex: true, // Pro-only feature, don't index
  });

  const navigate = useNavigate();
  const { user, session, loading, isPro } = useAuth();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [context, setContext] = useState("");
  const [generatedTemplate, setGeneratedTemplate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectCategory = (category: TemplateCategory) => {
    setSelectedCategory(category);
    setGeneratedTemplate("");
    setContext("");
  };

  const handleGenerate = async () => {
    if (!session?.access_token || !selectedCategory) return;

    setIsGenerating(true);
    setGeneratedTemplate("");

    try {
      const response = await fetch(
        `${BACKEND_URL}/functions/v1/generate-email-template`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            category: selectedCategory.id,
            context: context,
          }),
        }
      );

      if (response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please wait a moment and try again.",
          variant: "destructive",
        });
        return;
      }

      if (response.status === 402) {
        toast({
          title: "Usage limit reached",
          description: "Please add credits to continue using AI features.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to generate template");
      }

      const data = await response.json();
      setGeneratedTemplate(data.template);
    } catch (error) {
      console.error("Error generating template:", error);
      toast({
        title: "Error",
        description: "Failed to generate template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Template copied to clipboard.",
    });
  };

  const handleBack = () => {
    setSelectedCategory(null);
    setGeneratedTemplate("");
    setContext("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/icons/icon-180.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/templates" className="text-foreground font-medium">
                Templates
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Email Templates</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered templates for workplace negotiations.
            </p>
          </div>
          <Badge variant="default" className="w-fit flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            Pro Feature
          </Badge>
        </div>

        {/* Not Pro - Upgrade prompt */}
        {!isPro && (
          <Card className="p-8 text-center">
            <Crown className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Pro Feature</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Generate professional email templates for raises, offers, promotions, and more. Available for Pro subscribers.
            </p>
            <Link to="/?upgrade=pro">
              <Button>Upgrade to Pro</Button>
            </Link>
          </Card>
        )}

        {/* Pro user - Category selection */}
        {isPro && !selectedCategory && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Choose a template type</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {TEMPLATE_CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 cursor-pointer hover:bg-muted/50 transition-colors group"
                  onClick={() => handleSelectCategory(category)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Pro user - Template generator */}
        {isPro && selectedCategory && (
          <div className="space-y-6">
            {/* Back button */}
            <Button variant="ghost" size="sm" onClick={handleBack}>
              ← Back to templates
            </Button>

            {/* Selected category header */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {selectedCategory.icon}
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{selectedCategory.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                </div>
              </div>
            </Card>

            {/* Context input */}
            <div className="space-y-3">
              <Label htmlFor="context">
                Provide context for your template (optional)
              </Label>
              <div className="text-sm text-muted-foreground mb-2">
                Consider including:
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {selectedCategory.prompts.map((prompt, i) => (
                    <li key={i}>{prompt}</li>
                  ))}
                </ul>
              </div>
              <Textarea
                id="context"
                placeholder="e.g., I've been in this role for 2 years, recently led a project that increased revenue by 15%, and haven't had a raise since joining..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Generate button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full sm:w-auto"
            >
              {isGenerating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isGenerating ? "Generating..." : "Generate Template"}
            </Button>

            {/* Generated template */}
            {generatedTemplate && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Generated Template</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <Card className="p-4">
                  <pre className="whitespace-pre-wrap text-sm text-foreground font-sans leading-relaxed">
                    {generatedTemplate}
                  </pre>
                </Card>
                <p className="text-xs text-muted-foreground">
                  Review and customize the template before sending. Replace any [PLACEHOLDER] text with your specific details.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Not logged in */}
        {!user && !loading && (
          <Card className="p-8 text-center">
            <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign In Required</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Sign in to access AI-powered email templates for workplace negotiations.
            </p>
            <Link to="/auth?returnTo=/templates">
              <Button>Sign In</Button>
            </Link>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Calculator
            </Link>
            <Link to="/salaries" className="hover:text-foreground transition-colors">
              Salaries
            </Link>
            <Link to="/benchmarks" className="hover:text-foreground transition-colors">
              Benchmarks
            </Link>
            <Link to="/dashboard" className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Underpaid. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Templates;
