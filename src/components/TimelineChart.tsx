import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

interface TimelineEntry {
  id: string;
  recorded_at: string;
  base_salary: number;
  bonus: number;
  equity_value: number;
  job_title: string;
  company: string | null;
}

interface TimelineChartProps {
  entries: TimelineEntry[];
}

// Average US inflation rates for projection
const AVERAGE_INFLATION = 0.03;

export function TimelineChart({ entries }: TimelineChartProps) {
  const chartData = useMemo(() => {
    if (entries.length === 0) return [];

    const sortedEntries = [...entries].sort(
      (a, b) =>
        new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
    );

    const firstEntry = sortedEntries[0];
    const firstTotalComp =
      firstEntry.base_salary + firstEntry.bonus + firstEntry.equity_value;
    const firstDate = new Date(firstEntry.recorded_at);

    return sortedEntries.map((entry) => {
      const totalComp = entry.base_salary + entry.bonus + entry.equity_value;
      const entryDate = new Date(entry.recorded_at);
      const yearsSinceFirst =
        (entryDate.getTime() - firstDate.getTime()) /
        (1000 * 60 * 60 * 24 * 365);

      // Calculate what the first salary would be if it just kept up with inflation
      const inflationAdjusted = Math.round(
        firstTotalComp * Math.pow(1 + AVERAGE_INFLATION, yearsSinceFirst)
      );

      return {
        date: entryDate.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        totalComp,
        inflationAdjusted,
        label: `${entry.job_title}${entry.company ? ` @ ${entry.company}` : ""}`,
      };
    });
  }, [entries]);

  if (entries.length < 2) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">
          Add at least 2 salary milestones to see your timeline chart.
        </p>
      </Card>
    );
  }

  const formatCurrency = (value: number) =>
    `$${(value / 1000).toFixed(0)}k`;

  return (
    <Card className="p-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis
              tickFormatter={formatCurrency}
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
              width={60}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === "totalComp" ? "Your Compensation" : "Inflation-Adjusted Baseline",
              ]}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend
              formatter={(value) =>
                value === "totalComp"
                  ? "Your Compensation"
                  : "Inflation-Adjusted Baseline"
              }
            />
            <Line
              type="monotone"
              dataKey="totalComp"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--primary))" }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="inflationAdjusted"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
