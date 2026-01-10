import { SalaryFormData, SalaryAnalysis } from "@/types/salary";

const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-salary`;

export async function analyzeSalary(data: SalaryFormData): Promise<SalaryAnalysis> {
  const response = await fetch(ANALYZE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please wait a moment and try again.");
    }
    if (response.status === 402) {
      throw new Error("Service temporarily unavailable. Please try again later.");
    }
    
    throw new Error(errorData.error || "Failed to analyze salary");
  }

  const analysis = await response.json();
  return analysis;
}
