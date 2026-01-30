import { useState } from "react";
import { Link } from "react-router-dom";
import { SalaryForm } from "@/components/SalaryForm";
import { SalaryResults } from "@/components/SalaryResults";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { analyzeSalary } from "@/lib/salaryAnalysis";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navigation } from "@/components/Navigation";

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
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();

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

  return (
    <div className="min-h-screen bg-background">
      <Navigation activePage="home" />

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
                Your data is analyzed securely.
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
                {isAdmin && (
                  <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                    Admin
                  </Link>
                )}
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
