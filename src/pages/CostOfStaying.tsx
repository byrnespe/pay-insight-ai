import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { TrendingDown, ArrowRight, DollarSign, Calendar, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Navigation } from "@/components/Navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSEO } from "@/hooks/useSEO";
import { FAQSchema } from "@/components/FAQSchema";

const costOfStayingFAQs = [
  {
    question: "How much does staying in an underpaid job cost over time?",
    answer: "The cost compounds significantly. A $20,000 salary gap with 3% annual raises costs approximately $108,000 over 5 years and $230,000 over 10 years. This doesn't include lost retirement contributions, reduced Social Security benefits, and lower future salary negotiations that use your current pay as a baseline.",
  },
  {
    question: "Why does the salary gap compound over time?",
    answer: "Because percentage-based raises apply to your current salary. If you earn $75,000 with a 3% raise, you get $2,250. Someone at market rate of $95,000 with the same 3% raise gets $2,850. The gap grows by $600 each year just from raises alone, and this effect accelerates over time.",
  },
  {
    question: "Should I take a new job just for higher pay?",
    answer: "Not solely for pay, but compensation should be a major factor. Consider total compensation (salary, bonus, equity, benefits), career growth opportunities, work-life balance, and job satisfaction. If you're significantly underpaid and your employer won't adjust, the financial cost of staying often outweighs the comfort of familiarity.",
  },
  {
    question: "How do I know if I'm underpaid compared to market rate?",
    answer: "Research your market value using salary databases like Levels.fyi, Glassdoor, and Payscale. Filter by your exact role, experience level, location, and company size. Also check job postings with published salary ranges for similar positions. If multiple sources suggest you're 10-20%+ below market, you're likely underpaid.",
  },
  {
    question: "Can I recover lost earnings from being underpaid?",
    answer: "Unfortunately, you can never fully recover past lost earnings—that money is gone. However, you can stop future losses by negotiating a raise or changing jobs. The sooner you act, the less cumulative loss you'll experience. Even a mid-career correction saves hundreds of thousands over a remaining career.",
  },
];

interface YearProjection {
  year: number;
  currentPath: number;
  marketPath: number;
  difference: number;
  cumulativeLoss: number;
}

