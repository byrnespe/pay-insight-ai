import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <img src="/favicon.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/salaries" className="text-muted-foreground hover:text-foreground transition-colors">
                Salaries
              </Link>
              <Link to="/benchmarks" className="text-muted-foreground hover:text-foreground transition-colors">
                Benchmarks
              </Link>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Branding */}
        <div className="flex flex-col items-center mb-12">
          <img
            src="/favicon.png"
            alt="Underpaid logo"
            className="w-16 h-16 rounded-xl mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">About Underpaid</h1>
          <p className="text-muted-foreground text-center max-w-md">
            Compensation insights you can trust
          </p>
        </div>

        <div className="space-y-10 text-foreground">
          {/* Mission */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Underpaid exists to give workers clarity about their compensation. We provide 
              honest, data-driven analysis to help you understand whether you're being paid 
              fairly—and what to do about it. No motivational fluff. No HR jargon. Just 
              clear information to help you make informed career decisions.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-xl font-semibold mb-4">What We Do</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-medium">•</span>
                <span>Analyze your compensation against market data for your role and location</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium">•</span>
                <span>Calculate stress-adjusted pay to account for workload and job demands</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium">•</span>
                <span>Provide actionable negotiation scripts tailored to your situation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-medium">•</span>
                <span>Help you compare offers and plan your next career move</span>
              </li>
            </ul>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Our Values</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-medium mb-2">Clarity over comfort</h3>
                <p className="text-sm text-muted-foreground">
                  We give you honest assessments, even when the truth is uncomfortable.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-medium mb-2">Leverage over motivation</h3>
                <p className="text-sm text-muted-foreground">
                  We provide tools and framing, not pep talks or empty encouragement.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-medium mb-2">Trust over monetization</h3>
                <p className="text-sm text-muted-foreground">
                  Our free analysis is genuinely useful. We don't gate essential insights.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-medium mb-2">Privacy first</h3>
                <p className="text-sm text-muted-foreground">
                  Your salary data is analyzed in real-time. We don't store or sell it.
                </p>
              </div>
            </div>
          </section>

          {/* Trust & Security */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Trust & Security</h2>
            <div className="p-6 rounded-lg border border-border bg-card">
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Secure, encrypted connections (HTTPS) for all data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>No third-party sale of personal information</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Real-time analysis—salary inputs are not stored</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                  <span>Transparent pricing with no hidden fees</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Contact</h2>
            <p className="text-muted-foreground">
              Questions or feedback? Reach out at{" "}
              <a
                href="mailto:support@underpaid.app"
                className="text-primary hover:underline"
              >
                support@underpaid.app
              </a>
            </p>
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-16 pt-8 border-t border-border text-center">
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
