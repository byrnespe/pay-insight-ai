import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventPayload {
  event: string;
  session_id?: string;
  page?: string;
  source?: string;
  utm?: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
  };
  properties?: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user ID from auth header if present (optional)
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const payload: EventPayload = await req.json();
    
    // Validate required fields
    if (!payload.event) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: event' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert event into analytics_events table
    const { error: insertError } = await supabase
      .from('analytics_events')
      .insert({
        event_name: payload.event,
        user_id: userId,
        session_id: payload.session_id,
        page: payload.page,
        source: payload.source,
        utm_source: payload.utm?.utm_source,
        utm_medium: payload.utm?.utm_medium,
        utm_campaign: payload.utm?.utm_campaign,
        utm_term: payload.utm?.utm_term,
        utm_content: payload.utm?.utm_content,
        properties: payload.properties || {},
      });

    if (insertError) {
      console.error('Failed to insert event:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to store event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Event tracked: ${payload.event} for user ${userId || 'anonymous'}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in track-event:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
