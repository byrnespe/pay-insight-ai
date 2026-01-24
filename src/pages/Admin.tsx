import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MetricsCards } from "@/components/admin/MetricsCards";
import { TrafficSourcesTable } from "@/components/admin/TrafficSourcesTable";
import { ConversionFunnel } from "@/components/admin/ConversionFunnel";
import { DailyActivityChart } from "@/components/admin/DailyActivityChart";
import { EventCounts } from "@/components/admin/EventCounts";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BACKEND_URL } from "@/integrations/backend/config";

interface AnalyticsData {
  summary: {
    totalUsers: number;
    totalReports: number;
    totalSalarySubmissions: number;
    eventsTracked: number;
    profileGrowth: string;
  };
  funnel: {
    page_views: number;
    analysis_started: number;
    analysis_completed: number;
    checkout_initiated: number;
    checkout_completed: number;
  };
  trafficSources: Array<{
    source: string;
    visits: number;
    conversions: number;
    rate: string;
  }>;
  dailyMetrics: Array<{
    date: string;
    activeUsers: number;
    events: number;
  }>;
  eventCounts: Record<string, number>;
}

export default function Admin() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/functions/v1/admin-analytics?days=30`, {
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch analytics');
      }

      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({
        title: "Error loading analytics",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      fetchAnalytics();
    }
  }, [session?.access_token]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Last 30 days of activity</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <>
            <MetricsCards summary={data.summary} />

            <div className="grid gap-6 lg:grid-cols-2">
              <ConversionFunnel funnel={data.funnel} />
              <TrafficSourcesTable sources={data.trafficSources} />
            </div>

            <DailyActivityChart data={data.dailyMetrics} />

            <EventCounts counts={data.eventCounts} />
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Failed to load analytics data</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
