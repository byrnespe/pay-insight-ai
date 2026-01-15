import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Privacy Policy</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          {/* Last Updated */}
          <p className="text-sm text-muted-foreground">Last updated: January 15, 2026</p>

          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Underpaid is a compensation analysis tool that helps you understand your market value. 
              We take your privacy seriously and are committed to protecting your personal information.
            </p>
          </section>

          {/* Data We Collect */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Data We Collect</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use Underpaid, we may collect the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li><strong className="text-foreground">Job details:</strong> Job title, location, years of experience, and company (optional)</li>
              <li><strong className="text-foreground">Compensation data:</strong> Current salary, bonus, hours worked</li>
              <li><strong className="text-foreground">Work conditions:</strong> Stress level, job satisfaction ratings</li>
              <li><strong className="text-foreground">Account information:</strong> Email address and password (if you create an account)</li>
            </ul>
          </section>

          {/* How We Use Your Data */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">How We Use Your Data</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data is used exclusively to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Generate your personalized salary analysis</li>
              <li>Provide compensation insights and recommendations</li>
              <li>Manage your account and purchased features</li>
              <li>Improve our analysis algorithms (aggregate, anonymized data only)</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We do not share your personal information with employers, recruiters, or any third parties for marketing purposes.
            </p>
          </section>

          {/* Data Storage */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Data Storage & Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your salary and job data is analyzed in real-time and is not permanently stored on our servers 
              unless you explicitly save a report to your account. Account information is stored securely 
              using industry-standard encryption.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We use secure, encrypted connections (HTTPS) for all data transmission.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use the following third-party services:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li><strong className="text-foreground">Stripe:</strong> For secure payment processing. We do not store your payment card details.</li>
              <li><strong className="text-foreground">Authentication providers:</strong> For secure account management</li>
            </ul>
          </section>

          {/* Cookies */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use essential cookies to maintain your session and remember your preferences (such as theme settings). 
              We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          {/* Your Rights */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Access your personal data</li>
              <li>Request deletion of your account and associated data</li>
              <li>Opt out of any marketing communications</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              To exercise these rights, please contact us using the information below.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this Privacy Policy or your data, please contact us at{" "}
              <a href="mailto:privacy@underpaidapp.com" className="text-primary hover:underline">
                privacy@underpaidapp.com
              </a>
            </p>
          </section>

          {/* Updates */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page 
              with an updated revision date. Continued use of the service after changes constitutes acceptance 
              of the updated policy.
            </p>
          </section>
        </div>

        {/* Footer link to Terms */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View Terms of Service
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Privacy;
