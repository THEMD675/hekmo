"use client";

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerProps {
  className?: string;
}

export function Disclaimer({ className }: DisclaimerProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-2 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800",
        className
      )}
    >
      <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-yellow-800 dark:text-yellow-200">
        <p className="font-medium">تنبيه طبي:</p>
        <p className="text-yellow-700 dark:text-yellow-300">
          المعلومات المقدمة للتثقيف فقط ولا تغني عن استشارة الطبيب المختص.
        </p>
      </div>
    </div>
  );
}

export function FooterDisclaimer() {
  return (
    <p className="text-xs text-center text-muted-foreground">
      حكمو مساعد ذكي للتثقيف الصحي فقط ولا يقدم نصائح طبية.{" "}
      <span className="text-primary">استشر طبيبك دائماً.</span>
    </p>
  );
}
