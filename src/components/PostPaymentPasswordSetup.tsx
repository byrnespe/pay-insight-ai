import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/backend/client";

interface PostPaymentPasswordSetupProps {
  onComplete: () => void;
}

export const PostPaymentPasswordSetup = ({ onComplete }: PostPaymentPasswordSetupProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "password" | "complete">("email");
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/premium`,
        },
      });

      if (error) throw error;

      setMagicLinkSent(true);
      toast({
        title: "Check your email",
        description: "We sent you a magic link to sign in.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to send magic link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First sign in with password reset token (from magic link)
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) throw error;

      setStep("complete");
      toast({
        title: "Password set successfully",
        description: "You can now sign in with your email and password.",
      });
      
      setTimeout(onComplete, 1500);
    } catch (err) {
      toast({
        title: "Error setting password",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "complete") {
    return (
      <Card className="p-6 mb-8 border-success/50 bg-success/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-success/10">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Account ready!</h3>
            <p className="text-muted-foreground text-sm">
              Your password has been set. You're now signed in and can access your report anytime.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (magicLinkSent) {
    return (
      <Card className="p-6 mb-8 border-primary/50 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-full bg-primary/10">
            <Check className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground mb-1">Check your email</h3>
            <p className="text-muted-foreground text-sm mb-4">
              We sent a sign-in link to <strong>{email}</strong>. Click the link to access your account and set a password.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setMagicLinkSent(false);
                setEmail("");
              }}
            >
              Use different email
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 mb-8 border-success/50 bg-success/5">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="p-2 rounded-full bg-success/10 shrink-0">
          <Check className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1 w-full">
          <h3 className="font-semibold text-foreground mb-1">Payment successful!</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Enter your email to access your account and report.
          </p>

          <div className="space-y-4 w-full sm:max-w-sm">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMagicLink()}
                className="h-12 text-base"
              />
              <p className="text-xs text-muted-foreground">
                Use the same email you used for payment.
              </p>
            </div>

            <Button
              onClick={handleSendMagicLink}
              disabled={isLoading || !email.trim()}
              className="w-full h-12 text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send sign-in link"
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
