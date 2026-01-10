export interface SalaryFormData {
  jobTitle: string;
  industry: string;
  location: string;
  yearsExperience: number;
  currentSalary: number;
  bonus: number;
  hoursPerWeek: number;
  stressLevel: number;
  jobSatisfaction: number;
}

export interface SalaryAnalysis {
  medianSalary: number;
  percentile75Salary: number;
  difference: number;
  differencePercent: number;
  stressAdjustedCompensation: number;
  verdict: 'underpaid' | 'overpaid' | 'fair';
  effortToPayRatio: 'poor' | 'average' | 'good' | 'excellent';
  negotiationLeverage: 'low' | 'medium' | 'high';
  explanation: string;
  paths: {
    negotiate: string;
    optimize: string;
    exit: string;
  };
}
