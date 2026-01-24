import { useState } from "react";
import { Plus, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/backend/client";
import { Link } from "react-router-dom";

const INDUSTRIES = [
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

const COMPANY_SIZES = [
  { value: "startup", label: "Startup (1-50)" },
  { value: "small", label: "Small (51-200)" },
  { value: "medium", label: "Medium (201-1000)" },
  { value: "large", label: "Large (1001-5000)" },
  { value: "enterprise", label: "Enterprise (5000+)" },
];

interface SalarySubmissionFormProps {
  onSuccess: () => void;
}

export function SalarySubmissionForm({ onSuccess }: SalarySubmissionFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    job_title: "",
    industry: "",
    location: "",
    years_experience: "",
    base_salary: "",
    bonus: "",
    equity_value: "",
    company_size: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      // Insert anonymous salary (no contributor_id to ensure true anonymity)
      const { data: salaryData, error: salaryError } = await supabase
        .from("anonymous_salaries")
        .insert({
          job_title: formData.job_title,
          industry: formData.industry,
          location: formData.location,
          years_experience: parseInt(formData.years_experience),
          base_salary: parseInt(formData.base_salary),
          bonus: formData.bonus ? parseInt(formData.bonus) : 0,
          equity_value: formData.equity_value ? parseInt(formData.equity_value) : 0,
          company_size: formData.company_size || null,
        })
        .select()
        .single();

      if (salaryError) throw salaryError;

      // Track contribution for access control
      const { error: contributionError } = await supabase
        .from("salary_contributions")
        .insert({
          user_id: user.id,
          contribution_id: salaryData.id,
        });

      if (contributionError) throw contributionError;

      // Store contribution in localStorage for non-auth users
      const contributions = JSON.parse(
        localStorage.getItem("salary_contributions") || "[]"
      );
      contributions.push(salaryData.id);
      localStorage.setItem("salary_contributions", JSON.stringify(contributions));

      toast({
        title: "Contribution submitted",
        description: "Thank you for contributing. You now have full access to all salary data.",
      });

      setOpen(false);
      setFormData({
        job_title: "",
        industry: "",
        location: "",
        years_experience: "",
        base_salary: "",
        bonus: "",
        equity_value: "",
        company_size: "",
      });
      onSuccess();
    } catch (error) {
      console.error("Error submitting salary:", error);
      toast({
        title: "Error",
        description: "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Link to="/auth?returnTo=/salaries">
        <Button>
          <Lock className="w-4 h-4 mr-2" />
          Sign in to Contribute
        </Button>
      </Link>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Contribute Your Salary
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share Your Salary Anonymously</DialogTitle>
          <DialogDescription>
            Your data will be shared anonymously. Contributing unlocks full access to all salary data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                placeholder="e.g., Software Engineer"
                value={formData.job_title}
                onChange={(e) =>
                  setFormData({ ...formData, job_title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData({ ...formData, industry: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., San Francisco, CA"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="years_experience">Years of Experience</Label>
              <Input
                id="years_experience"
                type="number"
                placeholder="5"
                min="0"
                max="50"
                value={formData.years_experience}
                onChange={(e) =>
                  setFormData({ ...formData, years_experience: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base_salary">Base Salary ($)</Label>
              <Input
                id="base_salary"
                type="number"
                placeholder="100000"
                value={formData.base_salary}
                onChange={(e) =>
                  setFormData({ ...formData, base_salary: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bonus">Bonus ($)</Label>
              <Input
                id="bonus"
                type="number"
                placeholder="10000"
                value={formData.bonus}
                onChange={(e) =>
                  setFormData({ ...formData, bonus: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="equity_value">Equity Value ($)</Label>
              <Input
                id="equity_value"
                type="number"
                placeholder="25000"
                value={formData.equity_value}
                onChange={(e) =>
                  setFormData({ ...formData, equity_value: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_size">Company Size (optional)</Label>
            <Select
              value={formData.company_size}
              onValueChange={(value) =>
                setFormData({ ...formData, company_size: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Anonymously
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
