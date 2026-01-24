import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/hooks/useAnalytics";

interface ExitIntentPopupProps {
  enabled?: boolean;
}

export function ExitIntentPopup({ enabled = true }: ExitIntentPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const navigate = useNavigate();

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves through top of viewport
    if (e.clientY <= 0 && !hasShown && enabled) {
      // Check if user hasn't already seen this or completed an analysis
      const hasSeenPopup = sessionStorage.getItem("exit_intent_shown");
      const hasCompletedAnalysis = sessionStorage.getItem("analysis_result");
      
      if (!hasSeenPopup && !hasCompletedAnalysis) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("exit_intent_shown", "true");
        trackEvent("exit_intent_shown");
      }
    }
  }, [hasShown, enabled]);

  useEffect(() => {
    if (!enabled) return;
    
    // Add delay before enabling exit intent
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000); // 5 second delay

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseLeave, enabled]);

  const handleStartAnalysis = () => {
    trackEvent("exit_intent_converted");
    setIsOpen(false);
    navigate("/");
    // Scroll to form
    setTimeout(() => {
      const form = document.querySelector("form");
      form?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Before you go...</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Thousands of people are underpaid without knowing it. A quick, free analysis takes less than 60 seconds.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              What you'll learn:
            </p>
            <ul className="text-sm space-y-1">
              <li>• How your pay compares to market rates</li>
              <li>• Whether your workload matches your compensation</li>
              <li>• Specific paths forward if you're underpaid</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button onClick={handleStartAnalysis} className="w-full">
              Check My Salary (Free)
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground"
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