const CostOfStaying = () => {
  useSEO({
    title: "Cost of Staying Calculator | See Your Lost Earnings Over Time",
    description: "Calculate how much staying in an underpaid role costs over 1-10 years. Visualize cumulative earnings loss and the true cost of waiting to negotiate.",
    canonical: "/cost-of-staying",
  });
  const [currentSalary, setCurrentSalary] = useState<number>(75000);
  const [marketRate, setMarketRate] = useState<number>(95000);
  const [annualRaise, setAnnualRaise] = useState<number>(3);
  const [yearsToProject, setYearsToProject] = useState<string>("5");
  const [showResults, setShowResults] = useState(false);

  const handleSalaryChange = (value: string, setter: (v: number) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setter(parseInt(numericValue) || 0);
  };

  const INFLATION_RATE = 3;

  const projections = useMemo((): YearProjection[] => {
    const years = parseInt(yearsToProject);
    const results: YearProjection[] = [];
    let cumulativeLoss = 0;

    for (let i = 1; i <= years; i++) {
      const currentPath = currentSalary * Math.pow(1 + annualRaise / 100, i);
      const marketPath = marketRate * Math.pow(1 + annualRaise / 100, i);
      const difference = marketPath - currentPath;
      cumulativeLoss += difference;

      results.push({
        year: i,
        currentPath,
        marketPath,
        difference,
        cumulativeLoss,
      });
    }

    return results;
  }, [currentSalary, marketRate, annualRaise, yearsToProject]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalCumulativeLoss = projections[projections.length - 1]?.cumulativeLoss || 0;
  const immediateGap = marketRate - currentSalary;
  const percentageUnderpaid = ((marketRate - currentSalary) / marketRate) * 100;

  const calculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <FAQSchema faqs={costOfStayingFAQs} />
      <Navigation />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <TrendingDown className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Cost of Staying Calculator
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            See how much staying in an underpaid role could cost you over time. 
            Small gaps compound into significant differences.
          </p>
        </div>

        {!showResults ? (
          /* Input Form */
          <Card className="p-6">
            <div className="space-y-6">
              {/* Salary Inputs */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Compensation Comparison</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="current">Your Current Salary</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="current"
                        value={currentSalary.toLocaleString()}
                        onChange={(e) => handleSalaryChange(e.target.value, setCurrentSalary)}
                        className="pl-9"
                        placeholder="75,000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="market">Market Rate</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="market"
                        value={marketRate.toLocaleString()}
                        onChange={(e) => handleSalaryChange(e.target.value, setMarketRate)}
                        className="pl-9"
                        placeholder="95,000"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      What you'd earn elsewhere for the same role
                    </p>
                  </div>
                </div>
              </div>

              {/* Projection Settings */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Projection Settings</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>Expected Annual Raise</Label>
                      <span className="text-sm font-medium text-foreground">{annualRaise}%</span>
                    </div>
                    <Slider
                      value={[annualRaise]}
                      onValueChange={(value) => setAnnualRaise(value[0])}
                      min={0}
                      max={10}
                      step={0.5}
                      className="py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Assumed to be the same at both current and market-rate positions
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Years to Project</Label>
                    <Select value={yearsToProject} onValueChange={setYearsToProject}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Year</SelectItem>
                        <SelectItem value="3">3 Years</SelectItem>
                        <SelectItem value="5">5 Years</SelectItem>
                        <SelectItem value="10">10 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={calculate} className="w-full" disabled={currentSalary >= marketRate}>
                {currentSalary >= marketRate ? "Enter a market rate above your salary" : "Calculate Cost of Staying"}
              </Button>
            </div>
          </Card>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Summary */}
            <Card className="p-6 border-destructive/50 bg-destructive/5">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  Total opportunity cost over {yearsToProject} years
                </p>
                <p className="text-4xl font-bold text-destructive mb-2">
                  {formatCurrency(totalCumulativeLoss)}
                </p>
                <p className="text-sm text-muted-foreground">
                  That's {formatCurrency(totalCumulativeLoss / parseInt(yearsToProject))} per year on average
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <DollarSign className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">{formatCurrency(immediateGap)}</p>
                <p className="text-xs text-muted-foreground">Immediate Gap</p>
              </Card>
              <Card className="p-4 text-center">
                <Percent className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">{percentageUnderpaid.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Below Market</p>
              </Card>
              <Card className="p-4 text-center">
                <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
                <p className="text-lg font-semibold text-foreground">{yearsToProject}</p>
                <p className="text-xs text-muted-foreground">Years Projected</p>
              </Card>
            </div>

            {/* Year by Year Table */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Year-by-Year Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-muted-foreground font-medium">Year</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Current Path</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Market Path</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Annual Gap</th>
                      <th className="text-right py-2 text-muted-foreground font-medium">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projections.map((row) => (
                      <tr key={row.year} className="border-b border-border last:border-0">
                        <td className="py-3 text-foreground">Year {row.year}</td>
                        <td className="py-3 text-right text-muted-foreground">{formatCurrency(row.currentPath)}</td>
                        <td className="py-3 text-right text-foreground">{formatCurrency(row.marketPath)}</td>
                        <td className="py-3 text-right text-destructive">{formatCurrency(row.difference)}</td>
                        <td className="py-3 text-right font-medium text-destructive">{formatCurrency(row.cumulativeLoss)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Context */}
            <Card className="p-6 bg-muted/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This calculation assumes both positions receive the same annual raise of {annualRaise}%. 
                The gap between your current salary and market rate compounds over time. 
                Even if you eventually get a raise, you never recover the earnings lost during 
                underpaid years. These figures don't account for additional benefits, retirement 
                matching differences, or inflation-adjusted purchasing power.
              </p>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button variant="outline" onClick={handleReset} className="flex-1">
                Recalculate
              </Button>
              <Link to="/" className="flex-1">
                <Button className="w-full">
                  Get Your Market Rate
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
            <Link to="/exploitation-check" className="hover:text-foreground transition-colors">
              Hours Check
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

export default CostOfStaying;
