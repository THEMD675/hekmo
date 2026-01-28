"use client";

import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThinkingIndicatorProps {
  thinking?: string;
  isStreaming?: boolean;
  className?: string;
}

export function ThinkingIndicator({
  thinking,
  isStreaming,
  className,
}: ThinkingIndicatorProps) {
  const [expanded, setExpanded] = useState(false);
  const [dots, setDots] = useState(".");

  // Animate dots while streaming
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  if (!thinking && !isStreaming) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/50 overflow-hidden transition-all",
        className
      )}
    >
      <button
        className="flex w-full items-center gap-2 p-3 text-sm text-muted-foreground hover:bg-muted/80 transition-colors"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <Brain className={cn("h-4 w-4", isStreaming && "animate-pulse")} />
        <span className="flex-1 text-right">
          {isStreaming ? `جاري التفكير${dots}` : "عملية التفكير"}
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {expanded && thinking && (
        <div className="border-t px-3 py-2 text-sm text-muted-foreground whitespace-pre-wrap max-h-64 overflow-y-auto">
          {thinking}
        </div>
      )}
    </div>
  );
}

// Simple loading indicator for tools
export function ToolLoadingIndicator({
  toolName,
  className,
}: {
  toolName: string;
  className?: string;
}) {
  const toolNames: Record<string, string> = {
    webSearch: "جاري البحث في الويب",
    prayerTimes: "جاري جلب أوقات الصلاة",
    calculator: "جاري الحساب",
    translate: "جاري الترجمة",
    urlSummarizer: "جاري تحليل الرابط",
    quranHadith: "جاري البحث في القرآن والحديث",
    youtubeSummarizer: "جاري تحليل الفيديو",
    imageGeneration: "جاري إنشاء الصورة",
    pdfReader: "جاري قراءة الملف",
    getWeather: "جاري جلب حالة الطقس",
    createDocument: "جاري إنشاء المستند",
    updateDocument: "جاري تحديث المستند",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-2 rounded-md bg-muted/50 text-sm text-muted-foreground",
        className
      )}
    >
      <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      <span>{toolNames[toolName] || `جاري تنفيذ ${toolName}`}</span>
    </div>
  );
}
