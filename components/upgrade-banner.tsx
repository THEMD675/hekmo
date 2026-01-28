"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, X, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UpgradeBannerProps {
  variant?: "inline" | "floating" | "card";
  dismissible?: boolean;
  className?: string;
}

export function UpgradeBanner({
  variant = "inline",
  dismissible = true,
  className,
}: UpgradeBannerProps) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  if (variant === "floating") {
    return (
      <div
        className={cn(
          "fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 rounded-lg bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg z-40",
          className
        )}
       
      >
        {dismissible && (
          <button
            className="absolute top-2 left-2 p-1 rounded hover:bg-white/20"
            onClick={() => setDismissed(true)}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-start gap-3">
          <Crown className="h-8 w-8 flex-shrink-0" />
          <div>
            <h3 className="font-bold mb-1">ترقية للنسخة المميزة</h3>
            <p className="text-sm opacity-90 mb-3">
              احصل على محادثات غير محدودة وأدوات متقدمة
            </p>
            <Button
              onClick={handleUpgrade}
              size="sm"
              variant="secondary"
            >
              <Sparkles className="h-4 w-4 ml-1" />
              ترقية الآن
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={cn(
          "p-6 rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10",
          className
        )}
       
      >
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-bold">حكمو برو</h3>
        </div>
        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            محادثات غير محدودة
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            نماذج ذكاء اصطناعي متقدمة
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            أولوية في الدعم
          </li>
          <li className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            توليد صور وملفات
          </li>
        </ul>
        <Button className="w-full" onClick={handleUpgrade}>
          <Crown className="h-4 w-4 ml-2" />
          ترقية للنسخة المميزة
        </Button>
      </div>
    );
  }

  // Default inline variant
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-3 rounded-lg bg-primary/10 border border-primary/20",
        className
      )}
     
    >
      <div className="flex items-center gap-2">
        <Crown className="h-5 w-5 text-primary" />
        <span className="text-sm">
          ترقية للمميز للحصول على ميزات أكثر
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleUpgrade} size="sm">
          ترقية
        </Button>
        {dismissible && (
          <Button onClick={() => setDismissed(true)} size="icon" variant="ghost">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// Usage limit warning
export function UsageLimitWarning({
  current,
  limit,
  type = "messages",
}: {
  current: number;
  limit: number;
  type?: "messages" | "tokens";
}) {
  const percentage = (current / limit) * 100;
  const router = useRouter();

  if (percentage < 80) return null;

  const isExceeded = percentage >= 100;

  return (
    <div
      className={cn(
        "p-3 rounded-lg border",
        isExceeded
          ? "bg-destructive/10 border-destructive/50"
          : "bg-yellow-500/10 border-yellow-500/50"
      )}
     
    >
      <p className="text-sm">
        {isExceeded ? (
          <>
            <span className="font-medium">وصلت للحد الأقصى!</span> ترقية للمتابعة
          </>
        ) : (
          <>
            استخدمت {Math.round(percentage)}% من{" "}
            {type === "messages" ? "رسائلك" : "التوكنز"}
          </>
        )}
      </p>
      {isExceeded && (
        <Button
          className="mt-2"
          onClick={() => router.push("/pricing")}
          size="sm"
        >
          <Crown className="h-4 w-4 ml-1" />
          ترقية الآن
        </Button>
      )}
    </div>
  );
}
