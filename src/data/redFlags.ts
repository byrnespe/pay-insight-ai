export interface RedFlagQuestion {
  id: string;
  category: string;
  question: string;
  severity: "moderate" | "significant" | "critical";
}

export interface RedFlagCategory {
  id: string;
  name: string;
  description: string;
  questions: RedFlagQuestion[];
}

export const redFlagCategories: RedFlagCategory[] = [
  {
    id: "compensation",
    name: "Compensation",
    description: "Pay, benefits, and financial treatment",
    questions: [
      {
        id: "comp-1",
        category: "compensation",
        question: "Has your salary been frozen for more than 18 months?",
        severity: "significant",
      },
      {
        id: "comp-2",
        category: "compensation",
        question: "Are you paid below the market rate for your role and location?",
        severity: "critical",
      },
      {
        id: "comp-3",
        category: "compensation",
        question: "Have promised bonuses or raises been delayed or cancelled?",
        severity: "significant",
      },
      {
        id: "comp-4",
        category: "compensation",
        question: "Is there a lack of transparency around how compensation decisions are made?",
        severity: "moderate",
      },
      {
        id: "comp-5",
        category: "compensation",
        question: "Do colleagues with similar experience earn significantly more for the same work?",
        severity: "critical",
      },
      {
        id: "comp-6",
        category: "compensation",
        question: "Are benefits being reduced without salary adjustments?",
        severity: "moderate",
      },
      {
        id: "comp-7",
        category: "compensation",
        question: "Is expense reimbursement slow, difficult, or often denied?",
        severity: "moderate",
      },
      {
        id: "comp-8",
        category: "compensation",
        question: "Are you expected to use personal equipment or pay for work-related costs?",
        severity: "moderate",
      },
    ],
  },
  {
    id: "workload",
    name: "Workload",
    description: "Hours, expectations, and work-life boundaries",
    questions: [
      {
        id: "work-1",
        category: "workload",
        question: "Do you regularly work more than 45 hours per week?",
        severity: "moderate",
      },
      {
        id: "work-2",
        category: "workload",
        question: "Is there an expectation to respond to messages outside work hours?",
        severity: "moderate",
      },
      {
        id: "work-3",
        category: "workload",
        question: "Has your workload increased significantly without additional compensation?",
        severity: "significant",
      },
      {
        id: "work-4",
        category: "workload",
        question: "Are you covering responsibilities for unfilled positions?",
        severity: "significant",
      },
      {
        id: "work-5",
        category: "workload",
        question: "Is taking vacation time discouraged or made difficult?",
        severity: "significant",
      },
      {
        id: "work-6",
        category: "workload",
        question: "Do deadlines frequently feel unrealistic or arbitrary?",
        severity: "moderate",
      },
      {
        id: "work-7",
        category: "workload",
        question: "Is understaffing a chronic issue in your team?",
        severity: "significant",
      },
      {
        id: "work-8",
        category: "workload",
        question: "Are you expected to be \"always on\" even during personal time?",
        severity: "critical",
      },
    ],
  },
  {
    id: "management",
    name: "Management",
    description: "Leadership, feedback, and career development",
    questions: [
      {
        id: "mgmt-1",
        category: "management",
        question: "Do you rarely receive constructive feedback on your work?",
        severity: "moderate",
      },
      {
        id: "mgmt-2",
        category: "management",
        question: "Is there a clear path for advancement that you can see yourself on?",
        severity: "moderate",
      },
      {
        id: "mgmt-3",
        category: "management",
        question: "Do decisions seem to be made based on favoritism rather than merit?",
        severity: "significant",
      },
      {
        id: "mgmt-4",
        category: "management",
        question: "Does your manager take credit for your work?",
        severity: "critical",
      },
      {
        id: "mgmt-5",
        category: "management",
        question: "Are performance reviews inconsistent or seemingly arbitrary?",
        severity: "moderate",
      },
      {
        id: "mgmt-6",
        category: "management",
        question: "Is there high turnover in leadership positions?",
        severity: "significant",
      },
      {
        id: "mgmt-7",
        category: "management",
        question: "Are your concerns dismissed or minimized when raised?",
        severity: "significant",
      },
      {
        id: "mgmt-8",
        category: "management",
        question: "Is there a lack of investment in your professional development?",
        severity: "moderate",
      },
    ],
  },
  {
    id: "culture",
    name: "Culture",
    description: "Work environment and organizational health",
    questions: [
      {
        id: "cult-1",
        category: "culture",
        question: "Is there high turnover among your peers or across the company?",
        severity: "significant",
      },
      {
        id: "cult-2",
        category: "culture",
        question: "Does a blame culture exist where mistakes are punished rather than learned from?",
        severity: "significant",
      },
      {
        id: "cult-3",
        category: "culture",
        question: "Are meetings excessive and often unproductive?",
        severity: "moderate",
      },
      {
        id: "cult-4",
        category: "culture",
        question: "Is there visible tension or conflict between teams or departments?",
        severity: "moderate",
      },
      {
        id: "cult-5",
        category: "culture",
        question: "Do you feel psychologically unsafe speaking up about issues?",
        severity: "critical",
      },
      {
        id: "cult-6",
        category: "culture",
        question: "Are layoffs, restructures, or \"pivots\" a regular occurrence?",
        severity: "significant",
      },
      {
        id: "cult-7",
        category: "culture",
        question: "Is there a disconnect between company values and actual behavior?",
        severity: "moderate",
      },
      {
        id: "cult-8",
        category: "culture",
        question: "Do senior leaders seem disconnected from day-to-day realities?",
        severity: "moderate",
      },
    ],
  },
];

export const getScoreInterpretation = (score: number): {
  level: "low" | "moderate" | "high" | "critical";
  title: string;
  description: string;
} => {
  if (score <= 5) {
    return {
      level: "low",
      title: "Typical workplace friction",
      description:
        "Every workplace has minor issues. The concerns you've identified are common and generally manageable. Keep monitoring, but there's no urgent action needed.",
    };
  }
  if (score <= 10) {
    return {
      level: "moderate",
      title: "Some concerns worth monitoring",
      description:
        "You've identified patterns that could affect your job satisfaction or career growth over time. It may be worth documenting these issues and having conversations with your manager.",
    };
  }
  if (score <= 15) {
    return {
      level: "high",
      title: "Significant warning signs",
      description:
        "The number of concerns you've identified suggests systemic issues. Consider whether these problems are likely to improve, and start preparing contingency plans.",
    };
  }
  return {
    level: "critical",
    title: "Consider your options carefully",
    description:
      "This environment shows multiple signs of being harmful to your career, wellbeing, or both. It may be time to actively explore alternatives while protecting yourself in the current role.",
  };
};
