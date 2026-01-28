"use client";

import katex from "katex";
import { useEffect, useRef } from "react";
import "katex/dist/katex.min.css";

interface LaTeXProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function LaTeX({ math, display = false, className }: LaTeXProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (error) {
        console.error("KaTeX error:", error);
        containerRef.current.textContent = math;
      }
    }
  }, [math, display]);

  return <span className={className} dir="ltr" ref={containerRef} />;
}

// Component to render inline math $...$
export function InlineMath({ children }: { children: string }) {
  return <LaTeX display={false} math={children} />;
}

// Component to render display math $$...$$
export function DisplayMath({ children }: { children: string }) {
  return (
    <div className="my-4 overflow-x-auto">
      <LaTeX display={true} math={children} />
    </div>
  );
}

// Utility to parse and render LaTeX in text
export function renderLatexInText(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Match display math $$...$$ first
  const displayRegex = /\$\$([^$]+)\$\$/g;
  let match;

  while ((match = displayRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<DisplayMath key={match.index}>{match[1]}</DisplayMath>);
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    // Now handle inline math $...$
    const remaining = text.slice(lastIndex);
    const inlineRegex = /\$([^$]+)\$/g;
    let inlineLastIndex = 0;

    while ((match = inlineRegex.exec(remaining)) !== null) {
      if (match.index > inlineLastIndex) {
        parts.push(remaining.slice(inlineLastIndex, match.index));
      }
      parts.push(
        <InlineMath key={`inline-${match.index}`}>{match[1]}</InlineMath>
      );
      inlineLastIndex = match.index + match[0].length;
    }

    if (inlineLastIndex < remaining.length) {
      parts.push(remaining.slice(inlineLastIndex));
    }
  }

  return parts.length > 0 ? parts : [text];
}
