import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { Link } from "react-router-dom";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "underpaid-install-dismissed";
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const dismissedTime = parseInt(dismissedAt, 10);
      if (Date.now() - dismissedTime < DISMISS_DURATION) {
        return;
      }
    }

    // Detect iOS
    const userAgent = navigator.userAgent.toLowerCase();
    const isiOS = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isiOS);

    // For iOS, show after a delay
    if (isiOS) {
      const timer = setTimeout(() => setShow(true), 5000);
      return () => clearTimeout(timer);
    }

    // For Android/Chrome, wait for the install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show after user has interacted with the app
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Install Underpaid</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Add to your home screen for quick access
            </p>
          </div>
          <button 
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="mt-3 flex gap-2">
          {isIOS ? (
            <Link to="/install" className="flex-1">
              <Button size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                How to Install
              </Button>
            </Link>
          ) : deferredPrompt ? (
            <Button size="sm" className="flex-1" onClick={handleInstall}>
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
          ) : (
            <Link to="/install" className="flex-1">
              <Button size="sm" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                How to Install
              </Button>
            </Link>
          )}
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
