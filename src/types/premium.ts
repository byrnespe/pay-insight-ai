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
