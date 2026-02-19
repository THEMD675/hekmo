"use client";

import { memo, type ReactNode, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "@/lib/utils";
import { CodeBlock, InlineCode } from "./code-block";
import { isMermaidCodeBlock, Mermaid } from "./markdown/mermaid";
import "katex/dist/katex.min.css";

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
  citations?: Array<{
    id: number;
    title: string;
    url: string;
    snippet?: string;
  }>;
}

/**
 * Parse text for citation patterns [1], [2], etc. and render them as badges
 */
function processCitations(
  children: ReactNode,
  citations?: Array<{
    id: number;
    title: string;
    url: string;
    snippet?: string;
  }>
): ReactNode {
  if (!citations || citations.length === 0) {
    return children;
  }

  // Only process string children
  if (typeof children !== "string") {
    // Handle arrays of children
    if (Array.isArray(children)) {
      return children.map((child, _i) => {
        const processed = processCitations(child, citations);
        return processed;
      }) as ReactNode;
    }
    return children;
  }

  const text = children;
  const parts: ReactNode[] = [];
  const regex = /\[(\d+)\]/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyCounter = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the citation
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Find the citation
    const citationId = Number.parseInt(match[1], 10);
    const citation = citations.find((c) => c.id === citationId);

    if (citation) {
      // Render citation badge - warm stone style
      parts.push(
        <a
          className="inline-flex items-center justify-center h-4 min-w-4 px-1 mx-0.5 text-[10px] font-medium bg-stone-200 text-stone-700 rounded hover:bg-stone-300 transition-colors align-super -translate-y-0.5 no-underline"
          href={citation.url}
          key={`cite-${keyCounter++}`}
          rel="noopener noreferrer"
          target="_blank"
          title={citation.title}
        >
          {citationId}
        </a>
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

  return parts.length > 0 ? parts : children;
}

export const EnhancedMarkdown = memo(function EnhancedMarkdown({
  content,
  className,
  citations,
}: EnhancedMarkdownProps) {
  const processedContent = useMemo(() => {
    // Pre-process content for better rendering
    return (
      content
        // Fix common markdown issues
        .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
        .trim()
    );
  }, [content]);

  return (
    <div className={cn("prose prose-invert max-w-none", className)} dir="auto">
      <ReactMarkdown
        components={{
          // Code blocks
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");
            const isInline = !match && !code.includes("\n");

            if (isInline) {
              return <InlineCode {...props}>{children}</InlineCode>;
            }

            // Check for mermaid
            if (isMermaidCodeBlock(language)) {
              return <Mermaid chart={code} className="my-4" />;
            }

            return (
              <CodeBlock
                className="my-4"
                code={code}
                language={language}
                showLineNumbers={code.split("\n").length > 3}
              />
            );
          },

          // Links
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith("http");
            return (
              <a
                className="text-primary hover:underline"
                href={href}
                rel={isExternal ? "noopener noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },

          // Tables
          table({ children }) {
            return (
              <div className="my-4 overflow-x-auto rounded-lg border">
                <table className="w-full">{children}</table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-muted">{children}</thead>;
          },
          th({ children }) {
            return (
              <th className="px-4 py-2 text-right font-medium border-b">
                {children}
              </th>
            );
          },
          td({ children }) {
            return <td className="px-4 py-2 border-b">{children}</td>;
          },

          // Lists
          ul({ children }) {
            return (
              <ul className="my-2 mr-4 list-disc space-y-1">{children}</ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="my-2 mr-4 list-decimal space-y-1">{children}</ol>
            );
          },

          // Blockquotes
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-r-4 border-primary/50 pr-4 italic text-muted-foreground">
                {children}
              </blockquote>
            );
          },

          // Headings
          h1({ children }) {
            return <h1 className="mt-6 mb-4 text-2xl font-bold">{children}</h1>;
          },
          h2({ children }) {
            return <h2 className="mt-5 mb-3 text-xl font-bold">{children}</h2>;
          },
          h3({ children }) {
            return (
              <h3 className="mt-4 mb-2 text-lg font-semibold">{children}</h3>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-6 border-t border-border" />;
          },

          // Paragraphs - with citation support
          p({ children }) {
            return (
              <p className="my-2 leading-relaxed">
                {processCitations(children, citations)}
              </p>
            );
          },

          // List items - with citation support
          li({ children }) {
            return <li>{processCitations(children, citations)}</li>;
          },

          // Images
          img({ src, alt }) {
            return (
              <img
                alt={alt || ""}
                className="my-4 max-w-full rounded-lg"
                loading="lazy"
                src={src}
              />
            );
          },
        }}
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkGfm, remarkMath]}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
});
