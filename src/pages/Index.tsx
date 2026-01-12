import { useState } from "react";
import { Link } from "react-router-dom";
import { SalaryForm } from "@/components/SalaryForm";
import { SalaryResults } from "@/components/SalaryResults";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { analyzeSalary } from "@/lib/salaryAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null);
  const [formData, setFormData] = useState<SalaryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
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
  const { user, signOut, loading } = useAuth();

  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container flex justify-end py-4">
        {!loading && (
          user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )
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
    </div>;
};
export default Index;