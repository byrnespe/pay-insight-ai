import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrendingUp, Crown, Loader2, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimelineEntryForm } from "@/components/TimelineEntryForm";
import { TimelineChart } from "@/components/TimelineChart";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/backend/client";

interface TimelineEntry {
  id: string;
  recorded_at: string;
  base_salary: number;
  bonus: number;
  equity_value: number;
  job_title: string;
  company: string | null;
  notes: string | null;
  created_at: string;
}

const Timeline = () => {
  const navigate = useNavigate();
  const { user, loading, isPro } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { state: { returnTo: "/timeline" } });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && isPro) {
      fetchEntries();
    } else {
      setIsLoading(false);
    }
  }, [user, isPro]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("salary_timeline")
        .select("*")
        .eq("user_id", user!.id)
        .order("recorded_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error("Error fetching timeline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("salary_timeline")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setEntries(entries.filter((e) => e.id !== id));
      toast({
        title: "Entry deleted",
        description: "Timeline entry has been removed.",
      });
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const exportCSV = () => {
    const headers = [
      "Date",
      "Job Title",
      "Company",
      "Base Salary",
      "Bonus",
      "Equity Value",
      "Total Comp",
      "Notes",
    ];
    const rows = entries.map((e) => [
      e.recorded_at,
      e.job_title,
      e.company || "",
      e.base_salary,
      e.bonus,
      e.equity_value,
      e.base_salary + e.bonus + e.equity_value,
      e.notes || "",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "salary-timeline.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/timeline" className="text-foreground font-medium">
                Timeline
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Salary Timeline</h1>
            </div>
            <p className="text-muted-foreground">
              Track your compensation progression over time.
            </p>
          </div>
          <Badge variant="default" className="w-fit flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            Pro Feature
          </Badge>
        </div>

        {!isPro ? (
          <Card className="p-8 text-center">
            <Crown className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Pro Feature</h2>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Track your salary milestones over time and compare against inflation. Available for Pro subscribers.
            </p>
            <Link to="/?upgrade=pro">
              <Button>Upgrade to Pro</Button>
            </Link>
          </Card>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <TimelineEntryForm onSuccess={fetchEntries} />
              {entries.length > 0 && (
                <Button variant="outline" onClick={exportCSV}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>

            {/* Chart */}
            <TimelineChart entries={entries} />

            {/* Entry list */}
            {entries.length > 0 ? (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">Milestones</h2>
                {entries.map((entry) => (
                  <Card key={entry.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(entry.recorded_at)}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="font-medium text-foreground">
                            {entry.job_title}
                          </span>
                          {entry.company && (
                            <span className="text-muted-foreground">
                              @ {entry.company}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-foreground">
                            {formatCurrency(entry.base_salary)} base
                          </span>
                          {entry.bonus > 0 && (
                            <span className="text-muted-foreground">
                              +{formatCurrency(entry.bonus)} bonus
                            </span>
                          )}
                          {entry.equity_value > 0 && (
                            <span className="text-muted-foreground">
                              +{formatCurrency(entry.equity_value)} equity
                            </span>
                          )}
                        </div>
                        {entry.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">No entries yet</h2>
                <p className="text-muted-foreground mb-4">
                  Add your first salary milestone to start tracking your progression.
                </p>
              </Card>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Timeline;
