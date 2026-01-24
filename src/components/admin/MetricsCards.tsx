import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, Activity } from "lucide-react";

interface MetricsCardsProps {
  summary: {
    totalUsers: number;
    totalReports: number;
    totalSalarySubmissions: number;
    eventsTracked: number;
    profileGrowth: string;
  };
}

export function MetricsCards({ summary }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Total Users",
      value: summary.totalUsers.toLocaleString(),
      change: summary.profileGrowth,
      icon: Users,
      description: "Registered accounts",
    },
    {
      title: "Saved Reports",
      value: summary.totalReports.toLocaleString(),
      icon: FileText,
      description: "User-saved analyses",
    },
    {
      title: "Salary Submissions",
      value: summary.totalSalarySubmissions.toLocaleString(),
      icon: TrendingUp,
      description: "Anonymous contributions",
    },
    {
      title: "Events Tracked",
      value: summary.eventsTracked.toLocaleString(),
      icon: Activity,
      description: "Last 30 days",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
            {metric.change && (
                <span className="text-primary mr-1">
                  {metric.change}
                </span>
              )}
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
