"use client";

import {
  Book,
  Calculator,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Globe,
  Image,
  Languages,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { extractCitationsFromSearchResults } from "./citations";

interface ToolResultProps {
  toolName: string;
  result: unknown;
  className?: string;
}

const TOOL_INFO: Record<
  string,
  { icon: React.ReactNode; label: string; color: string }
> = {
  webSearch: {
    icon: <Globe className="h-4 w-4" />,
    label: "بحث الويب",
    color: "text-blue-500",
  },
  calculator: {
    icon: <Calculator className="h-4 w-4" />,
    label: "الحاسبة",
    color: "text-green-500",
  },
  imageGeneration: {
    icon: <Image className="h-4 w-4" />,
    label: "توليد صورة",
    color: "text-purple-500",
  },
  pdfReader: {
    icon: <FileText className="h-4 w-4" />,
    label: "قراءة PDF",
    color: "text-red-500",
  },
  prayerTimes: {
    icon: <Clock className="h-4 w-4" />,
    label: "أوقات الصلاة",
    color: "text-amber-500",
  },
  quranHadith: {
    icon: <Book className="h-4 w-4" />,
    label: "القرآن والحديث",
    color: "text-emerald-500",
  },
  translate: {
    icon: <Languages className="h-4 w-4" />,
    label: "ترجمة",
    color: "text-cyan-500",
  },
};

export function ToolResult({ toolName, result, className }: ToolResultProps) {
  const [expanded, setExpanded] = useState(false);
  const toolInfo = TOOL_INFO[toolName] || {
    icon: <Globe className="h-4 w-4" />,
    label: toolName,
    color: "text-muted-foreground",
  };

  const renderResult = () => {
    if (!result) {
      return null;
    }

    // Web search results - Perplexity citation pattern
    if (
      toolName === "webSearch" &&
      typeof result === "object" &&
      "results" in (result as object)
    ) {
      const searchResults = (
        result as {
          results: Array<{ title: string; url: string; snippet: string }>;
        }
      ).results;

      // Convert to citations format
      const citations = extractCitationsFromSearchResults(searchResults);

      return (
        <div className="space-y-3">
          {/* Compact source chips - Perplexity style */}
          <div className="flex flex-wrap gap-1.5">
            {citations.slice(0, 5).map((citation) => (
              <a
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1",
                  "bg-muted/70 hover:bg-muted rounded-md",
                  "text-xs transition-colors group"
                )}
                href={citation.url}
                key={citation.id}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">
                  {citation.id}
                </span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-24">
                  {(() => {
                    try {
                      return new URL(citation.url).hostname.replace("www.", "");
                    } catch {
                      return citation.url;
                    }
                  })()}
                </span>
              </a>
            ))}
          </div>

          {/* Hint for using citations */}
          <p className="text-[10px] text-muted-foreground/70">
            استخدم [1] [2] [3] للإشارة للمصادر في إجابتك
          </p>
        </div>
      );
    }

    // Prayer times
    if (toolName === "prayerTimes" && typeof result === "object") {
      const times = result as Record<string, string>;
      return (
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(times).map(([name, time]) => (
            <div className="flex justify-between" key={name}>
              <span className="text-muted-foreground">{name}:</span>
              <span className="font-medium">{time}</span>
            </div>
          ))}
        </div>
      );
    }

    // Calculator
    if (
      toolName === "calculator" &&
      typeof result === "object" &&
      "result" in (result as object)
    ) {
      const calcResult = result as { result: number; expression: string };
      return (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {calcResult.expression}
          </p>
          <p className="text-2xl font-bold">{calcResult.result}</p>
        </div>
      );
    }

    // Default: stringify
    return (
      <pre className="text-xs overflow-auto max-h-40">
        {JSON.stringify(result, null, 2)}
      </pre>
    );
  };

  return (
    <div
      className={cn("rounded-lg border bg-muted/30 overflow-hidden", className)}
    >
      {/* Header */}
      <button
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="flex items-center gap-2">
          <span className={toolInfo.color}>{toolInfo.icon}</span>
          <span className="text-sm font-medium">{toolInfo.label}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {/* Content */}
      {expanded && (
        <div className="px-3 pb-3 border-t">
          <div className="pt-3">{renderResult()}</div>
        </div>
      )}
    </div>
  );
}
