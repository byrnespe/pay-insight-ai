import { SalaryFormData, SalaryAnalysis } from "@/types/salary";

export function analyzeSalary(data: SalaryFormData): SalaryAnalysis {
  // Simulated market data analysis
  // In production, this would call an AI API for real market data
  
  const baseSalary = data.currentSalary + data.bonus;
  
  // Simulated market median based on experience and role
  const experienceMultiplier = 1 + (data.yearsExperience * 0.05);
  const baseMarket = 75000; // Base market rate
  const medianSalary = Math.round(baseMarket * experienceMultiplier);
  const percentile75Salary = Math.round(medianSalary * 1.25);
  
  const difference = baseSalary - medianSalary;
  const differencePercent = Math.round((difference / medianSalary) * 100);
  
  // Determine verdict
  let verdict: 'underpaid' | 'overpaid' | 'fair';
  if (differencePercent < -10) {
    verdict = 'underpaid';
  } else if (differencePercent > 10) {
    verdict = 'overpaid';
  } else {
    verdict = 'fair';
  }
  
  // Effort to pay ratio calculation
  const normalizedHours = data.hoursPerWeek / 40;
  const normalizedStress = data.stressLevel / 10;
  const effortScore = (normalizedHours + normalizedStress) / 2;
  const payScore = baseSalary / medianSalary;
  const effortToPayScore = payScore / effortScore;
  
  let effortToPayRatio: 'poor' | 'average' | 'good' | 'excellent';
  if (effortToPayScore < 0.8) {
    effortToPayRatio = 'poor';
  } else if (effortToPayScore < 1.0) {
    effortToPayRatio = 'average';
  } else if (effortToPayScore < 1.2) {
    effortToPayRatio = 'good';
  } else {
    effortToPayRatio = 'excellent';
  }
  
  // Negotiation leverage
  let negotiationLeverage: 'low' | 'medium' | 'high';
  if (data.yearsExperience >= 5 && data.jobSatisfaction <= 5) {
    negotiationLeverage = 'high';
  } else if (data.yearsExperience >= 3) {
    negotiationLeverage = 'medium';
  } else {
    negotiationLeverage = 'low';
  }
  
  // Generate explanation
  const explanation = generateExplanation(data, verdict, differencePercent, effortToPayRatio);
  
  // Generate paths
  const paths = {
    negotiate: `With ${data.yearsExperience} years of experience as a ${data.jobTitle}, you have solid ground to request a salary review. Focus on quantifiable achievements and market data.`,
    optimize: `Consider reducing your ${data.hoursPerWeek} weekly hours or delegating high-stress tasks. Your current stress level of ${data.stressLevel}/10 may be affecting your long-term career value.`,
    exit: `${data.jobTitle} roles in ${data.location} at the 75th percentile pay around $${percentile75Salary.toLocaleString()}. Consider updating your resume and exploring opportunities.`
  };
  
  return {
    medianSalary,
    percentile75Salary,
    difference,
    differencePercent,
    verdict,
    effortToPayRatio,
    negotiationLeverage,
    explanation,
    paths
  };
}

function generateExplanation(
  data: SalaryFormData,
  verdict: string,
  differencePercent: number,
  effortToPayRatio: string
): string {
  const totalComp = data.currentSalary + data.bonus;
  
  if (verdict === 'underpaid') {
    return `Based on market data for ${data.jobTitle} positions in ${data.industry} within ${data.location}, you appear to be compensated ${Math.abs(differencePercent)}% below the market median. Combined with your ${data.hoursPerWeek}-hour work weeks and stress level of ${data.stressLevel}/10, your effort-to-pay ratio is ${effortToPayRatio}. This suggests you're providing more value than you're being compensated for.`;
  } else if (verdict === 'overpaid') {
    return `Your total compensation of $${totalComp.toLocaleString()} is ${differencePercent}% above the market median for ${data.jobTitle} positions in ${data.location}. However, with ${data.hoursPerWeek} hours per week and a stress level of ${data.stressLevel}/10, consider whether your workload justifies this premium.`;
  } else {
    return `Your compensation is within 10% of the market median for ${data.jobTitle} positions in ${data.location}. Your effort-to-pay ratio is ${effortToPayRatio}, which suggests a ${effortToPayRatio === 'good' || effortToPayRatio === 'excellent' ? 'reasonable' : 'challenging'} balance between work demands and pay.`;
  }
}
