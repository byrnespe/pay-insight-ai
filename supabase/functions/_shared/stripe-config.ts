// Centralized Stripe configuration for all edge functions
// IMPORTANT: Keep this in sync with src/types/entitlements.ts

export const STRIPE_PRODUCTS = {
  // One-time purchase ($9) - permanent access to full analysis + basic script + PDF export
  oneTime: {
    productId: "prod_TlPTgbTLG9sWns",
    priceId: "price_1SnseSIXbwEf8N1FrMOzpqaE",
    name: "Underpaid – Full Pay Report",
  },
  // Pro Monthly subscription ($5/mo)
  proMonthly: {
    productId: "prod_TlQM1qmocuhKC4",
    priceId: "price_1SntVzIXbwEf8N1FkJ9dfKtq",
    name: "Underpaid Pro - Monthly",
  },
  // Pro Annual subscription ($49/yr)
  proAnnual: {
    productId: "prod_TlQQBwGEKJtcI4",
    priceId: "price_1SntZRIXbwEf8N1FqkoBg99g",
    name: "Underpaid Pro - Annual",
  },
} as const;

// Helper to get all Pro subscription product IDs
export const PRO_PRODUCT_IDS = [
  STRIPE_PRODUCTS.proMonthly.productId,
  STRIPE_PRODUCTS.proAnnual.productId,
] as const;

// Helper function to check if a product ID is a Pro subscription
export function isProProduct(productId: string): boolean {
  return PRO_PRODUCT_IDS.includes(productId as typeof PRO_PRODUCT_IDS[number]);
}

// Helper function to check if a product ID is the one-time purchase
export function isOneTimeProduct(productId: string): boolean {
  return productId === STRIPE_PRODUCTS.oneTime.productId;
}
