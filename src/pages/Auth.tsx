import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        toast({
          title: isLogin ? "Sign in failed" : "Sign up failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: isLogin ? "Welcome back" : "Account created",
          description: isLogin
            ? "You are now signed in."
            : "You can now sign in with your credentials.",
        });
        navigate("/");
      }
    } finally {
      setIsLoading(false);
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
            src="/favicon.png"
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
            <h1 className="text-2xl font-bold text-foreground">
              {isLogin ? "Sign in" : "Create account"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {isLogin
                ? "Sign in to access your premium insights."
                : "Create an account to save your analysis."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

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
