import { Link } from "react-router-dom";
import { 
  User, 
  Crown, 
  LogOut, 
  Settings, 
  FileText, 
  LayoutDashboard,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CareerToolsMenu } from "@/components/CareerToolsMenu";
import { MobileNav } from "@/components/MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/backend/client";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type ActivePage = "home" | "salaries" | "benchmarks" | "blog" | "dashboard" | "about";

interface NavigationProps {
  activePage?: ActivePage;
  showDashboardLink?: boolean;
}

export function Navigation({ activePage, showDashboardLink = true }: NavigationProps) {
  const isMobile = useIsMobile();
  const { user, signOut, loading, isPro, hasReport } = useAuth();
  const { toast } = useToast();
  const [isManagingMembership, setIsManagingMembership] = useState(false);

  const handleManageMembership = async () => {
    setIsManagingMembership(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to manage your membership.",
          variant: "destructive",
        });
        return;
      }

      const response = await supabase.functions.invoke("customer-portal");
      
      if (response.error) {
        throw new Error(response.error.message || "Failed to open membership portal");
      }

      if (response.data?.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.error("Manage membership error:", error);
      toast({
        title: "Unable to open membership portal",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsManagingMembership(false);
    }
  };

  const getLinkClass = (page: ActivePage) => {
    return activePage === page
      ? "text-foreground font-medium"
      : "text-muted-foreground hover:text-foreground transition-colors";
  };

  return (
    <nav className="border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Mobile: Logo + hamburger */}
        {isMobile ? (
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/icons/icon-180.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
              <span className="font-semibold text-foreground">Underpaid</span>
            </Link>
            <MobileNav showDashboardLink={showDashboardLink} />
          </div>
        ) : (
          /* Desktop: Full navigation */
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <img src="/icons/icon-180.png" alt="Underpaid" className="h-7 w-7 rounded-lg" />
                <span className="font-semibold text-foreground hidden sm:inline">Underpaid</span>
              </Link>
              <div className="flex items-center gap-4 text-sm">
                <Link to="/" className={getLinkClass("home")}>
                  Home
                </Link>
                {showDashboardLink && user && (
                  <Link to="/dashboard" className={getLinkClass("dashboard")}>
                    Dashboard
                  </Link>
                )}
                <CareerToolsMenu />
                <Link to="/salaries" className={getLinkClass("salaries")}>
                  Salaries
                </Link>
                <Link to="/benchmarks" className={getLinkClass("benchmarks")}>
                  Benchmarks
                </Link>
                <Link to="/blog" className={getLinkClass("blog")}>
                  Blog
                </Link>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {!loading && (
                <>
                  {/* Quick access button for members */}
                  {user && (isPro || hasReport) && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link to="/premium">
                        {isPro ? <Crown className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        {isPro ? "Premium" : "Report"}
                      </Link>
                    </Button>
                  )}
                  
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <User className="h-4 w-4" />
                          <span className="max-w-[120px] truncate hidden sm:inline">{user.email}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium">{user.email}</p>
                            <p className="text-xs text-muted-foreground">
                              {isPro ? "Pro Member" : hasReport ? "Report Purchased" : "Free Account"}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem asChild>
                          <Link to="/dashboard" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        {isPro && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/premium" className="cursor-pointer">
                                <Crown className="mr-2 h-4 w-4" />
                                Premium Insights
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={handleManageMembership} 
                              className="cursor-pointer"
                              disabled={isManagingMembership}
                            >
                              <Settings className="mr-2 h-4 w-4" />
                              {isManagingMembership ? "Opening..." : "Manage Membership"}
                            </DropdownMenuItem>
                          </>
                        )}

                        {!isPro && hasReport && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link to="/premium" className="cursor-pointer">
                                <FileText className="mr-2 h-4 w-4" />
                                View Report
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to="/premium" className="cursor-pointer">
                                <Crown className="mr-2 h-4 w-4" />
                                Upgrade to Pro
                              </Link>
                            </DropdownMenuItem>
                          </>
                        )}

                        {!isPro && !hasReport && (
                          <DropdownMenuItem asChild>
                            <Link to="/premium" className="cursor-pointer">
                              <Crown className="mr-2 h-4 w-4" />
                              Upgrade to Pro
                            </Link>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button asChild variant="outline" size="sm">
                      <Link to="/auth">Sign in</Link>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
