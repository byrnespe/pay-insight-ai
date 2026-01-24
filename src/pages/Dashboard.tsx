import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Crown, 
  ArrowRight, 
  Loader2,
  Calendar,
  CreditCard,
  Sparkles,
  TrendingUp,
  Gift
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SavedReportsHistory } from "@/components/SavedReportsHistory";
import { SavedPdfReports } from "@/components/SavedPdfReports";
import { AccountSettings } from "@/components/AccountSettings";
import { ReferralSection } from "@/components/ReferralSection";
import { BACKEND_URL } from "@/integrations/backend/config";
import { supabase } from "@/integrations/backend/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, session, loading, entitlements, hasReport, isPro } = useAuth();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { state: { returnTo: "/dashboard" } });
    }
  }, [loading, user, navigate]);

  // Fetch display name
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setDisplayName(data.display_name);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleManageSubscription = async () => {
    if (!session?.access_token) return;
    
    setIsManagingSubscription(true);
    try {
      const response = await fetch(
        `${BACKEND_URL}/functions/v1/customer-portal`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            returnUrl: window.location.href,
          }),
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
    } finally {
      setIsManagingSubscription(false);
    }
  };

  const getAccountStatus = () => {
    if (isPro) {
      return {
        label: entitlements.subscriptionPlan === "annual" ? "Pro Annual" : "Pro Monthly",
        variant: "default" as const,
        icon: Crown,
      };
    }
    if (hasReport) {
      return {
        label: "Report Unlocked",
        variant: "secondary" as const,
        icon: FileText,
      };
    }
    return {
      label: "Free",
      variant: "outline" as const,
      icon: null,
    };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const accountStatus = getAccountStatus();
  const greeting = displayName || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/icons/icon-180.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-foreground font-medium">
                Dashboard
              </Link>
              <Link to="/salaries" className="text-muted-foreground hover:text-foreground transition-colors">
                Salaries
              </Link>
              <Link to="/benchmarks" className="text-muted-foreground hover:text-foreground transition-colors">
                Benchmarks
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                Welcome back{isLoadingProfile ? "" : `, ${greeting}`}
              </h1>
              <p className="text-muted-foreground">
                Manage your reports and account settings.
              </p>
            </div>
            <Badge variant={accountStatus.variant} className="w-fit flex items-center gap-1.5">
              {accountStatus.icon && <accountStatus.icon className="w-3.5 h-3.5" />}
              {accountStatus.label}
            </Badge>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/">
              <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Run New Analysis</p>
                      <p className="text-sm text-muted-foreground">Check if you're underpaid</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </Card>
            </Link>

            {(hasReport || isPro) && (
              <Link to="/premium">
                <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {isPro ? (
                          <Crown className="w-5 h-5 text-primary" />
                        ) : (
                          <FileText className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {isPro ? "Premium Insights" : "View Report"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Access your analysis tools
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Card>
              </Link>
            )}
          </div>
        </section>

        {/* Subscription Status */}
        {isPro && (
          <section className="mb-8">
            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Crown className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Pro Subscription</h2>
                    {entitlements.subscriptionEnd && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Renews {formatDate(entitlements.subscriptionEnd)}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageSubscription}
                  disabled={isManagingSubscription}
                >
                  {isManagingSubscription ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="w-4 h-4 mr-2" />
                  )}
                  Manage
                </Button>
              </div>
            </Card>
          </section>
        )}

        {/* Saved Reports Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Saved Analyses</h2>
          </div>
          
          {isPro ? (
            <SavedReportsHistory 
              onLoadReport={() => {
                navigate("/premium");
              }} 
            />
          ) : (
            <Card className="p-6">
              <div className="text-center">
                <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-3">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Save Your Analyses</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Pro members can save and compare up to 20 salary analyses over time.
                </p>
                <Link to="/?upgrade=pro">
                  <Button variant="outline" size="sm">
                    Learn About Pro
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </section>

        {/* PDF Reports Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Exported Reports</h2>
          </div>
          
          {hasReport || isPro ? (
            <SavedPdfReports />
          ) : (
            <Card className="p-6">
              <div className="text-center">
                <div className="p-3 rounded-full bg-muted w-fit mx-auto mb-3">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-foreground mb-1">Export PDF Reports</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                  Get a complete, downloadable report of your salary analysis.
                </p>
                <Link to="/">
                  <Button variant="outline" size="sm">
                    Run Analysis First
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </section>

        {/* Referral Section - Pro only */}
        {isPro && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Referrals</h2>
            </div>
            <ReferralSection />
          </section>
        )}

        {/* Account Settings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Account</h2>
          </div>
          <AccountSettings />
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Calculator
            </Link>
            <Link to="/salaries" className="hover:text-foreground transition-colors">
              Salaries
            </Link>
            <Link to="/benchmarks" className="hover:text-foreground transition-colors">
              Benchmarks
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Underpaid. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
