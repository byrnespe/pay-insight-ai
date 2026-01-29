import { Link } from "react-router-dom";
import { 
  Calculator, 
  Flag, 
  TrendingDown, 
  Mail, 
  TrendingUp, 
  Crown,
  Lock,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ToolItem {
  name: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const freeTools: ToolItem[] = [
  { 
    name: "Hours Check", 
    description: "Am I being exploited?", 
    path: "/exploitation-check", 
    icon: Calculator 
  },
  { 
    name: "Red Flags", 
    description: "Company warning signs", 
    path: "/red-flags", 
    icon: Flag 
  },
  { 
    name: "Cost of Staying", 
    description: "Earnings loss calculator", 
    path: "/cost-of-staying", 
    icon: TrendingDown 
  },
];

const proTools: ToolItem[] = [
  { 
    name: "Email Templates", 
    description: "AI negotiation scripts", 
    path: "/templates", 
    icon: Mail 
  },
  { 
    name: "Salary Timeline", 
    description: "Track compensation", 
    path: "/timeline", 
    icon: TrendingUp 
  },
];

export function CareerToolsMenu() {
  const { user, isPro } = useAuth();

  const getProToolLink = (toolPath: string) => {
    if (isPro) {
      return toolPath;
    }
    if (user) {
      return `/?upgrade=pro`;
    }
    return `/auth?returnTo=${toolPath}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm outline-none">
        Tools
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Free Tools
        </DropdownMenuLabel>
        {freeTools.map((tool) => (
          <DropdownMenuItem key={tool.path} asChild>
            <Link to={tool.path} className="cursor-pointer">
              <div className="flex items-start gap-3 py-1">
                <tool.icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal flex items-center gap-1.5">
          <Crown className="w-3 h-3" />
          Pro Tools
        </DropdownMenuLabel>
        {proTools.map((tool) => (
          <DropdownMenuItem key={tool.path} asChild>
            <Link to={getProToolLink(tool.path)} className="cursor-pointer">
              <div className="flex items-start gap-3 py-1 w-full">
                <tool.icon className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{tool.name}</p>
                    {!isPro && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Pro
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
        
        {!isPro && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                to={user ? "/?upgrade=pro" : "/auth"} 
                className="cursor-pointer justify-center"
              >
                <span className="text-sm text-primary font-medium">
                  {user ? "Upgrade to Pro" : "Sign up for Pro"}
                </span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
