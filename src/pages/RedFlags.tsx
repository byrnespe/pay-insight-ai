import { useState } from "react";
import { Link } from "react-router-dom";
import { Flag, ArrowRight, Check, AlertTriangle, AlertCircle, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CareerToolsMenu } from "@/components/CareerToolsMenu";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { redFlagCategories, getScoreInterpretation } from "@/data/redFlags";
import { useSEO } from "@/hooks/useSEO";

const RedFlags = () => {
  useSEO({
    title: "Company Red Flags Checklist | Workplace Warning Signs",
    description: "Identify warning signs in your workplace with our interactive red flags checklist. Evaluate compensation, workload, management, and culture concerns.",
    canonical: "/red-flags",
  });
  const [selectedFlags, setSelectedFlags] = useState<Set<string>>(new Set());
  const [showResults, setShowResults] = useState(false);

  const toggleFlag = (id: string) => {
    const newSelected = new Set(selectedFlags);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFlags(newSelected);
  };

  const totalScore = selectedFlags.size;
  const interpretation = getScoreInterpretation(totalScore);

  const getCategoryScore = (categoryId: string) => {
    return Array.from(selectedFlags).filter((id) => id.startsWith(categoryId.substring(0, 4))).length;
  };

  const getSeverityIcon = (severity: "moderate" | "significant" | "critical") => {
    switch (severity) {
      case "critical":
        return <ShieldAlert className="w-4 h-4 text-destructive" />;
      case "significant":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getResultIcon = () => {
    switch (interpretation.level) {
      case "critical":
        return <ShieldAlert className="w-12 h-12 text-destructive" />;
      case "high":
        return <AlertTriangle className="w-12 h-12 text-warning" />;
      case "moderate":
        return <AlertCircle className="w-12 h-12 text-muted-foreground" />;
      default:
        return <Check className="w-12 h-12 text-success" />;
    }
  };

  const getResultColorClass = () => {
    switch (interpretation.level) {
      case "critical":
        return "border-destructive/50 bg-destructive/5";
      case "high":
        return "border-warning/50 bg-warning/5";
      case "moderate":
        return "border-border";
      default:
        return "border-success/50 bg-success/5";
    }
  };

  const handleReset = () => {
    setSelectedFlags(new Set());
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
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
              <CareerToolsMenu />
              <Link to="/salaries" className="text-muted-foreground hover:text-foreground transition-colors">
                Salaries
              </Link>
              <Link to="/benchmarks" className="text-muted-foreground hover:text-foreground transition-colors">
                Benchmarks
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Flag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Company Red Flags Checklist
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Identify warning signs in your workplace. Select any statements that apply to your current situation.
          </p>
        </div>

        {!showResults ? (
          <>
            {/* Checklist */}
            <Accordion type="multiple" defaultValue={["compensation", "workload", "management", "culture"]} className="space-y-4">
              {redFlagCategories.map((category) => (
                <AccordionItem key={category.id} value={category.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{category.name}</span>
                      {getCategoryScore(category.id) > 0 && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                          {getCategoryScore(category.id)} selected
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <div className="space-y-3">
                      {category.questions.map((question) => (
                        <label
                          key={question.id}
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <Checkbox
                            checked={selectedFlags.has(question.id)}
                            onCheckedChange={() => toggleFlag(question.id)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 flex items-start gap-2">
                            <span className="text-sm text-foreground leading-relaxed">
                              {question.question}
                            </span>
                            {getSeverityIcon(question.severity)}
                          </div>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                {totalScore === 0
                  ? "Select any statements that apply to your situation"
                  : `${totalScore} ${totalScore === 1 ? "flag" : "flags"} selected`}
              </p>
              <Button onClick={() => setShowResults(true)} size="lg">
                See My Results
              </Button>
            </div>
          </>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Main Result */}
            <Card className={`p-8 text-center ${getResultColorClass()}`}>
              <div className="mb-4">{getResultIcon()}</div>
              <p className="text-4xl font-bold text-foreground mb-2">
                {totalScore} {totalScore === 1 ? "Flag" : "Flags"}
              </p>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                {interpretation.title}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                {interpretation.description}
              </p>
            </Card>

            {/* Category Breakdown */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Breakdown by Category</h3>
              <div className="space-y-3">
                {redFlagCategories.map((category) => {
                  const score = getCategoryScore(category.id);
                  const maxScore = category.questions.length;
                  return (
                    <div key={category.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{category.name}</span>
                      <span className={`font-medium ${score > maxScore / 2 ? "text-destructive" : "text-foreground"}`}>
                        {score} / {maxScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Selected Flags */}
            {totalScore > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Identified Concerns</h3>
                <ul className="space-y-2">
                  {redFlagCategories.flatMap((category) =>
                    category.questions
                      .filter((q) => selectedFlags.has(q.id))
                      .map((q) => (
                        <li key={q.id} className="flex items-start gap-2 text-sm text-muted-foreground">
                          {getSeverityIcon(q.severity)}
                          <span>{q.question}</span>
                        </li>
                      ))
                  )}
                </ul>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Start Over
              </Button>
              <Link to="/" className="flex-1">
                <Button className="w-full">
                  Run Salary Analysis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Salary Check
            </Link>
            <Link to="/salaries" className="hover:text-foreground transition-colors">
              Salaries
            </Link>
            <Link to="/benchmarks" className="hover:text-foreground transition-colors">
              Benchmarks
            </Link>
            <Link to="/cost-of-staying" className="hover:text-foreground transition-colors">
              Cost of Staying
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
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

export default RedFlags;
