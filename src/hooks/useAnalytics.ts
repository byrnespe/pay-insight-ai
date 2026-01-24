import { getUTMData, getTrafficSource } from "./useUTMTracking";

type EventName = 
  | "analysis_started"
  | "analysis_completed"
  | "checkout_initiated"
  | "checkout_completed"
  | "report_saved"
  | "pdf_downloaded"
  | "share_clicked"
  | "exit_intent_shown"
  | "exit_intent_converted"
  | "page_view";

interface EventProperties {
  [key: string]: string | number | boolean | undefined;
}

// Simple analytics tracking that logs events
// Can be extended to send to analytics service
export function trackEvent(event: EventName, properties?: EventProperties) {
  const utm = getUTMData();
  const source = getTrafficSource();
  
  const eventData = {
    event,
    timestamp: new Date().toISOString(),
    source,
    utm,
    page: window.location.pathname,
    ...properties,
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log("[Analytics]", eventData);
  }

  // Store events in localStorage for debugging/export
  const events = JSON.parse(localStorage.getItem("underpaid_events") || "[]");
  events.push(eventData);
  
  // Keep only last 100 events
  if (events.length > 100) {
    events.shift();
  }
  localStorage.setItem("underpaid_events", JSON.stringify(events));

  // Future: Send to analytics backend
  // await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventData) });
}

export function getStoredEvents() {
  return JSON.parse(localStorage.getItem("underpaid_events") || "[]");
}

export function clearStoredEvents() {
  localStorage.removeItem("underpaid_events");
}
