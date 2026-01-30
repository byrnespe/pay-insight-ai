import { useState } from "react";
import { Mail, Loader2, Check, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/backend/client";
import { trackEvent } from "@/hooks/useAnalytics";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Please enter a valid email" }).max(255);

interface EmailCaptureProps {
  jobTitle?: string;
  location?: string;
  variant?: "inline" | "card";
  source?: string;
}

export function EmailCapture({ 
  jobTitle, 
  location, 
  variant = "card",
  source = "salary_results" 
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if already subscribed this session
  const alreadySubscribed = sessionStorage.getItem("underpaid_email_subscribed");
  if (alreadySubscribed && !isSubscribed) {
    return null; // Don't show if already subscribed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate email
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsSubmitting(true);

    try {
      // Store subscription in analytics_events table (reusing existing table)
      const { error: dbError } = await supabase
        .from("analytics_events")
        .insert({
          event_name: "newsletter_signup",
          properties: {
            email: result.data,
            job_title: jobTitle,
            location: location,
            source: source,
          },
        });

      if (dbError) {
        console.error("Subscription error:", dbError);
        // Don't throw - still show success to user (email captured in logs)
      }

      // Track the event
      trackEvent("newsletter_signup", { source });

      setIsSubscribed(true);
      sessionStorage.setItem("underpaid_email_subscribed", "true");
      
      toast({
        title: "You're subscribed!",
        description: "We'll send you salary insights and market updates.",
      });
    } catch (err) {
      console.error("Subscription error:", err);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <Card className="p-4 bg-success/10 border-success/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-success/20">
            <Check className="w-4 h-4 text-success" />
          </div>
          <div>
            <p className="font-medium text-foreground">You're on the list!</p>
            <p className="text-sm text-muted-foreground">
              We'll send salary insights for your role monthly.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !email}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </form>
    );
  }

  return (
    <Card className="p-5 bg-muted/50 border-border">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
          <Bell className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-semibold text-foreground">
              Get salary updates for your role
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monthly insights on market rates, negotiation tips, and when salaries shift.
              {jobTitle && ` Tailored for ${jobTitle}${location ? ` in ${location}` : ""}.`}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                className="pl-9"
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting || !email}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Get Updates"
              )}
            </Button>
          </form>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </div>
      </div>
    </Card>
  );
}
