import { useState, useEffect, useMemo } from "react";
import { Search, Filter, Lock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/backend/client";
import { useAuth } from "@/contexts/AuthContext";

interface SalaryEntry {
  id: string;
  job_title: string;
  industry: string;
  location: string;
  years_experience: number;
  base_salary: number;
  bonus: number;
  equity_value: number;
  company_size: string | null;
  submitted_at: string;
}

const INDUSTRIES = [
  "All Industries",
  "Technology",
  "Finance",
  "Healthcare",
  "Marketing",
  "Sales",
  "Engineering",
  "Legal",
  "Education",
  "Other",
];

const EXPERIENCE_RANGES = [
  { label: "All Experience", value: "all" },
  { label: "0-2 years", value: "0-2" },
  { label: "3-5 years", value: "3-5" },
  { label: "6-10 years", value: "6-10" },
  { label: "10+ years", value: "10+" },
];

interface SalaryBrowserProps {
  hasFullAccess: boolean;
  onRequestAccess: () => void;
}

export function SalaryBrowser({ hasFullAccess, onRequestAccess }: SalaryBrowserProps) {
  const [salaries, setSalaries] = useState<SalaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("All Industries");
  const [experienceFilter, setExperienceFilter] = useState("all");

  useEffect(() => {
    fetchSalaries();
  }, []);

  const fetchSalaries = async () => {
    try {
      const { data, error } = await supabase
        .from("anonymous_salaries")
        .select("*")
        .order("submitted_at", { ascending: false })
        .limit(500);

      if (error) throw error;
      setSalaries(data || []);
    } catch (error) {
      console.error("Error fetching salaries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter((salary) => {
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          salary.job_title.toLowerCase().includes(search) ||
          salary.location.toLowerCase().includes(search) ||
          salary.industry.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }

      // Industry filter
      if (industryFilter !== "All Industries" && salary.industry !== industryFilter) {
        return false;
      }

      // Experience filter
      if (experienceFilter !== "all") {
        const exp = salary.years_experience;
        switch (experienceFilter) {
          case "0-2":
            if (exp > 2) return false;
            break;
          case "3-5":
            if (exp < 3 || exp > 5) return false;
            break;
          case "6-10":
            if (exp < 6 || exp > 10) return false;
            break;
          case "10+":
            if (exp < 10) return false;
            break;
        }
      }

      return true;
    });
  }, [salaries, searchTerm, industryFilter, experienceFilter]);

  // Limit visible entries for non-full access users
  const visibleSalaries = hasFullAccess
    ? filteredSalaries
    : filteredSalaries.slice(0, 5);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatCompanySize = (size: string | null) => {
    switch (size) {
      case "startup":
        return "Startup";
      case "small":
        return "Small";
      case "medium":
        return "Medium";
      case "large":
        return "Large";
      case "enterprise":
        return "Enterprise";
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search" className="sr-only">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search job titles, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry" className="sr-only">Industry</Label>
          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experience" className="sr-only">Experience</Label>
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Experience" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {hasFullAccess
            ? `Showing ${filteredSalaries.length} results`
            : `Showing ${visibleSalaries.length} of ${filteredSalaries.length} results`}
        </p>
        {!hasFullAccess && filteredSalaries.length > 5 && (
          <Badge variant="secondary" className="gap-1">
            <Lock className="w-3 h-3" />
            Limited Preview
          </Badge>
        )}
      </div>

      {/* Salary cards */}
      <div className="space-y-3">
        {visibleSalaries.map((salary) => (
          <Card key={salary.id} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{salary.job_title}</h3>
                  {formatCompanySize(salary.company_size) && (
                    <Badge variant="outline" className="text-xs">
                      {formatCompanySize(salary.company_size)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {salary.industry} • {salary.location} • {salary.years_experience} years exp
                </p>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="font-semibold text-foreground">
                    {formatCurrency(salary.base_salary)}
                  </p>
                  <p className="text-xs text-muted-foreground">Base</p>
                </div>
                {salary.bonus > 0 && (
                  <div>
                    <p className="font-medium text-foreground">
                      +{formatCurrency(salary.bonus)}
                    </p>
                    <p className="text-xs text-muted-foreground">Bonus</p>
                  </div>
                )}
                {salary.equity_value > 0 && (
                  <div>
                    <p className="font-medium text-foreground">
                      +{formatCurrency(salary.equity_value)}
                    </p>
                    <p className="text-xs text-muted-foreground">Equity</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}

        {visibleSalaries.length === 0 && (
          <Card className="p-8 text-center">
            <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No salaries match your filters. Try adjusting your search.
            </p>
          </Card>
        )}
      </div>

      {/* Unlock prompt */}
      {!hasFullAccess && filteredSalaries.length > 5 && (
        <Card className="p-6 text-center border-dashed">
          <Lock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-foreground mb-2">
            {filteredSalaries.length - 5} more salaries hidden
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
            Contribute your own salary anonymously to unlock full access to all community data.
          </p>
          <Button onClick={onRequestAccess}>Contribute to Unlock</Button>
        </Card>
      )}
    </div>
  );
}
