"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PWA_PROMPT_KEY = "hekmo-pwa-prompt-dismissed";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Check if prompt was dismissed
    const dismissed = localStorage.getItem(PWA_PROMPT_KEY);
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissed =
        (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      // Show again after 7 days
      if (daysSinceDismissed < 7) {
        return;
      }
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 30 seconds
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(PWA_PROMPT_KEY, new Date().toISOString());
    setShowPrompt(false);
  };

  if (!showPrompt || isInstalled) return null;

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 rounded-lg border bg-card shadow-lg z-50 animate-in slide-in-from-bottom-4"
      )}
      dir="rtl"
    >
      <button
        className="absolute top-2 left-2 p-1 rounded hover:bg-muted"
        onClick={handleDismiss}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex gap-4">
        <div className="p-3 rounded-lg bg-primary/10 text-primary flex-shrink-0">
          <Smartphone className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium mb-1">تثبيت حكمو</h3>
          <p className="text-sm text-muted-foreground mb-3">
            ثبت التطبيق على جهازك للوصول السريع وتجربة أفضل
          </p>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm">
              <Download className="h-4 w-4 ml-1" />
              تثبيت
            </Button>
            <Button onClick={handleDismiss} size="sm" variant="ghost">
              لاحقاً
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// iOS install instructions (Safari doesn't support beforeinstallprompt)
export function IOSInstallInstructions() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if iOS Safari
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as { MSStream?: unknown }).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    if (isIOS && isSafari && !isStandalone) {
      const dismissed = localStorage.getItem(PWA_PROMPT_KEY);
      if (!dismissed) {
        setTimeout(() => setShow(true), 30000);
      }
    }
  }, []);

  if (!show) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 p-4 rounded-lg border bg-card shadow-lg z-50"
      dir="rtl"
    >
      <button
        className="absolute top-2 left-2 p-1 rounded hover:bg-muted"
        onClick={() => {
          localStorage.setItem(PWA_PROMPT_KEY, new Date().toISOString());
          setShow(false);
        }}
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <h3 className="font-medium mb-2">أضف حكمو للشاشة الرئيسية</h3>
      <ol className="text-sm text-muted-foreground space-y-1">
        <li>1. اضغط على أيقونة المشاركة 📤</li>
        <li>2. اختر "إضافة للشاشة الرئيسية" ➕</li>
        <li>3. اضغط "إضافة" ✓</li>
      </ol>
    </div>
  );
}
