import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ConversionFunnelProps {
  funnel: {
    page_views: number;
    analysis_started: number;
    analysis_completed: number;
    checkout_initiated: number;
    checkout_completed: number;
  };
}

export function ConversionFunnel({ funnel }: ConversionFunnelProps) {
  const steps = [
    { label: "Page Views", value: funnel.page_views, key: "page_views" },
    { label: "Analysis Started", value: funnel.analysis_started, key: "analysis_started" },
    { label: "Analysis Completed", value: funnel.analysis_completed, key: "analysis_completed" },
    { label: "Checkout Initiated", value: funnel.checkout_initiated, key: "checkout_initiated" },
    { label: "Checkout Completed", value: funnel.checkout_completed, key: "checkout_completed" },
  ];

  const maxValue = Math.max(...steps.map((s) => s.value), 1);

  const calculateDropoff = (current: number, previous: number) => {
    if (previous === 0) return "—";
    return `${((current / previous) * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Conversion Funnel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const previousValue = index > 0 ? steps[index - 1].value : step.value;
          const dropoff = calculateDropoff(step.value, previousValue);
          const percentage = (step.value / maxValue) * 100;

          return (
            <div key={step.key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{step.label}</span>
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground">
                    {step.value.toLocaleString()}
                  </span>
                  {index > 0 && (
                    <span className={`text-xs ${
                      parseFloat(dropoff) > 50 
                        ? "text-green-600 dark:text-green-400" 
                        : parseFloat(dropoff) < 20 
                          ? "text-red-500" 
                          : "text-muted-foreground"
                    }`}>
                      {dropoff}
                    </span>
                  )}
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          );
        })}

        {funnel.page_views === 0 && (
          <p className="text-muted-foreground text-sm text-center py-4">
            No funnel data yet. Events will populate as users interact with the app.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
