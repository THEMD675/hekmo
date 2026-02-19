"use client";

import { Download, Smartphone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia("(display-mode: standalone)").matches;
    setIsStandalone(standalone);

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    // Check if dismissed recently
    const dismissed = localStorage.getItem("hekmo-pwa-dismissed");
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed =
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        return; // Don't show for 7 days after dismissal
      }
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, show the prompt after a delay
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (ios && !standalone) {
      timer = setTimeout(() => setIsVisible(true), 3000);
    }

    // Cleanup both event listener and timer
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("hekmo-pwa-dismissed", new Date().toISOString());
    setIsVisible(false);
  };

  if (!isVisible || isStandalone) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md",
        "animate-in slide-in-from-bottom-5 duration-500"
      )}
    >
      <div className="rounded-lg border bg-background/95 p-4 shadow-lg backdrop-blur-sm">
        <button
          aria-label="إغلاق"
          className="absolute left-2 top-2 rounded-sm p-1 opacity-70 hover:opacity-100"
          onClick={handleDismiss}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">ثبّت تطبيق حكمو</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              احصل على تجربة أسرع وإشعارات فورية
            </p>

            {isIOS ? (
              <div className="mt-3 text-sm text-muted-foreground">
                <p>اضغط على زر المشاركة</p>
                <p className="mt-1">ثم اختر "إضافة إلى الشاشة الرئيسية"</p>
              </div>
            ) : (
              <Button className="mt-3 gap-2" onClick={handleInstall} size="sm">
                <Download className="h-4 w-4" />
                تثبيت التطبيق
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
