import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/backend/client";

interface AdminAuthState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAdminAuth(): AdminAuthState {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminRole() {
      if (authLoading) return;
      
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error: rpcError } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (rpcError) {
          console.error('Error checking admin role:', rpcError);
          setError('Failed to verify admin access');
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data));
        }
      } catch (err) {
        console.error('Error in admin check:', err);
        setError('Failed to verify admin access');
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    }

    checkAdminRole();
  }, [user, authLoading]);

  return { isAdmin, isLoading: isLoading || authLoading, error };
}
