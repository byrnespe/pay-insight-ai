import { SalaryFormData, SalaryAnalysis } from "@/types/salary";
import { BACKEND_PUBLISHABLE_KEY, BACKEND_URL } from "@/integrations/backend/config";

const ANALYZE_URL = `${BACKEND_URL}/functions/v1/analyze-salary`;

export async function analyzeSalary(data: SalaryFormData): Promise<SalaryAnalysis> {
  const response = await fetch(ANALYZE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${BACKEND_PUBLISHABLE_KEY}`,
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
