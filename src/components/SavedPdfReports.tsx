import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Loader2, 
  Download, 
  Trash2, 
  FileText,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/backend/client";
import { BACKEND_URL } from "@/integrations/backend/config";
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

interface PdfReport {
  name: string;
  path: string;
  url: string | null;
  jobTitle: string;
  createdAt: string;
  size: number;
}

export const SavedPdfReports = () => {
  const { toast } = useToast();
  const [pdfs, setPdfs] = useState<PdfReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);

  const fetchPdfs = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/functions/v1/get-user-pdfs`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await response.json();
      setPdfs(data.pdfs || []);
      setHasAccess(data.hasAccess || false);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
      toast({
        title: "Error loading reports",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  const handleDelete = async (filePath: string) => {
    setDeletingPath(filePath);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Sign in required",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(
        `${BACKEND_URL}/functions/v1/delete-user-pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ filePath }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      setPdfs(prev => prev.filter(pdf => pdf.path !== filePath));
      toast({ title: "Report deleted" });
    } catch (error) {
      console.error("Error deleting PDF:", error);
      toast({
        title: "Delete failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingPath(null);
    }
  };

  const handleDownload = (url: string | null, jobTitle: string) => {
    if (!url) {
      toast({
        title: "Download unavailable",
        description: "This report's download link has expired. Please regenerate.",
        variant: "destructive",
      });
      return;
    }

    // Open in new tab for printing/saving
    const printWindow = window.open(url, "_blank");
    if (printWindow) {
      toast({ 
        title: "Report opened",
        description: "Use your browser's print dialog to save as PDF." 
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-muted-foreground">Loading saved reports...</span>
        </div>
      </Card>
    );
  }

  if (!hasAccess) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <AlertCircle className="w-5 h-5" />
          <p>Premium subscription required to view saved PDF reports.</p>
        </div>
      </Card>
    );
  }

  if (pdfs.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No saved PDF reports yet.</p>
          <p className="text-sm mt-1">
            Export a PDF from your analysis to save it here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {pdfs.map((pdf) => (
        <Card key={pdf.path} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground capitalize">
                  {pdf.jobTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(pdf.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(pdf.url, pdf.jobTitle)}
              >
                <Download className="w-4 h-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={deletingPath === pdf.path}
                  >
                    {deletingPath === pdf.path ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this report?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the saved PDF report for "{pdf.jobTitle}".
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(pdf.path)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
