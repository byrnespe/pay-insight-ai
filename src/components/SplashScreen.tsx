import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
  minDisplayTime?: number;
}

const SplashScreen = ({ onComplete, minDisplayTime = 1500 }: SplashScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 300); // Wait for fade animation
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [onComplete, minDisplayTime]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-800 transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-700 shadow-lg">
          <span className="text-4xl font-bold text-white">U</span>
        </div>
        
        {/* App name */}
        <h1 className="text-2xl font-semibold text-white">Underpaid</h1>
        
        {/* Loading indicator */}
        <div className="mt-4 flex gap-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
          <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
          <div className="h-2 w-2 animate-pulse rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
      
      {/* Tagline */}
      <p className="absolute bottom-8 text-sm text-slate-400">
        Honest salary analysis
      </p>
    </div>
  );
};

export default SplashScreen;
