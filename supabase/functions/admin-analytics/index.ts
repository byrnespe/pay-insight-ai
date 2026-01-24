import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user has admin role using has_role function
    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      console.log(`Access denied for user ${user.id}. isAdmin: ${isAdmin}`);
      return new Response(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin access granted for user ${user.id}`);

    // Parse query params for date range
    const url = new URL(req.url);
    const daysBack = parseInt(url.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    // Fetch all analytics in parallel
    const [
      eventsResult,
      profilesResult,
      reportsResult,
      salariesResult,
    ] = await Promise.all([
      // All events in date range
      supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      
      // Total profiles
      supabase.from('profiles').select('id, created_at'),
      
      // Total saved reports
      supabase.from('saved_reports').select('id, created_at'),
      
      // Total salary submissions
      supabase.from('anonymous_salaries').select('id, submitted_at'),
    ]);

    const events = eventsResult.data || [];
    const profiles = profilesResult.data || [];
    const reports = reportsResult.data || [];
    const salaries = salariesResult.data || [];

    // Calculate metrics
    const eventCounts: Record<string, number> = {};
    const sourceCounts: Record<string, { total: number; conversions: number }> = {};
    const dailyActiveUsers: Record<string, Set<string>> = {};
    const dailyEvents: Record<string, number> = {};

    events.forEach((event) => {
      // Count by event name
      eventCounts[event.event_name] = (eventCounts[event.event_name] || 0) + 1;

      // Count by source
      const source = event.source || event.utm_source || 'direct';
      if (!sourceCounts[source]) {
        sourceCounts[source] = { total: 0, conversions: 0 };
      }
      sourceCounts[source].total++;
      
      // Track conversions (checkout_completed or analysis_completed)
      if (['checkout_completed', 'analysis_completed'].includes(event.event_name)) {
        sourceCounts[source].conversions++;
      }

      // Daily active users
      const dateKey = event.created_at.split('T')[0];
      if (!dailyActiveUsers[dateKey]) {
        dailyActiveUsers[dateKey] = new Set();
      }
      if (event.user_id) {
        dailyActiveUsers[dateKey].add(event.user_id);
      } else if (event.session_id) {
        dailyActiveUsers[dateKey].add(event.session_id);
      }

      // Daily event counts
      dailyEvents[dateKey] = (dailyEvents[dateKey] || 0) + 1;
    });

    // Build traffic sources array
    const trafficSources = Object.entries(sourceCounts)
      .map(([source, data]) => ({
        source,
        visits: data.total,
        conversions: data.conversions,
        rate: data.total > 0 ? ((data.conversions / data.total) * 100).toFixed(1) : '0.0',
      }))
      .sort((a, b) => b.visits - a.visits);

    // Build conversion funnel
    const funnel = {
      page_views: eventCounts['page_view'] || 0,
      analysis_started: eventCounts['analysis_started'] || 0,
      analysis_completed: eventCounts['analysis_completed'] || 0,
      checkout_initiated: eventCounts['checkout_initiated'] || 0,
      checkout_completed: eventCounts['checkout_completed'] || 0,
    };

    // Build daily metrics array
    const dailyMetrics = Object.entries(dailyActiveUsers)
      .map(([date, users]) => ({
        date,
        activeUsers: users.size,
        events: dailyEvents[date] || 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Calculate growth metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentProfiles = profiles.filter(p => new Date(p.created_at) >= thirtyDaysAgo).length;
    const previousProfiles = profiles.filter(p => {
      const d = new Date(p.created_at);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    }).length;

    const profileGrowth = previousProfiles > 0 
      ? (((recentProfiles - previousProfiles) / previousProfiles) * 100).toFixed(1)
      : '100';

    const response = {
      summary: {
        totalUsers: profiles.length,
        totalReports: reports.length,
        totalSalarySubmissions: salaries.length,
        eventsTracked: events.length,
        profileGrowth: `${profileGrowth}%`,
      },
      funnel,
      trafficSources,
      dailyMetrics,
      eventCounts,
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-analytics:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
