"use client";

import { cn } from "@/lib/utils";

type Status = "online" | "offline" | "busy" | "away";
type Variant = "dot" | "badge" | "outline";

interface StatusBadgeProps {
  status: Status;
  variant?: Variant;
  label?: string;
  className?: string;
}

const STATUS_CONFIG = {
  online: {
    color: "bg-green-500",
    text: "متصل",
    textColor: "text-green-700 dark:text-green-400",
    borderColor: "border-green-500",
  },
  offline: {
    color: "bg-gray-400",
    text: "غير متصل",
    textColor: "text-gray-600 dark:text-gray-400",
    borderColor: "border-gray-400",
  },
  busy: {
    color: "bg-red-500",
    text: "مشغول",
    textColor: "text-red-700 dark:text-red-400",
    borderColor: "border-red-500",
  },
  away: {
    color: "bg-yellow-500",
    text: "بعيد",
    textColor: "text-yellow-700 dark:text-yellow-400",
    borderColor: "border-yellow-500",
  },
};

export function StatusBadge({
  status,
  variant = "badge",
  label,
  className,
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const displayLabel = label || config.text;

  if (variant === "dot") {
    return (
      <span
        className={cn(
          "inline-block h-2.5 w-2.5 rounded-full",
          config.color,
          className
        )}
        title={displayLabel}
      />
    );
  }

  if (variant === "outline") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
          config.borderColor,
          config.textColor,
          className
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
        {displayLabel}
      </span>
    );
  }

  // Default badge
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        config.color,
        "text-white",
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

// Connection status for chat
export function ConnectionStatus({
  connected,
  reconnecting,
}: {
  connected: boolean;
  reconnecting?: boolean;
}) {
  if (reconnecting) {
    return (
      <div className="flex items-center gap-2 text-xs text-yellow-600">
        <span className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
        جاري إعادة الاتصال...
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center gap-2 text-xs text-red-600">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        غير متصل
      </div>
    );
  }

  return null; // Don't show when connected
}
