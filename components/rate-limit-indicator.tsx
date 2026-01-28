"use client";

import { useState, useEffect } from "react";
import { AlertCircle, Clock, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface RateLimitInfo {
  remaining: number;
  limit: number;
  reset: number; // Unix timestamp
}

interface RateLimitIndicatorProps {
  className?: string;
  showAlways?: boolean;
}

export function RateLimitIndicator({
  className,
  showAlways = false,
}: RateLimitIndicatorProps) {
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<string>("");

  useEffect(() => {
    // Fetch rate limit info
    const fetchRateLimit = async () => {
      try {
        const response = await fetch("/api/rate-limit");
        if (response.ok) {
          const data = await response.json();
          setRateLimit(data);
        }
      } catch {
        // Silent fail
      }
    };

    fetchRateLimit();
    const interval = setInterval(fetchRateLimit, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!rateLimit?.reset) return;

    const updateTimer = () => {
      const now = Date.now();
      const resetTime = rateLimit.reset * 1000;
      const diff = resetTime - now;

      if (diff <= 0) {
        setTimeUntilReset("الآن");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) {
        setTimeUntilReset(`${minutes} دقيقة`);
      } else {
        setTimeUntilReset(`${seconds} ثانية`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [rateLimit?.reset]);

  if (!rateLimit) return null;

  const usagePercent =
    ((rateLimit.limit - rateLimit.remaining) / rateLimit.limit) * 100;
  const isLow = rateLimit.remaining < rateLimit.limit * 0.2;
  const isExhausted = rateLimit.remaining === 0;

  // Only show if usage is significant or showAlways is true
  if (!showAlways && usagePercent < 50) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border",
        isExhausted && "bg-destructive/10 border-destructive/50",
        isLow && !isExhausted && "bg-yellow-500/10 border-yellow-500/50",
        !isLow && "bg-muted/50",
        className
      )}
      dir="rtl"
    >
      <div className="flex-shrink-0">
        {isExhausted ? (
          <AlertCircle className="h-5 w-5 text-destructive" />
        ) : (
          <Zap
            className={cn(
              "h-5 w-5",
              isLow ? "text-yellow-500" : "text-muted-foreground"
            )}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium">
            {isExhausted
              ? "انتهت الرسائل المتاحة"
              : `${rateLimit.remaining} رسالة متبقية`}
          </span>
          {!isExhausted && (
            <span className="text-xs text-muted-foreground">
              من {rateLimit.limit}
            </span>
          )}
        </div>

        <Progress
          className={cn(
            "h-1.5",
            isExhausted && "[&>div]:bg-destructive",
            isLow && !isExhausted && "[&>div]:bg-yellow-500"
          )}
          value={usagePercent}
        />

        {(isLow || isExhausted) && timeUntilReset && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>يتجدد خلال {timeUntilReset}</span>
          </div>
        )}
      </div>
    </div>
  );
}
