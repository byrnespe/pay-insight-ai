import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Home,
  Calculator, 
  Flag, 
  TrendingDown, 
  Mail, 
  TrendingUp, 
  Crown,
  Lock,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users,
  BookOpen,
  LogOut,
  LayoutDashboard,
  FileText,
  Settings,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

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

interface MobileNavProps {
  showDashboardLink?: boolean;
}

export function MobileNav({ showDashboardLink }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isPro, hasReport, loading } = useAuth();

  const closeNav = () => setOpen(false);

  const getProToolLink = (toolPath: string) => {
    if (isPro) {
      return toolPath;
    }
    if (user) {
      return `/?upgrade=pro`;
    }
    return `/auth?returnTo=${toolPath}`;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85%] max-w-[320px] p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <nav className="flex flex-col h-[calc(100%-60px)]">
          {/* Main navigation links */}
          <div className="flex-1 overflow-y-auto py-2">
            <Link
              to="/"
              onClick={closeNav}
              className={`flex items-center gap-3 px-4 min-h-12 transition-colors ${
                isActive("/") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            {/* Tools collapsible */}
            <Collapsible open={toolsOpen} onOpenChange={setToolsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full px-4 min-h-12 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5" />
                  <span>Tools</span>
                </div>
                {toolsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-muted/30 py-2">
                  {/* Free Tools */}
                  <p className="px-6 py-2 text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Free Tools
                  </p>
                  {freeTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={closeNav}
                      className={`flex items-center gap-3 px-6 min-h-11 transition-colors ${
                        isActive(tool.path) ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tool.icon className="w-4 h-4" />
                      <div className="flex-1">
                        <p className="text-sm">{tool.name}</p>
                      </div>
                    </Link>
                  ))}

                  {/* Pro Tools */}
                  <p className="px-6 py-2 mt-2 text-xs text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5">
                    <Crown className="w-3 h-3" />
                    Pro Tools
                  </p>
                  {proTools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={getProToolLink(tool.path)}
                      onClick={closeNav}
                      className={`flex items-center gap-3 px-6 min-h-11 transition-colors ${
                        isActive(tool.path) ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <tool.icon className="w-4 h-4" />
                      <div className="flex-1 flex items-center gap-2">
                        <p className="text-sm">{tool.name}</p>
                        {!isPro && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Pro
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Link
              to="/salaries"
              onClick={closeNav}
              className={`flex items-center gap-3 px-4 min-h-12 transition-colors ${
                isActive("/salaries") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Salaries</span>
            </Link>

            <Link
              to="/benchmarks"
              onClick={closeNav}
              className={`flex items-center gap-3 px-4 min-h-12 transition-colors ${
                isActive("/benchmarks") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>Benchmarks</span>
            </Link>

            <Link
              to="/blog"
              onClick={closeNav}
              className={`flex items-center gap-3 px-4 min-h-12 transition-colors ${
                isActive("/blog") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Blog</span>
            </Link>

            {/* User-specific links */}
            {!loading && user && (
              <>
                <div className="border-t border-border my-2" />
                
                {showDashboardLink && (
                  <Link
                    to="/dashboard"
                    onClick={closeNav}
                    className={`flex items-center gap-3 px-4 min-h-12 transition-colors ${
                      isActive("/dashboard") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {(isPro || hasReport) && (
                  <Link
                    to="/premium"
                    onClick={closeNav}
                    className={`flex items-center gap-3 px-4 min-h-12 transition-colors ${
                      isActive("/premium") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    {isPro ? <Crown className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                    <span>{isPro ? "Premium Insights" : "View Report"}</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Bottom section: Theme toggle and auth */}
          <div className="border-t border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            
            {!loading && (
              <>
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        signOut();
                        closeNav();
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/auth" onClick={closeNav}>
                      Sign in
                    </Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
