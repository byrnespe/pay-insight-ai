// Centralized backend configuration with safe fallbacks.
// These values are publishable and safe to ship to the client.

export const BACKEND_URL: string =
  (import.meta as any).env?.VITE_SUPABASE_URL ??
  "https://cfexquivmmsyhgchkebu.supabase.co";

export const BACKEND_PUBLISHABLE_KEY: string =
  (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmZXhxdWl2bW1zeWhnY2hrZWJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTUwMTksImV4cCI6MjA4MzU3MTAxOX0.GXG4Yvr2WVgjq-JO7LkTAOFBMCLkzddzY5DIyo2tBWc";
