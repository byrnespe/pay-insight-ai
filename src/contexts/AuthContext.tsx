import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/backend/client";
import { BACKEND_URL } from "@/integrations/backend/config";
import { 
  EntitlementStatus, 
  Entitlements, 
  DEFAULT_ENTITLEMENTS 
} from "@/types/entitlements";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  entitlements: EntitlementStatus;
  checkEntitlements: () => Promise<void>;
  // Helper functions for quick access
  hasReport: boolean;
  isPro: boolean;
  canExportPdf: boolean;
  canAccessFeature: (feature: keyof Entitlements | string) => boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const defaultEntitlementStatus: EntitlementStatus = {
  entitlements: DEFAULT_ENTITLEMENTS,
  hasOneTimePurchase: false,
  hasActiveSubscription: false,
  subscriptionPlan: null,
  subscriptionEnd: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [entitlements, setEntitlements] = useState<EntitlementStatus>(defaultEntitlementStatus);

  const checkEntitlements = useCallback(async () => {
    if (!session?.access_token) {
      setEntitlements(defaultEntitlementStatus);
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/functions/v1/check-entitlements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEntitlements({
          entitlements: data.entitlements,
          hasOneTimePurchase: data.hasOneTimePurchase,
          hasActiveSubscription: data.hasActiveSubscription,
          subscriptionPlan: data.subscriptionPlan,
          subscriptionEnd: data.subscriptionEnd,
        });
      }
    } catch (error) {
      console.error("Error checking entitlements:", error);
    }
  }, [session?.access_token]);

  useEffect(() => {
    // Set up auth state listener BEFORE checking session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Check entitlements when session changes
  useEffect(() => {
    if (session) {
      checkEntitlements();
    } else {
      setEntitlements(defaultEntitlementStatus);
    }
  }, [session, checkEntitlements]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error ? new Error(error.message) : null };
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    return { error: error ? new Error(error.message) : null };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
    // Always clear local state, even if server returns an error
    setUser(null);
    setSession(null);
    setEntitlements(defaultEntitlementStatus);
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth?mode=reset`,
    });
    return { error: error ? new Error(error.message) : null };
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error ? new Error(error.message) : null };
  };

  // Computed helper values
  const hasReport = entitlements.entitlements.report.full_analysis;
  const isPro = entitlements.entitlements.pro.active;
  const canExportPdf = entitlements.entitlements.report.export_pdf;

  // Helper function to check specific feature access
  const canAccessFeature = (feature: keyof Entitlements | string): boolean => {
    const e = entitlements.entitlements;
    
    switch (feature) {
      case "full_analysis":
        return e.report.full_analysis;
      case "export_pdf":
        return e.report.export_pdf;
      case "basic_script":
        return e.negotiation.basic_script;
      case "manager_specific":
        return e.negotiation.manager_specific;
      case "rejection_responses":
        return e.negotiation.rejection_responses;
      case "scenario_simulator":
        return e.negotiation.scenario_simulator;
      case "unlimited_checks":
        return e.checks.unlimited;
      case "leverage_tracking":
        return e.career.leverage_tracking;
      case "exit_readiness":
        return e.career.exit_readiness;
      case "comparison_tool":
        return e.offers.comparison_tool;
      case "saved_reports":
        return e.history.saved_reports;
      case "pro":
        return e.pro.active;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        entitlements,
        checkEntitlements,
        hasReport,
        isPro,
        canExportPdf,
        canAccessFeature,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
