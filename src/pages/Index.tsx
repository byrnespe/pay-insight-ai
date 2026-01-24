import { useState } from "react";
import { Link } from "react-router-dom";
import { SalaryForm } from "@/components/SalaryForm";
import { SalaryResults } from "@/components/SalaryResults";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { analyzeSalary } from "@/lib/salaryAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/backend/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { User, Crown, LogOut, Settings, FileText, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const faqItems = [
  {
    question: "How does this tool work?",
    answer: "You enter your job details, salary, and work conditions. Our AI analyzes this against market data to determine if you're being paid fairly for your role, experience, and location. The analysis considers factors like hours worked, stress levels, and job satisfaction to give you a complete picture."
  },
  {
    question: "Is my data stored or shared?",
    answer: "No. Your data is analyzed in real-time and is not stored on our servers. We do not share your information with employers, recruiters, or any third parties. Your privacy is our priority."
  },
  {
    question: "How accurate is the salary analysis?",
    answer: "Our analysis uses current market data and AI to provide estimates. While no tool can be 100% accurate due to the many variables in compensation, our results give you a reliable benchmark for understanding your market position and preparing for salary conversations."
  },
  {
    question: "What do I do if I'm underpaid?",
    answer: "The analysis provides actionable paths forward: negotiate with your current employer, optimize your workload, or explore new opportunities. For more detailed guidance, including manager-specific scripts and rejection response strategies, consider our premium options."
  },
  {
    question: "Do I need to create an account?",
    answer: "No account is required to run a basic analysis. However, creating an account allows you to save your results, access premium features like PDF exports and negotiation scripts, and track your compensation over time."
  }
];

const Index = () => {
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null);
  const [formData, setFormData] = useState<SalaryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isManagingMembership, setIsManagingMembership] = useState(false);
  const { toast } = useToast();
  const { user, signOut, loading, isPro, hasReport } = useAuth();

  const handleSubmit = async (data: SalaryFormData) => {
    setIsLoading(true);
    setFormData(data);
    try {
      const result = await analyzeSalary(data);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Unable to analyze salary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setFormData(null);
  };

  const handleManageMembership = async () => {
    setIsManagingMembership(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to manage your membership.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke("customer-portal");
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to open membership portal");
      }

      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.error("Manage membership error:", error);
      toast({
        title: "Unable to open membership portal",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsManagingMembership(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container py-4">
        {/* Top row: Logo and Sign in */}
        <div className="flex justify-between items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/icons/icon-180.png" alt="Underpaid" className="h-8 w-8 rounded-lg" />
            <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          {!loading && (
            <>
              {/* Quick access button for members */}
              {user && (isPro || hasReport) && (
                <Button asChild variant="outline" size="sm" className="gap-2">
                  <Link to="/premium">
                    {isPro ? <Crown className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                    {isPro ? "Premium Insights" : "View Report"}
                  </Link>
                </Button>
              )}
              
              {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {isPro ? "Pro Member" : hasReport ? "Report Purchased" : "Free Account"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Dashboard link for all logged-in users */}
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Pro members get Premium Insights + Manage Membership */}
                  {isPro && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/premium" className="cursor-pointer">
                          <Crown className="mr-2 h-4 w-4" />
                          Premium Insights
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleManageMembership} 
                        className="cursor-pointer"
                        disabled={isManagingMembership}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        {isManagingMembership ? "Opening..." : "Manage Membership"}
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* One-time report users get View Report + Upgrade to Pro */}
                  {!isPro && hasReport && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/premium" className="cursor-pointer">
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/premium" className="cursor-pointer">
                          <Crown className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {/* Free users only get Upgrade to Pro */}
                  {!isPro && !hasReport && (
                    <DropdownMenuItem asChild>
                      <Link to="/premium" className="cursor-pointer">
                        <Crown className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>
            )}
            </>
          )}
          </div>
        </div>
        
        {/* Second row: Nav Links */}
        <div className="flex items-center justify-center gap-4 text-sm mt-3">
          <Link to="/salaries" className="text-muted-foreground hover:text-foreground transition-colors">
            Salaries
          </Link>
          <Link to="/benchmarks" className="text-muted-foreground hover:text-foreground transition-colors">
            Benchmarks
          </Link>
          <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
            Blog
          </Link>
        </div>
      </nav>

      <div className="container py-8 sm:py-12">
        {!analysis ? <>
            {/* Header */}
            <header className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Underpaid?</h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Find out if your compensation matches your value. Get honest, AI-driven insights in under a minute.
              </p>
            </header>

            {/* Form */}
            <div className="max-w-xl mx-auto">
              <SalaryForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* FAQ Section */}
            <section className="mt-20 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground text-center mb-6">
                Frequently Asked Questions
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Footer */}
            <footer className="mt-16 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                Your data is analyzed securely and never stored.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link to="/salaries" className="text-muted-foreground hover:text-foreground transition-colors">
                  Salaries
                </Link>
                <Link to="/benchmarks" className="text-muted-foreground hover:text-foreground transition-colors">
                  Benchmarks
                </Link>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms
                </Link>
              </div>
            </footer>
          </> : <div className="max-w-xl mx-auto">
            <SalaryResults analysis={analysis} formData={formData!} onReset={handleReset} />
          </div>}
      </div>
    </div>
  );
};

export default Index;