import { useEffect } from "react";

const UTM_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref"] as const;
const STORAGE_KEY = "underpaid_utm";

export interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  ref?: string;
  landing_page?: string;
  timestamp?: string;
}

export function useUTMTracking() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const params: UTMData = {};
    
    // Extract UTM parameters from URL
    UTM_PARAMS.forEach((param) => {
      const value = url.searchParams.get(param);
      if (value) {
        params[param] = value;
      }
    });

    // Only store if we have new UTM data
    if (Object.keys(params).length > 0) {
      params.landing_page = window.location.pathname;
      params.timestamp = new Date().toISOString();
      
      // Store in sessionStorage (persists for session)
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      
      // Also store in localStorage for longer attribution
      const existing = localStorage.getItem(STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
      }
    }
  }, []);
}

export function getUTMData(): UTMData | null {
  const data = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function getTrafficSource(): string {
  const utm = getUTMData();
  if (!utm) return "direct";
  
  if (utm.ref) return `referral:${utm.ref}`;
  if (utm.utm_source) return utm.utm_source;
  return "direct";
}
