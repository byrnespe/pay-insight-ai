import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, Share, Plus, MoreVertical, Check } from "lucide-react";
import { Link } from "react-router-dom";

type Platform = "ios" | "android" | "desktop" | "unknown";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [platform, setPlatform] = useState<Platform>("unknown");
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else if (/android/.test(userAgent)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <CardTitle>Already Installed</CardTitle>
            <CardDescription>
              Underpaid is already installed on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold">Install Underpaid</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        {/* App Preview */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-primary-foreground text-2xl font-bold">U</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Underpaid</h2>
          <p className="text-muted-foreground">
            Install for quick access, offline support, and a native app experience.
          </p>
        </div>

        {/* Platform-specific instructions */}
        {platform === "ios" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Install on iPhone or iPad</CardTitle>
              <CardDescription>
                Follow these steps to add Underpaid to your home screen
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Share className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">1. Tap the Share button</p>
                  <p className="text-sm text-muted-foreground">
                    Located at the bottom of Safari (or top on iPad)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">2. Tap "Add to Home Screen"</p>
                  <p className="text-sm text-muted-foreground">
                    Scroll down in the share menu to find this option
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">3. Tap "Add"</p>
                  <p className="text-sm text-muted-foreground">
                    Confirm to add Underpaid to your home screen
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {platform === "android" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Install on Android</CardTitle>
              <CardDescription>
                Add Underpaid to your home screen for quick access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {deferredPrompt ? (
                <Button onClick={handleInstallClick} className="w-full" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Install App
                </Button>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <MoreVertical className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">1. Tap the menu button</p>
                      <p className="text-sm text-muted-foreground">
                        The three dots in the top right of Chrome
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">2. Tap "Install app" or "Add to Home screen"</p>
                      <p className="text-sm text-muted-foreground">
                        This will add Underpaid to your app drawer
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">3. Confirm installation</p>
                      <p className="text-sm text-muted-foreground">
                        Tap "Install" in the popup dialog
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {platform === "desktop" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Install on Desktop</CardTitle>
              <CardDescription>
                Add Underpaid to your computer for quick access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {deferredPrompt ? (
                <Button onClick={handleInstallClick} className="w-full" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Install App
                </Button>
              ) : (
                <>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Look for the install icon</p>
                      <p className="text-sm text-muted-foreground">
                        In Chrome, look for the install icon in the address bar (right side)
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    If you don't see an install option, your browser may not support PWA installation.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Benefits */}
        <div className="mt-8 space-y-3">
          <h3 className="font-medium text-center mb-4">Why install?</h3>
          <div className="grid gap-3">
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>Quick access from your home screen</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>Full-screen experience, no browser UI</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>Works offline once loaded</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Check className="w-4 h-4 text-success shrink-0" />
              <span>Faster loading with cached assets</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Install;
