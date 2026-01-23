import { Link } from "react-router-dom";
import { TrendingUp, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Timeline = () => {
  const { isPro } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">Salary Timeline</h1>
          <p className="text-muted-foreground">Track your compensation over time.</p>
        </div>

        <Card className="p-8 text-center">
          <Crown className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground mb-4">
            Visualize your salary progression and compare against inflation. {!isPro && "Available for Pro subscribers."}
          </p>
          <Link to="/">
            <Button>Return Home</Button>
          </Link>
        </Card>
      </main>
    </div>
  );
};

export default Timeline;
