import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Globe, 
  Users, 
  BarChart3,
  Shield,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DataSourcesBadgeProps {
  dataSources?: {
    government: boolean;
    webSearch: boolean;
    crowdsourced: number;
    benchmark: boolean;
  };
  confidence?: 'high' | 'medium' | 'low';
  citations?: string[];
}

export function DataSourcesBadge({ dataSources, confidence, citations }: DataSourcesBadgeProps) {
  if (!dataSources && !confidence) {
    return null;
  }

  const getConfidenceIcon = () => {
    switch (confidence) {
      case 'high':
        return <ShieldCheck className="h-3.5 w-3.5" />;
      case 'medium':
        return <Shield className="h-3.5 w-3.5" />;
      case 'low':
        return <ShieldAlert className="h-3.5 w-3.5" />;
      default:
        return <Shield className="h-3.5 w-3.5" />;
    }
  };

  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const activeSourcesCount = dataSources 
    ? [dataSources.government, dataSources.webSearch, dataSources.crowdsourced > 0, dataSources.benchmark].filter(Boolean).length
    : 0;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        {/* Confidence Badge */}
        {confidence && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className={`gap-1 ${getConfidenceColor()}`}>
                {getConfidenceIcon()}
                {confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-sm">
                {confidence === 'high' && "Analysis grounded in multiple authoritative sources including government data."}
                {confidence === 'medium' && "Analysis based on available market data. Some sources may be limited."}
                {confidence === 'low' && "Limited data available. Estimates may have wider variance."}
              </p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Data Sources */}
        {dataSources && activeSourcesCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="gap-1 bg-background">
                <BarChart3 className="h-3.5 w-3.5" />
                {activeSourcesCount} Data Source{activeSourcesCount !== 1 ? 's' : ''}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <div className="space-y-2 text-sm">
                <p className="font-medium">Sources Used:</p>
                <ul className="space-y-1">
                  {dataSources.government && (
                    <li className="flex items-center gap-2">
                      <Building2 className="h-3 w-3 text-blue-500" />
                      Bureau of Labor Statistics (Government)
                    </li>
                  )}
                  {dataSources.webSearch && (
                    <li className="flex items-center gap-2">
                      <Globe className="h-3 w-3 text-purple-500" />
                      Live Web Data (Glassdoor, Indeed, LinkedIn)
                    </li>
                  )}
                  {dataSources.crowdsourced > 0 && (
                    <li className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-green-500" />
                      {dataSources.crowdsourced} Community Submissions
                    </li>
                  )}
                  {dataSources.benchmark && (
                    <li className="flex items-center gap-2">
                      <BarChart3 className="h-3 w-3 text-amber-500" />
                      Industry Benchmarks
                    </li>
                  )}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Citations indicator */}
        {citations && citations.length > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="gap-1 bg-background cursor-pointer">
                <Globe className="h-3.5 w-3.5" />
                {citations.length} Citation{citations.length !== 1 ? 's' : ''}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              <div className="space-y-1 text-sm">
                <p className="font-medium mb-2">Sources:</p>
                <ul className="space-y-1">
                  {citations.slice(0, 5).map((url, index) => (
                    <li key={index} className="truncate text-xs text-muted-foreground">
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {url.replace(/^https?:\/\//, '').split('/')[0]}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
