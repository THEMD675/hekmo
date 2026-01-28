"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MermaidProps {
  chart: string;
  className?: string;
}

export function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderChart = async () => {
      try {
        // Dynamically import mermaid to avoid SSR issues
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "inherit",
        });

        const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);
        setSvg(renderedSvg);
        setError(null);
      } catch (err) {
        console.error("Mermaid error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to render diagram"
        );
      }
    };

    if (chart) {
      renderChart();
    }
  }, [chart]);

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border border-destructive/50 bg-destructive/10 p-4",
          className
        )}
      >
        <p className="text-sm text-destructive">خطأ في عرض الرسم البياني:</p>
        <pre className="mt-2 text-xs text-muted-foreground overflow-auto">
          {error}
        </pre>
        <details className="mt-2">
          <summary className="text-xs text-muted-foreground cursor-pointer">
            عرض الكود
          </summary>
          <pre className="mt-2 text-xs overflow-auto">{chart}</pre>
        </details>
      </div>
    );
  }

  if (!svg) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-lg bg-muted h-32 flex items-center justify-center",
          className
        )}
      >
        <span className="text-muted-foreground text-sm">
          جاري تحميل الرسم البياني...
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-auto", className)}
      dangerouslySetInnerHTML={{ __html: svg }}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid SVG output
      ref={containerRef}
    />
  );
}

// Utility to detect mermaid code blocks
export function isMermaidCodeBlock(language: string): boolean {
  return language === "mermaid" || language === "mmd";
}
