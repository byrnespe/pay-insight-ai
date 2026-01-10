// Premium tier types
export type PremiumTier = "one_time" | "subscription" | null;

// One-Time features
export interface NegotiationScript {
  opening: string;
  valueProposition: string;
  askStatement: string;
  handlePushback: string;
  closing: string;
}

export interface TalkingPoint {
  point: string;
  evidence: string;
  delivery: string;
}

export interface AlternativeRole {
  title: string;
  industry: string;
  salaryRange: string;
  salaryIncrease: string;
  transitionPath: string;
  keySkills: string[];
}

export interface PremiumInsights {
  negotiationScript: NegotiationScript;
  talkingPoints: TalkingPoint[];
  alternativeRoles: AlternativeRole[];
}

// Pro-only features (subscription)
export interface ManagerScript {
  managerType: "supportive" | "skeptical" | "numbers-focused" | "busy" | "new";
  tone: "assertive" | "collaborative" | "diplomatic";
  script: NegotiationScript;
  tips: string[];
}

export interface RejectionResponse {
  scenario: string;
  objection: string;
  response: string;
  followUp: string;
}

export interface OfferComparison {
  currentRole: {
    title: string;
    totalComp: number;
    benefits: string[];
    growthPotential: "low" | "medium" | "high";
  };
  newOffer: {
    title: string;
    totalComp: number;
    benefits: string[];
    growthPotential: "low" | "medium" | "high";
  };
  recommendation: string;
  riskAnalysis: string;
}

export interface CareerLeverageScore {
  score: number;
  factors: {
    marketDemand: number;
    skillRarity: number;
    negotiationPower: number;
    mobilityOptions: number;
  };
  trend: "increasing" | "stable" | "decreasing";
  recordedAt: string;
}

export interface ExitReadinessScore {
  score: number;
  readyToLeave: boolean;
  factors: {
    financialRunway: number;
    marketOpportunities: number;
    skillTransferability: number;
    networkStrength: number;
  };
  recommendation: string;
}
