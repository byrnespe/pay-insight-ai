import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import InstallPrompt from "@/components/InstallPrompt";
import SplashScreen from "@/components/SplashScreen";
import Index from "./pages/Index";
import Premium from "./pages/Premium";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Install from "./pages/Install";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import NotFound from "./pages/NotFound";
import ExploitationCheck from "./pages/ExploitationCheck";
import RedFlags from "./pages/RedFlags";
import CostOfStaying from "./pages/CostOfStaying";
import Benchmarks from "./pages/Benchmarks";
import Templates from "./pages/Templates";
import Salaries from "./pages/Salaries";
import Timeline from "./pages/Timeline";
import Launch from "./pages/Launch";
import Admin from "./pages/Admin";
import AdminUsers from "./pages/AdminUsers";
import HealthCheck from "./pages/HealthCheck";
import { useUTMTracking } from "@/hooks/useUTMTracking";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(() => {
    // Only show splash on PWA standalone mode
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (window.navigator as any).standalone === true;
    return isStandalone;
  });

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
              <InstallPrompt />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const AppRoutes = () => {
  useUTMTracking();
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/launch" element={<Launch />} />
    <Route path="/premium" element={<Premium />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/install" element={<Install />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/about" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/blog/:slug" element={<BlogPost />} />
    <Route path="/exploitation-check" element={<ExploitationCheck />} />
    <Route path="/red-flags" element={<RedFlags />} />
    <Route path="/cost-of-staying" element={<CostOfStaying />} />
    <Route path="/benchmarks" element={<Benchmarks />} />
    <Route path="/templates" element={<Templates />} />
    <Route path="/salaries" element={<Salaries />} />
    <Route path="/timeline" element={<Timeline />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/admin/users" element={<AdminUsers />} />
    <Route path="/health" element={<HealthCheck />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ExitIntentPopup />
    </>
  );
};

export default App;
