import { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Loader2, ShieldX, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: "/admin", label: "Analytics", icon: BarChart3 },
  { path: "/admin/users", label: "Users", icon: Users },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAdmin, isLoading, error } = useAdminAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <ShieldX className="h-12 w-12 mx-auto text-destructive" />
          <h1 className="text-xl font-semibold">Access Error</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">U</span>
                </div>
                <div>
                  <h1 className="font-semibold">Underpaid Admin</h1>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                </div>
              </div>
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <a 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to App
            </a>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
