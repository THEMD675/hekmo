"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * INLINE CITATIONS - Perplexity Pattern
 * 
 * Features:
 * - Superscript numbered references [1], [2], etc.
 * - Hover preview with source info
 * - Click to open source
 * - Sources panel at bottom
 */

export interface Citation {
  id: number;
  title: string;
  url: string;
  snippet?: string;
  favicon?: string;
}

interface CitationBadgeProps {
  citation: Citation;
  className?: string;
}

/**
 * Inline citation superscript badge
 * Shows number, hover for preview, click to open
 */
export function CitationBadge({ citation, className }: CitationBadgeProps) {
  const [showPreview, setShowPreview] = useState(false);

  // Extract domain from URL for display
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <span className="relative inline-block">
      <a
        className={cn(
          "inline-flex items-center justify-center",
          "h-4 min-w-4 px-1 text-[10px] font-medium",
          "bg-primary/10 text-primary rounded-sm",
          "hover:bg-primary/20 transition-colors cursor-pointer",
          "align-super -translate-y-0.5",
          className
        )}
        href={citation.url}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
        rel="noopener noreferrer"
        target="_blank"
      >
        {citation.id}
      </a>

      {/* Hover Preview Card */}
      {showPreview && (
        <div
          className={cn(
            "absolute z-50 w-72 p-3",
            "bg-popover border border-border rounded-lg shadow-lg",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            // Position above or below based on space
            "bottom-full left-1/2 -translate-x-1/2 mb-2"
          )}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          {/* Source header */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-muted">
              <ExternalLink className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground truncate">
              {getDomain(citation.url)}
            </span>
          </div>

          {/* Title */}
          <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
            {citation.title}
          </p>

          {/* Snippet */}
          {citation.snippet && (
            <p className="text-xs text-muted-foreground line-clamp-3">
              {citation.snippet}
            </p>
          )}

          {/* Arrow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
            <div className="border-8 border-transparent border-t-popover" />
          </div>
        </div>
      )}
    </span>
  );
}

interface CitationsSourcesPanelProps {
  citations: Citation[];
  className?: string;
}

/**
 * Sources panel showing all citations
 * Displayed at the end of a response
 */
export function CitationsSourcesPanel({
  citations,
  className,
}: CitationsSourcesPanelProps) {
  if (citations.length === 0) return null;

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url;
    }
  };

  return (
    <div
      className={cn(
        "mt-4 pt-4 border-t border-border/50",
        className
      )}
    >
      <h4 className="text-xs font-medium text-muted-foreground mb-3">
        المصادر ({citations.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {citations.map((citation) => (
          <a
            className={cn(
              "flex items-center gap-2 px-3 py-1.5",
              "bg-muted/50 hover:bg-muted rounded-full",
              "text-xs transition-colors group"
            )}
            href={citation.url}
            key={citation.id}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              {citation.id}
            </span>
            <span className="text-foreground group-hover:text-primary transition-colors truncate max-w-32">
              {getDomain(citation.url)}
            </span>
            <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
}

/**
 * Parse text and replace [1], [2] etc. with citation badges
 */
export function parseCitationsInText(
  text: string,
  citations: Citation[]
): React.ReactNode[] {
  if (!text || citations.length === 0) {
    return [text];
  }

  const parts: React.ReactNode[] = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the citation
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Find the citation
    const citationId = parseInt(match[1], 10);
    const citation = citations.find((c) => c.id === citationId);

    if (citation) {
      parts.push(
        <CitationBadge citation={citation} key={`citation-${match.index}`} />
      );
    } else {
      // Keep original text if citation not found
      parts.push(match[0]);
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Extract citations from web search results
 */
export function extractCitationsFromSearchResults(
  results: Array<{ title: string; url: string; snippet?: string }>
): Citation[] {
  return results.map((result, index) => ({
    id: index + 1,
    title: result.title,
    url: result.url,
    snippet: result.snippet,
  }));
}
