import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  History, 
  Loader2, 
  Trash2, 
  MapPin, 
  Briefcase, 
  Calendar,
  ChevronRight,
  Crown,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/backend/client";
import { BACKEND_URL } from "@/integrations/backend/config";
import { useToast } from "@/hooks/use-toast";
import { SalaryAnalysis, SalaryFormData } from "@/types/salary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SavedReport {
  id: string;
  user_id: string;
  current_salary: number;
  bonus: number;
  years_experience: number;
  hours_per_week: number;
  location: string;
  job_title: string;
  company: string | null;
  stress_level: number;
  job_satisfaction: number;
  analysis_result: SalaryAnalysis;
  created_at: string;
}

interface SavedReportsHistoryProps {
  onLoadReport?: (formData: SalaryFormData, analysis: SalaryAnalysis) => void;
  onUpgrade?: () => void;
}

export function SavedReportsHistory({ onLoadReport, onUpgrade }: SavedReportsHistoryProps) {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [accessReason, setAccessReason] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { session } = useAuth();
  const { toast } = useToast();

  const fetchReports = async () => {
    if (!session?.access_token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BACKEND_URL}/functions/v1/get-saved-reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.error) {
        console.error("Error fetching reports:", data.error);
        setAccessReason(data.reason || "error");
      } else {
        setReports(data.reports || []);
        setHasAccess(data.hasAccess);
        setAccessReason(data.reason || null);
      }
    } catch (error) {
      console.error("Failed to fetch reports:", error);
      setAccessReason("error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [session?.access_token]);

  const handleDelete = async (reportId: string) => {
    setDeletingId(reportId);
    try {
      const { error } = await supabase
        .from("saved_reports")
        .delete()
        .eq("id", reportId);

      if (error) {
        throw error;
      }

      setReports(reports.filter(r => r.id !== reportId));
      toast({ title: "Report deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Failed to delete report",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleLoadReport = (report: SavedReport) => {
    const formData: SalaryFormData = {
      currentSalary: report.current_salary,
      bonus: report.bonus,
      yearsExperience: report.years_experience,
      hoursPerWeek: report.hours_per_week,
      location: report.location,
      jobTitle: report.job_title,
      industry: report.company || "", // company stored in DB maps to industry in form
      stressLevel: report.stress_level,
      jobSatisfaction: report.job_satisfaction,
    };

    // Store in sessionStorage for the premium page
    sessionStorage.setItem("underpaid_formData", JSON.stringify(formData));
    sessionStorage.setItem("underpaid_analysis", JSON.stringify(report.analysis_result));

    if (onLoadReport) {
      onLoadReport(formData, report.analysis_result);
    }

    toast({ title: "Report loaded" });
  };

  const verdictColors = {
    underpaid: "text-verdict-underpaid bg-verdict-underpaid/10",
    overpaid: "text-verdict-overpaid bg-verdict-overpaid/10",
    fair: "text-verdict-fair bg-verdict-fair/10",
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Show upgrade prompt if user doesn't have Pro access
  if (!hasAccess) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-3 rounded-full bg-primary/10">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">Saved Reports History</p>
            <p className="text-sm text-muted-foreground mt-1">
              Save and access your past analyses with a Pro subscription.
            </p>
          </div>
          {onUpgrade && (
            <Button onClick={onUpgrade} className="gap-2">
              <Sparkles className="w-4 h-4" />
              Upgrade to Pro
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-muted">
            <History className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-foreground">No saved reports yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Run a salary analysis and save it to see it here.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card 
          key={report.id} 
          className="p-4 hover:bg-muted/50 transition-colors cursor-pointer group"
          onClick={() => handleLoadReport(report)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${verdictColors[report.analysis_result.verdict]}`}>
                  {report.analysis_result.verdict === "underpaid" && "Underpaid"}
                  {report.analysis_result.verdict === "overpaid" && "Above Market"}
                  {report.analysis_result.verdict === "fair" && "Fair"}
                </span>
                <span className="text-sm font-medium text-foreground">
                  ${(report.current_salary + report.bonus).toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-1 text-foreground font-medium mb-1">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{report.job_title}</span>
                {report.company && (
                  <span className="text-muted-foreground truncate">at {report.company}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {report.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(report.created_at)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {deletingId === report.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this report?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this saved analysis. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(report.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
