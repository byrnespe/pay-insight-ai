import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    // Check if user has admin role
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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Handle different actions
    if (req.method === 'GET') {
      if (action === 'search') {
        const query = url.searchParams.get('q') || '';
        
        // Get users from auth.users via admin API
        const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers({
          perPage: 50,
        });

        if (listError) {
          console.error('Error listing users:', listError);
          return new Response(
            JSON.stringify({ error: 'Failed to list users' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Filter users by email if query provided
        let filteredUsers = authUsers.users;
        if (query) {
          const lowerQuery = query.toLowerCase();
          filteredUsers = authUsers.users.filter(u => 
            u.email?.toLowerCase().includes(lowerQuery)
          );
        }

        // Get all roles
        const { data: allRoles } = await supabase
          .from('user_roles')
          .select('user_id, role');

        const roleMap = new Map<string, string[]>();
        (allRoles || []).forEach(r => {
          const existing = roleMap.get(r.user_id) || [];
          existing.push(r.role);
          roleMap.set(r.user_id, existing);
        });

        // Map users with their roles
        const users = filteredUsers.map(u => ({
          id: u.id,
          email: u.email,
          created_at: u.created_at,
          roles: roleMap.get(u.id) || [],
        }));

        return new Response(
          JSON.stringify({ users }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const { userId, role, action: roleAction } = body;

      if (!userId || !role || !roleAction) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: userId, role, action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate role
      if (!['admin', 'user'].includes(role)) {
        return new Response(
          JSON.stringify({ error: 'Invalid role. Must be "admin" or "user"' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Prevent removing your own admin role
      if (roleAction === 'remove' && role === 'admin' && userId === user.id) {
        return new Response(
          JSON.stringify({ error: 'Cannot remove your own admin role' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (roleAction === 'add') {
        const { error: insertError } = await supabase
          .from('user_roles')
          .upsert({ user_id: userId, role }, { onConflict: 'user_id,role' });

        if (insertError) {
          console.error('Error adding role:', insertError);
          return new Response(
            JSON.stringify({ error: 'Failed to add role' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Role ${role} added to user ${userId} by admin ${user.id}`);
      } else if (roleAction === 'remove') {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (deleteError) {
          console.error('Error removing role:', deleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to remove role' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`Role ${role} removed from user ${userId} by admin ${user.id}`);
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid request' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-users:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
