import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, TrendingUp, MapPin, Briefcase, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { useSEO } from "@/hooks/useSEO";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  getJobBySlug,
  getLocationBySlug,
  jobTitles,
  salaryLocations,
  JobTitle,
  LocationData,
} from "@/data/salaryPages";
import { EmailCapture } from "@/components/EmailCapture";
import { industryBenchmarks, locations as benchmarkLocations } from "@/data/industryBenchmarks";

const formatSalary = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

const SalaryByRole = () => {
  const { job, location } = useParams<{ job: string; location: string }>();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState<JobTitle | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [salaryRange, setSalaryRange] = useState<{ min: number; median: number; max: number } | null>(null);

  useEffect(() => {
    if (job && location) {
      const foundJob = getJobBySlug(job);
      const foundLocation = getLocationBySlug(location);
      
      if (foundJob && foundLocation) {
        setJobData(foundJob);
        setLocationData(foundLocation);

        // Find salary data from benchmarks
        const industryData = industryBenchmarks.find(
          (i) => i.id === foundJob.industry || i.name.toLowerCase().includes(foundJob.industry)
        );

        if (industryData && industryData.roles[foundJob.level]) {
          const locationSalary = industryData.roles[foundJob.level][foundLocation.benchmarkId];
          if (locationSalary) {
            setSalaryRange(locationSalary);
          }
        }
      }
    }
  }, [job, location]);

  // Dynamic SEO based on job and location
  const pageTitle = jobData && locationData 
    ? `${jobData.name} Salary in ${locationData.name} (2025)`
    : "Salary Data | Underpaid";
  
  const pageDescription = jobData && locationData && salaryRange
    ? `${jobData.name} salaries in ${locationData.name} range from ${formatSalary(salaryRange.min)} to ${formatSalary(salaryRange.max)}, with a median of ${formatSalary(salaryRange.median)}. Get accurate salary data and negotiate confidently.`
    : "Get accurate salary data for your role and location.";

  useSEO({
    title: pageTitle,
    description: pageDescription,
    canonical: `/salaries/${job}/${location}`,
  });

  // If job or location not found, show 404-like state
  if (!jobData || !locationData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <Card className="p-8 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Page Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find salary data for this combination.
            </p>
            <Button onClick={() => navigate("/salaries")}>
              Browse All Salaries
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  // Get related jobs (same industry, different levels)
  const relatedJobs = jobTitles
    .filter((j) => j.industry === jobData.industry && j.slug !== jobData.slug)
    .slice(0, 4);

  // Get same job in other locations
  const otherLocations = salaryLocations
    .filter((l) => l.slug !== locationData.slug)
    .slice(0, 6);

  // JSON-LD structured data for this salary page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    mainEntity: {
      "@type": "Occupation",
      name: jobData.name,
      occupationalCategory: jobData.industry,
      estimatedSalary: salaryRange ? {
        "@type": "MonetaryAmountDistribution",
        name: `${jobData.name} in ${locationData.name}`,
        currency: "USD",
        percentile10: salaryRange.min,
        median: salaryRange.median,
        percentile90: salaryRange.max,
      } : undefined,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/salaries">Salaries</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{jobData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{locationData.name}</span>
            <span className="mx-2">•</span>
            <Briefcase className="w-4 h-4" />
            <span className="capitalize">{jobData.industry}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            {jobData.name} Salary in {locationData.name}
          </h1>
          <p className="text-lg text-muted-foreground">
            2025 compensation data based on market research and community submissions.
          </p>
        </div>

        {/* Salary Range Card */}
        {salaryRange && (
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Salary Range</h2>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">25th Percentile</p>
                <p className="text-2xl font-bold text-foreground">{formatSalary(salaryRange.min)}</p>
              </div>
              <div className="border-x border-border px-4">
                <p className="text-sm text-muted-foreground mb-1">Median</p>
                <p className="text-3xl font-bold text-primary">{formatSalary(salaryRange.median)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">75th Percentile</p>
                <p className="text-2xl font-bold text-foreground">{formatSalary(salaryRange.max)}</p>
              </div>
            </div>
          </Card>
        )}

        {/* CTA */}
        <Card className="p-6 mb-8 bg-muted/50">
          <h3 className="font-semibold text-foreground mb-2">Get Your Personalized Analysis</h3>
          <p className="text-muted-foreground mb-4">
            Enter your actual salary to see how you compare and get negotiation strategies.
          </p>
          <Button asChild>
            <Link to="/">Analyze My Salary</Link>
          </Button>
        </Card>

        {/* Email Capture */}
        <div className="mb-8">
          <EmailCapture 
            jobTitle={jobData.name} 
            location={locationData.name} 
            source="salary_page"
          />
        </div>

        {/* Key Insights */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Key Insights</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-medium text-foreground mb-2">Experience Matters</h3>
              <p className="text-sm text-muted-foreground">
                {jobData.name}s with 5+ years experience typically earn 30-50% more than entry-level 
                professionals in {locationData.name}.
              </p>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium text-foreground mb-2">Negotiation Potential</h3>
              <p className="text-sm text-muted-foreground">
                Top performers can negotiate salaries 10-20% above median. Equity and bonuses 
                can add another 15-40% to total compensation.
              </p>
            </Card>
          </div>
        </section>

        {/* Same Role in Other Locations */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {jobData.name} Salaries in Other Cities
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {otherLocations.map((loc) => (
              <Link
                key={loc.slug}
                to={`/salaries/${jobData.slug}/${loc.slug}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <span className="text-foreground">{loc.name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

        {/* Related Roles */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Related Roles in {locationData.name}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {relatedJobs.map((relJob) => (
              <Link
                key={relJob.slug}
                to={`/salaries/${relJob.slug}/${locationData.slug}`}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <span className="text-foreground">{relJob.name}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </section>

        {/* Back to main salaries */}
        <div className="pt-6 border-t border-border">
          <Link
            to="/salaries"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Salary Database
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Calculator
            </Link>
            <Link to="/salaries" className="hover:text-foreground transition-colors">
              Salaries
            </Link>
            <Link to="/benchmarks" className="hover:text-foreground transition-colors">
              Benchmarks
            </Link>
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Underpaid. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SalaryByRole;
