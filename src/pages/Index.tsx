import { useState } from "react";
import { SalaryForm } from "@/components/SalaryForm";
import { SalaryResults } from "@/components/SalaryResults";
import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { analyzeSalary } from "@/lib/salaryAnalysis";

const Index = () => {
  const [analysis, setAnalysis] = useState<SalaryAnalysis | null>(null);
  const [formData, setFormData] = useState<SalaryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: SalaryFormData) => {
    setIsLoading(true);
    setFormData(data);
    
    // Simulate API delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const result = analyzeSalary(data);
    setAnalysis(result);
    setIsLoading(false);
  };

  const handleReset = () => {
    setAnalysis(null);
    setFormData(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 sm:py-16">
        {!analysis ? (
          <>
            {/* Header */}
            <header className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
                Am I Underpaid?
              </h1>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Find out if your compensation matches your value. Get honest, data-driven insights in under a minute.
              </p>
            </header>

            {/* Form */}
            <div className="max-w-xl mx-auto">
              <SalaryForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>

            {/* Trust indicators */}
            <footer className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                Your data is never stored or shared. Analysis happens locally.
              </p>
            </footer>
          </>
        ) : (
          <div className="max-w-xl mx-auto">
            <SalaryResults 
              analysis={analysis} 
              formData={formData!} 
              onReset={handleReset} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
