// Entitlement-based access control for Underpaid
// All feature gating must use these flags, never plan names

export interface Entitlements {
  report: {
    full_analysis: boolean;
    export_pdf: boolean;
  };
  negotiation: {
    basic_script: boolean;
    manager_specific: boolean;
    rejection_responses: boolean;
    scenario_simulator: boolean;
  };
  checks: {
    unlimited: boolean;
  };
  career: {
    leverage_tracking: boolean;
    exit_readiness: boolean;
  };
  offers: {
    comparison_tool: boolean;
  };
  history: {
    saved_reports: boolean;
  };
  pro: {
    active: boolean;
  };
}

export interface EntitlementStatus {
  entitlements: Entitlements;
  hasOneTimePurchase: boolean;
  hasActiveSubscription: boolean;
  subscriptionPlan: "monthly" | "annual" | null;
  subscriptionEnd: string | null;
}

// Default entitlements for users with no purchases
export const DEFAULT_ENTITLEMENTS: Entitlements = {
  report: {
    full_analysis: false,
    export_pdf: false,
  },
  negotiation: {
    basic_script: false,
    manager_specific: false,
    rejection_responses: false,
    scenario_simulator: false,
  },
  checks: {
    unlimited: false,
  },
  career: {
    leverage_tracking: false,
    exit_readiness: false,
  },
  offers: {
    comparison_tool: false,
  },
  history: {
    saved_reports: false,
  },
  pro: {
    active: false,
  },
};

// Entitlements granted by one-time purchase ($9)
// These are PERMANENT and should NEVER be revoked
export const ONE_TIME_ENTITLEMENTS: Partial<Entitlements> = {
  report: {
    full_analysis: true,
    export_pdf: true,
  },
  negotiation: {
    basic_script: true,
    manager_specific: false,
    rejection_responses: false,
    scenario_simulator: false,
  },
};

// Additional entitlements granted by Pro subscription
// These are revoked when subscription ends
export const PRO_ENTITLEMENTS: Partial<Entitlements> = {
  negotiation: {
    basic_script: true, // included
    manager_specific: true,
    rejection_responses: true,
    scenario_simulator: true,
  },
  checks: {
    unlimited: true,
  },
  career: {
    leverage_tracking: true,
    exit_readiness: true,
  },
  offers: {
    comparison_tool: true,
  },
  history: {
    saved_reports: true,
  },
  pro: {
    active: true,
  },
};

// Stripe product and price IDs
export const STRIPE_CONFIG = {
  products: {
    oneTime: {
      productId: "prod_TlPTgbTLG9sWns",
      priceId: "price_1SnseSIXbwEf8N1FrMOzpqaE",
      name: "Underpaid – Full Pay Report",
      price: 900, // $9.00 in cents
    },
    proMonthly: {
      productId: "prod_TlQM1qmocuhKC4",
      priceId: "price_1SntVzIXbwEf8N1FkJ9dfKtq",
      name: "Underpaid Pro - Monthly",
      price: 500, // $5.00 in cents
    },
    proAnnual: {
      productId: "prod_TlQQBwGEKJtcI4",
      priceId: "price_1SntZRIXbwEf8N1FqkoBg99g",
      name: "Underpaid Pro - Annual",
      price: 4900, // $49.00 in cents
    },
  },
} as const;

// Helper to merge entitlements (one-time + pro)
export function mergeEntitlements(
  hasOneTime: boolean,
  hasPro: boolean
): Entitlements {
  const base = { ...DEFAULT_ENTITLEMENTS };

  if (hasOneTime) {
    base.report = { ...base.report, ...ONE_TIME_ENTITLEMENTS.report };
    base.negotiation = {
      ...base.negotiation,
      basic_script: true,
    };
  }

  if (hasPro) {
    base.negotiation = { ...base.negotiation, ...PRO_ENTITLEMENTS.negotiation };
    base.checks = { ...base.checks, ...PRO_ENTITLEMENTS.checks };
    base.career = { ...base.career, ...PRO_ENTITLEMENTS.career };
    base.offers = { ...base.offers, ...PRO_ENTITLEMENTS.offers };
    base.history = { ...base.history, ...PRO_ENTITLEMENTS.history };
    base.pro = { ...base.pro, ...PRO_ENTITLEMENTS.pro };
  }

  return base;
}
