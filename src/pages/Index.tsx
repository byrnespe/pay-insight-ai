import { useState } from "react";
import { Link } from "react-router-dom";
import { SalaryForm } from "@/components/SalaryForm";
import { SalaryResults } from "@/components/SalaryResults";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { analyzeSalary } from "@/lib/salaryAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Crown, LogOut, Settings, FileText } from "lucide-react";

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
      <nav className="container flex justify-end items-center gap-3 py-4">
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

            {/* Trust indicators */}
            <footer className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                Your data is analyzed securely and never stored.
              </p>
            </footer>
          </> : <div className="max-w-xl mx-auto">
            <SalaryResults analysis={analysis} formData={formData!} onReset={handleReset} />
          </div>}
      </div>
    </div>
  );
};

export default Index;