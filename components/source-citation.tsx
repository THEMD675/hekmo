"use client";

import { ExternalLink, FileText, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  title: string;
  url?: string;
  snippet?: string;
  type?: "web" | "document" | "memory";
}

interface SourceCitationProps {
  sources: Source[];
  className?: string;
}

export function SourceCitation({ sources, className }: SourceCitationProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className={cn("mt-4 border-t pt-4", className)}>
      <h4 className="text-sm font-medium text-muted-foreground mb-2">
        المصادر ({sources.length})
      </h4>
      <div className="grid gap-2">
        {sources.map((source, index) => (
          <SourceCard index={index + 1} key={index} source={source} />
        ))}
      </div>
    </div>
  );
}

function SourceCard({ source, index }: { source: Source; index: number }) {
  const Icon = source.type === "document" ? FileText : Globe;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
        {index}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="font-medium text-sm truncate">{source.title}</span>
        </div>
        {source.snippet && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {source.snippet}
          </p>
        )}
      </div>
      {source.url && (
        <a
          className="shrink-0 p-1 rounded hover:bg-accent"
          href={source.url}
          rel="noopener noreferrer"
          target="_blank"
        >
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      )}
    </div>
  );
}

// Inline citation component for use within text
export function InlineCitation({
  index,
  title,
  url,
}: {
  index: number;
  title: string;
  url?: string;
}) {
  const content = (
    <sup className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-[10px] font-medium text-primary cursor-help">
      {index}
    </sup>
  );

  if (url) {
    return (
      <a href={url} rel="noopener noreferrer" target="_blank" title={title}>
        {content}
      </a>
    );
  }

  return <span title={title}>{content}</span>;
}
