import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SalaryFormData } from "@/types/salary";

interface SalaryFormProps {
  onSubmit: (data: SalaryFormData) => void;
  isLoading: boolean;
}

export function SalaryForm({ onSubmit, isLoading }: SalaryFormProps) {
  const [formData, setFormData] = useState<SalaryFormData>({
    jobTitle: "",
    industry: "",
    location: "",
    yearsExperience: 3,
    currentSalary: 70000,
    bonus: 0,
    hoursPerWeek: 40,
    stressLevel: 5,
    jobSatisfaction: 5,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof SalaryFormData>(
    field: K,
    value: SalaryFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Your Role</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g., Senior Software Engineer"
              value={formData.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g., Technology, Finance"
              value={formData.industry}
              onChange={(e) => updateField("industry", e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={formData.location}
              onChange={(e) => updateField("location", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experience">Years of Experience</Label>
            <Input
              id="experience"
              type="number"
              min={0}
              max={50}
              value={formData.yearsExperience}
              onChange={(e) => updateField("yearsExperience", parseInt(e.target.value) || 0)}
              required
            />
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Compensation</h2>
        
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="salary">Annual Salary ($)</Label>
            <Input
              id="salary"
              type="number"
              min={0}
              step={1000}
              value={formData.currentSalary}
              onChange={(e) => updateField("currentSalary", parseInt(e.target.value) || 0)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bonus">Annual Bonus / Commission ($)</Label>
            <Input
              id="bonus"
              type="number"
              min={0}
              step={1000}
              value={formData.bonus}
              onChange={(e) => updateField("bonus", parseInt(e.target.value) || 0)}
            />
          </div>
        </div>
      </div>

      {/* Workload */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Workload</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Hours Worked Per Week</Label>
            <span className="text-sm font-medium text-muted-foreground">
              {formData.hoursPerWeek} hours
            </span>
          </div>
          <Slider
            value={[formData.hoursPerWeek]}
            onValueChange={(v) => updateField("hoursPerWeek", v[0])}
            min={20}
            max={80}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>20</span>
            <span>40</span>
            <span>60</span>
            <span>80</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Stress Level</Label>
            <span className="text-sm font-medium text-muted-foreground">
              {formData.stressLevel}/10
            </span>
          </div>
          <Slider
            value={[formData.stressLevel]}
            onValueChange={(v) => updateField("stressLevel", v[0])}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Job Satisfaction</Label>
            <span className="text-sm font-medium text-muted-foreground">
              {formData.jobSatisfaction}/10
            </span>
          </div>
          <Slider
            value={[formData.jobSatisfaction]}
            onValueChange={(v) => updateField("jobSatisfaction", v[0])}
            min={1}
            max={10}
            step={1}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Unsatisfied</span>
            <span>Very Satisfied</span>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Analyzing..." : "Analyze My Salary"}
      </Button>
    </form>
  );
}
