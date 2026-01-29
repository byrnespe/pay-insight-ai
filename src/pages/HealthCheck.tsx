import { BACKEND_URL, BACKEND_PUBLISHABLE_KEY } from "@/integrations/backend/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

export default function HealthCheck() {
  const checks = [
    {
      name: "Backend URL",
      value: BACKEND_URL,
      ok: !!BACKEND_URL && BACKEND_URL.startsWith("https://"),
      masked: BACKEND_URL ? `${BACKEND_URL.slice(0, 30)}...` : "NOT SET",
    },
    {
      name: "Backend Key",
      value: BACKEND_PUBLISHABLE_KEY,
      ok: !!BACKEND_PUBLISHABLE_KEY && BACKEND_PUBLISHABLE_KEY.length > 20,
      masked: BACKEND_PUBLISHABLE_KEY
        ? `${BACKEND_PUBLISHABLE_KEY.slice(0, 20)}...${BACKEND_PUBLISHABLE_KEY.slice(-10)}`
        : "NOT SET",
    },
    {
      name: "VITE_SUPABASE_URL (raw)",
      value: (import.meta as any).env?.VITE_SUPABASE_URL,
      ok: !!(import.meta as any).env?.VITE_SUPABASE_URL,
      masked: (import.meta as any).env?.VITE_SUPABASE_URL || "NOT SET (using fallback)",
    },
    {
      name: "VITE_SUPABASE_PUBLISHABLE_KEY (raw)",
      value: (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY,
      ok: !!(import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY,
      masked: (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY
        ? `${((import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY as string).slice(0, 20)}...`
        : "NOT SET (using fallback)",
    },
  ];

  const allOk = checks.every((c) => c.ok);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Health Check</h1>
          <p className="text-muted-foreground text-sm">
            Internal diagnostics for backend configuration
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {allOk ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
              Configuration Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {checks.map((check) => (
              <div
                key={check.name}
                className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  {check.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  )}
                  <span className="font-medium text-sm">{check.name}</span>
                </div>
                <code className="text-xs text-muted-foreground bg-background px-2 py-1 rounded max-w-[300px] truncate">
                  {check.masked}
                </code>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
}
