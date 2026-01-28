"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const COOKIE_CONSENT_KEY = "hekmo-cookie-consent";

type ConsentLevel = "essential" | "analytics" | "all";

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing to not block initial load
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShow(false);
  };

  const handleAcceptSelected = () => {
    const consent = {
      ...settings,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShow(false);
  };

  const handleRejectAll = () => {
    const consent = {
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg",
        "animate-in slide-in-from-bottom-4"
      )}
     
    >
      <div className="max-w-4xl mx-auto">
        {showSettings ? (
          // Detailed settings
          <div className="space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <Cookie className="h-5 w-5" />
              إعدادات ملفات تعريف الارتباط
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <div className="font-medium">ملفات ضرورية</div>
                  <div className="text-sm text-muted-foreground">
                    مطلوبة لعمل الموقع بشكل صحيح
                  </div>
                </div>
                <input
                  checked
                  className="h-4 w-4"
                  disabled
                  type="checkbox"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <div className="font-medium">ملفات التحليلات</div>
                  <div className="text-sm text-muted-foreground">
                    تساعدنا على فهم كيفية استخدام الموقع
                  </div>
                </div>
                <input
                  checked={settings.analytics}
                  className="h-4 w-4"
                  onChange={(e) =>
                    setSettings({ ...settings, analytics: e.target.checked })
                  }
                  type="checkbox"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div>
                  <div className="font-medium">ملفات التسويق</div>
                  <div className="text-sm text-muted-foreground">
                    تستخدم لعرض إعلانات مخصصة
                  </div>
                </div>
                <input
                  checked={settings.marketing}
                  className="h-4 w-4"
                  onChange={(e) =>
                    setSettings({ ...settings, marketing: e.target.checked })
                  }
                  type="checkbox"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAcceptSelected}>حفظ الإعدادات</Button>
              <Button onClick={() => setShowSettings(false)} variant="ghost">
                رجوع
              </Button>
            </div>
          </div>
        ) : (
          // Main banner
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك.{" "}
                <Link
                  className="underline hover:text-primary"
                  href="/privacy"
                >
                  اقرأ سياسة الخصوصية
                </Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAcceptAll} size="sm">
                قبول الكل
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                size="sm"
                variant="outline"
              >
                إعدادات
              </Button>
              <Button onClick={handleRejectAll} size="sm" variant="ghost">
                رفض غير الضرورية
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Hook to check consent
export function useCookieConsent(): CookieSettings | null {
  const [consent, setConsent] = useState<CookieSettings | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch {
        setConsent(null);
      }
    }
  }, []);

  return consent;
}
