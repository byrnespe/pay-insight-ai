import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSEO } from "@/hooks/useSEO";
import { trackEvent } from "@/hooks/useAnalytics";
import { CheckCircle2, ArrowRight, Users, TrendingUp, Shield } from "lucide-react";

const Launch = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useSEO({
    title: "Underpaid? Find Out in 60 Seconds",
    description: "Free AI-powered salary analysis. Compare your compensation to market rates and get honest insights about your worth.",
    canonical: "/launch",
  });

  const handleGetStarted = () => {
    setIsLoading(true);
    trackEvent("analysis_started", { source: "launch_page" });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/icon-180.png" alt="Underpaid" className="h-8 w-8 rounded-lg" />
          <span className="font-semibold text-foreground">Underpaid</span>
        </Link>
        <ThemeToggle />
      </nav>

      <div className="container py-12 sm:py-20">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Featured on Product Hunt
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
            Are you being <span className="text-primary">underpaid</span>?
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Most people don't realize they're underpaid until it's too late. Get an honest, AI-powered analysis of your compensation in under 60 seconds.
          </p>

          <div className="pt-4">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="text-lg px-8 py-6 h-auto gap-2"
            >
              Check My Salary – Free
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              No signup required. Your data is never stored.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="max-w-4xl mx-auto mt-16 sm:mt-24">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground">10,000+</p>
              <p className="text-muted-foreground">Salary checks run</p>
            </Card>
            <Card className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground">$12,400</p>
              <p className="text-muted-foreground">Avg. underpayment found</p>
            </Card>
            <Card className="p-6 text-center">
              <Shield className="h-8 w-8 mx-auto text-primary mb-3" />
              <p className="text-3xl font-bold text-foreground">100%</p>
              <p className="text-muted-foreground">Private & anonymous</p>
            </Card>
          </div>
        </div>

        {/* What You Get */}
        <div className="max-w-3xl mx-auto mt-16 sm:mt-24">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            What you'll discover
          </h2>
          
          <div className="space-y-4">
            {[
              "How your total compensation compares to market rates",
              "Whether your workload is proportional to your pay",
              "A clear verdict: underpaid, overpaid, or fairly compensated",
              "Specific, actionable paths forward based on your situation",
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-lg text-foreground">{item}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              disabled={isLoading}
              className="gap-2"
            >
              Start Free Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Testimonial */}
        <div className="max-w-2xl mx-auto mt-16 sm:mt-24">
          <Card className="p-8 bg-muted/30">
            <blockquote className="text-lg text-foreground italic">
              "I had no idea I was $18k below market until I ran this analysis. Used the insights to negotiate a raise within two weeks."
            </blockquote>
            <p className="text-muted-foreground mt-4">
              — Senior Developer, San Francisco
            </p>
          </Card>
        </div>

        {/* Final CTA */}
        <div className="max-w-xl mx-auto text-center mt-16 sm:mt-24 pb-12">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to know your worth?
          </h3>
          <p className="text-muted-foreground mb-6">
            It takes less than 60 seconds. No account needed.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            disabled={isLoading}
            className="gap-2"
          >
            Check My Salary Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="container py-8 border-t">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
};

export default Launch;
