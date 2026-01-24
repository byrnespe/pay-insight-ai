import { getUTMData, getTrafficSource } from "./useUTMTracking";
import { BACKEND_URL, BACKEND_PUBLISHABLE_KEY } from "@/integrations/backend/config";
import { createClient } from "@supabase/supabase-js";

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

// Generate or retrieve session ID
function getSessionId(): string {
  let sessionId = sessionStorage.getItem("underpaid_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("underpaid_session_id", sessionId);
  }
  return sessionId;
}

// Simple analytics tracking that logs events and sends to backend
export function trackEvent(event: EventName, properties?: EventProperties) {
  const utm = getUTMData();
  const source = getTrafficSource();
  const sessionId = getSessionId();
  
  const eventData = {
    event,
    timestamp: new Date().toISOString(),
    source,
    utm,
    page: window.location.pathname,
    session_id: sessionId,
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

  // Send to backend (fire and forget)
  sendEventToBackend(event, sessionId, source, utm, properties);
}

async function sendEventToBackend(
  event: EventName,
  sessionId: string,
  source: string,
  utm: ReturnType<typeof getUTMData>,
  properties?: EventProperties
) {
  try {
    // Create a minimal supabase client just for auth check
    // This avoids importing the main client which may fail if env vars don't load
    const supabase = createClient(BACKEND_URL, BACKEND_PUBLISHABLE_KEY);
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    await fetch(`${BACKEND_URL}/functions/v1/track-event`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        event,
        session_id: sessionId,
        page: window.location.pathname,
        source,
        utm,
        properties,
      }),
    });
  } catch (error) {
    // Silent fail - analytics shouldn't break UX
    if (import.meta.env.DEV) {
      console.warn('[Analytics] Failed to send event to backend:', error);
    }
  }
}

export function getStoredEvents() {
  return JSON.parse(localStorage.getItem("underpaid_events") || "[]");
}

export function clearStoredEvents() {
  localStorage.removeItem("underpaid_events");
}
