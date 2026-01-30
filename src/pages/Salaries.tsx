import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import { SalaryBrowser } from "@/components/SalaryBrowser";
import { SalarySubmissionForm } from "@/components/SalarySubmissionForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/backend/client";
import { useSEO } from "@/hooks/useSEO";

const Salaries = () => {
  useSEO({
    title: "Anonymous Salary Database | Real Salaries Shared by Professionals",
    description: "Browse anonymous salary data shared by real professionals. Contribute your salary to unlock full access to community compensation insights.",
    canonical: "/salaries",
  });
  const { user } = useAuth();
  const [hasFullAccess, setHasFullAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [showContributePrompt, setShowContributePrompt] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [user]);

  const checkAccess = async () => {
    const localContributions = JSON.parse(
      localStorage.getItem("salary_contributions") || "[]"
    );
    if (localContributions.length > 0) {
      setHasFullAccess(true);
      setIsCheckingAccess(false);
      return;
    }

    if (user) {
      try {
        const { data, error } = await supabase
          .from("salary_contributions")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        if (!error && data && data.length > 0) {
          setHasFullAccess(true);
        }
      } catch (error) {
        console.error("Error checking contributions:", error);
      }
    }

    setIsCheckingAccess(false);
  };

  const handleContributionSuccess = () => {
    setHasFullAccess(true);
    setShowContributePrompt(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activePage="salaries" />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Anonymous Salary Board</h1>
            </div>
            <p className="text-muted-foreground max-w-xl">
              Real salary data shared anonymously by the community. Contribute yours to unlock full access.
            </p>
          </div>
          <SalarySubmissionForm onSuccess={handleContributionSuccess} />
        </div>

        {/* How it works */}
        {!hasFullAccess && !isCheckingAccess && (
          <Card className="p-4 mb-6 bg-muted/50">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Limited Preview Mode</p>
                <p>
                  You're seeing a preview of 5 salary entries. Share your own salary anonymously
                  to unlock full access to all community data. Your contribution helps others
                  while giving you complete visibility into market rates.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Browser */}
        <SalaryBrowser
          hasFullAccess={hasFullAccess}
          onRequestAccess={() => setShowContributePrompt(true)}
        />

        {/* Footer info */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">100%</p>
              <p className="text-sm text-muted-foreground">Anonymous</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">Community</p>
              <p className="text-sm text-muted-foreground">Driven</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-1">Real</p>
              <p className="text-sm text-muted-foreground">Data</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Calculator
            </Link>
            <Link to="/benchmarks" className="hover:text-foreground transition-colors">
              Benchmarks
            </Link>
            <Link to="/exploitation-check" className="hover:text-foreground transition-colors">
              Hours Check
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
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

export default Salaries;
