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
import Auth from "./pages/Auth";
import Install from "./pages/Install";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/premium" element={<Premium />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/install" element={<Install />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/about" element={<About />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default App;
