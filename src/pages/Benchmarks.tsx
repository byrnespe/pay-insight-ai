import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ArrowRight, Building2, MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { industryBenchmarks, roleLevels, locations } from "@/data/industryBenchmarks";

const Benchmarks = () => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>("technology");
  const [selectedLevel, setSelectedLevel] = useState<string>("mid");
  const [selectedLocation, setSelectedLocation] = useState<string>("sf");

  const industry = industryBenchmarks.find((i) => i.id === selectedIndustry);
  const level = roleLevels.find((l) => l.id === selectedLevel);
  const location = locations.find((l) => l.id === selectedLocation);

  const salaryData = industry?.roles[selectedLevel]?.[selectedLocation];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/salaries" className="text-muted-foreground hover:text-foreground transition-colors">
                Salaries
              </Link>
              <Link to="/benchmarks" className="text-foreground font-medium">
                Benchmarks
              </Link>
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Industry Salary Benchmarks
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Reference salary ranges across industries, experience levels, and locations. 
            Use these benchmarks to understand where you stand.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                Industry
              </label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {industryBenchmarks.map((ind) => (
                    <SelectItem key={ind.id} value={ind.id}>
                      {ind.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                Experience Level
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleLevels.map((lvl) => (
                    <SelectItem key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                Location
              </label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results */}
        {salaryData && industry && level && location && (
          <div className="space-y-6">
            {/* Selected Context */}
            <div className="text-center">
              <h2 className="text-lg font-semibold text-foreground">
                {level.name} in {industry.name}
              </h2>
              <p className="text-sm text-muted-foreground">
                {location.name} • {level.description}
              </p>
            </div>

            {/* Salary Range Display */}
            <Card className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">25th Percentile</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(salaryData.min)}</p>
                  <p className="text-xs text-muted-foreground">Lower end</p>
                </div>
                <div className="border-x border-border px-4">
                  <p className="text-sm text-muted-foreground mb-1">Median</p>
                  <p className="text-3xl font-bold text-primary">{formatCurrency(salaryData.median)}</p>
                  <p className="text-xs text-muted-foreground">Typical</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">75th Percentile</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(salaryData.max)}</p>
                  <p className="text-xs text-muted-foreground">Higher end</p>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-primary/20 rounded-full"
                    style={{ 
                      left: '0%',
                      width: '100%',
                    }}
                  />
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full"
                    style={{ 
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{formatCurrency(salaryData.min)}</span>
                  <span>{formatCurrency(salaryData.max)}</span>
                </div>
              </div>
            </Card>

            {/* Industry Description */}
            <Card className="p-6 bg-muted/30">
              <h3 className="font-medium text-foreground mb-2">{industry.name}</h3>
              <p className="text-sm text-muted-foreground">{industry.description}</p>
            </Card>

            {/* Compare All Levels */}
            <Card className="p-6">
              <h3 className="font-medium text-foreground mb-4">All Experience Levels in {location.name}</h3>
              <div className="space-y-3">
                {roleLevels.map((lvl) => {
                  const levelData = industry.roles[lvl.id]?.[selectedLocation];
                  if (!levelData) return null;
                  const isSelected = lvl.id === selectedLevel;
                  return (
                    <button
                      key={lvl.id}
                      onClick={() => setSelectedLevel(lvl.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        isSelected 
                          ? "bg-primary/10 border border-primary/20" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="text-left">
                        <p className={`font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {lvl.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{lvl.description}</p>
                      </div>
                      <p className={`font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {formatCurrency(levelData.median)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Disclaimer */}
            <p className="text-xs text-muted-foreground text-center px-4">
              Salary ranges are estimates based on industry surveys and public data. 
              Actual compensation varies based on company size, specific role, negotiation, 
              and individual factors. Total compensation (bonus, equity, benefits) is not included.
            </p>

            {/* CTA */}
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Want a personalized analysis based on your specific situation?
              </p>
              <Link to="/">
                <Button>
                  Get Your Salary Analysis
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
            <Link to="/exploitation-check" className="hover:text-foreground transition-colors">
              Hours Check
            </Link>
            <Link to="/red-flags" className="hover:text-foreground transition-colors">
              Red Flags
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

export default Benchmarks;
