import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-foreground">Terms of Service</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          {/* Last Updated */}
          <p className="text-sm text-muted-foreground">Last updated: January 15, 2026</p>

          {/* Introduction */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using Underpaid, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the service.
            </p>
          </section>

          {/* Description of Service */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Underpaid provides compensation analysis tools that help you understand your market value. 
              Our services include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>AI-powered salary analysis based on market data</li>
              <li>Downloadable PDF reports</li>
              <li>Negotiation scripts and response strategies (Pro)</li>
              <li>Offer comparison tools (Pro)</li>
            </ul>
          </section>

          {/* User Accounts */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some features require an account. You are responsible for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Maintaining the confidentiality of your password</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Provide false or misleading information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Resell or redistribute our analysis outputs commercially</li>
            </ul>
          </section>

          {/* Purchases & Payments */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Purchases & Payments</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">One-Time Reports:</strong> Provide lifetime access to the features included at the time of purchase.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Pro Subscriptions:</strong> Billed on a recurring basis until cancelled. You may cancel at any time through your account settings.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Refunds:</strong> Given the digital nature of our service, refunds are provided on a case-by-case basis. Contact us if you believe a refund is warranted.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content, features, and functionality of Underpaid are owned by us and are protected by 
              copyright and other intellectual property laws. Analysis outputs generated for you are 
              provided for your personal use only.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Disclaimers</h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Not Professional Advice:</strong> Our analysis is for informational purposes only and does not constitute financial, legal, or career advice. 
              We recommend consulting with qualified professionals for specific decisions.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Accuracy:</strong> While we strive for accuracy, salary estimates are based on available market data and may not reflect your exact situation. 
              Results should be used as one of many factors in your decision-making.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, Underpaid shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages resulting from your use of the service, 
              including but not limited to lost profits, career decisions, or negotiation outcomes.
            </p>
          </section>

          {/* Termination */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may terminate or suspend your account at our sole discretion, without prior notice, 
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. Changes will be posted on this page 
              with an updated revision date. Continued use of the service after changes constitutes 
              acceptance of the updated terms.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about these Terms, please contact us at{" "}
              <a href="mailto:support@underpaidapp.com" className="text-primary hover:underline">
                support@underpaidapp.com
              </a>
            </p>
          </section>
        </div>

        {/* Footer link to Privacy */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            View Privacy Policy
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Terms;
