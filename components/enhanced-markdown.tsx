"use client";

import { memo, useMemo } from "react";
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
}

export const EnhancedMarkdown = memo(function EnhancedMarkdown({
  content,
  className,
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

          // Paragraphs
          p({ children }) {
            return <p className="my-2 leading-relaxed">{children}</p>;
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
