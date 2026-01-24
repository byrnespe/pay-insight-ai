import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Shield, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

type AuthMode = "login" | "signup" | "reset-request" | "new-password";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, updatePassword, session } = useAuth();
  const { toast } = useToast();

  // Check for password reset callback
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "reset" && session) {
      setMode("new-password");
    }
  }, [searchParams, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back",
            description: "You are now signed in.",
          });
          navigate("/");
        }
      } else if (mode === "signup") {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account created",
            description: "You can now sign in with your credentials.",
          });
          navigate("/");
        }
      } else if (mode === "reset-request") {
        const { error } = await resetPassword(email);
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          setResetEmailSent(true);
        }
      } else if (mode === "new-password") {
        if (password !== confirmPassword) {
          toast({
            title: "Passwords don't match",
            description: "Please make sure both passwords are the same.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        const { error } = await updatePassword(password);
        if (error) {
          toast({
            title: "Password update failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Password updated",
            description: "You can now sign in with your new password.",
          });
          setMode("login");
          setPassword("");
          setConfirmPassword("");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Sign in";
      case "signup":
        return "Create account";
      case "reset-request":
        return "Reset password";
      case "new-password":
        return "Set new password";
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "login":
        return "Sign in to access your premium insights.";
      case "signup":
        return "Create an account to save your analysis.";
      case "reset-request":
        return "Enter your email to receive a reset link.";
      case "new-password":
        return "Enter your new password below.";
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (mode) {
        case "login":
          return "Signing in...";
        case "signup":
          return "Creating account...";
        case "reset-request":
          return "Sending link...";
        case "new-password":
          return "Updating password...";
      }
    }
    switch (mode) {
      case "login":
        return "Sign in";
      case "signup":
        return "Create account";
      case "reset-request":
        return "Send reset link";
      case "new-password":
        return "Set new password";
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Branding Header */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="/icons/icon-180.png"
            alt="Underpaid logo"
            className="w-12 h-12 rounded-lg mb-3"
          />
          <h2 className="text-xl font-semibold text-foreground">Underpaid</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compensation insights you can trust
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{getTitle()}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {getDescription()}
            </p>
          </div>

          {mode === "reset-request" && resetEmailSent ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">Check your email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We've sent a password reset link to <strong>{email}</strong>. Click the link in the email to set a new password.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setMode("login");
                  setResetEmailSent(false);
                }}
                className="w-full"
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(mode === "login" || mode === "signup" || mode === "reset-request") && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              )}

              {(mode === "login" || mode === "signup") && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => setMode("reset-request")}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
              )}

              {mode === "new-password" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {getButtonText()}
              </Button>
            </form>
          )}

          {mode !== "new-password" && !resetEmailSent && (
            <div className="mt-6 text-center">
              {mode === "reset-request" ? (
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Back to sign in
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode(mode === "login" ? "signup" : "login")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mode === "login"
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"}
                </button>
              )}
            </div>
          )}

          {/* Security Reassurance */}
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>Your credentials are encrypted and securely stored.</span>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link
                to="/privacy"
                className="underline hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                to="/terms"
                className="underline hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
