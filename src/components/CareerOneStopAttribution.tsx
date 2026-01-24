import { ExternalLink } from "lucide-react";

interface CareerOneStopAttributionProps {
  className?: string;
  variant?: "inline" | "footer";
}

/**
 * Attribution component for CareerOneStop API data
 * Required per their API terms of service to display on all pages using their data
 */
export function CareerOneStopAttribution({ 
  className = "", 
  variant = "footer" 
}: CareerOneStopAttributionProps) {
  const logoUrl = "https://www.careeronestop.org/TridionMultimedia/tcm24-10203_COSLogo.png";
  
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <img 
          src={logoUrl}
          alt="CareerOneStop" 
          className="h-4 w-auto"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-xs text-muted-foreground">CareerOneStop</span>
      </span>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-2 py-4 ${className}`}>
      <span className="text-xs text-muted-foreground">Government salary data provided by</span>
      <a 
        href="https://www.careeronestop.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        aria-label="CareerOneStop - Government salary data source"
      >
        <img 
          src={logoUrl}
          alt="CareerOneStop" 
          className="h-5 w-auto"
          onError={(e) => {
            // Fallback to text if image fails
            e.currentTarget.style.display = 'none';
          }}
        />
        <span className="text-xs font-medium text-muted-foreground underline-offset-2 hover:underline">
          CareerOneStop
        </span>
        <ExternalLink className="h-3 w-3 text-muted-foreground" />
      </a>
    </div>
  );
}
