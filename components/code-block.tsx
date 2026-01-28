"use client";

import { useState } from "react";
import { Check, Copy, Play, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  language = "text",
  filename,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split("\n");

  return (
    <div className={cn("rounded-lg border bg-zinc-950 overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-400" />
          <span className="text-sm text-zinc-400">
            {filename || language}
          </span>
        </div>
        <Button
          className="h-7 px-2 text-zinc-400 hover:text-white"
          onClick={handleCopy}
          size="sm"
          variant="ghost"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 ml-1" />
              <span className="text-xs">تم النسخ</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 ml-1" />
              <span className="text-xs">نسخ</span>
            </>
          )}
        </Button>
      </div>

      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm" dir="ltr">
          <code className={`language-${language}`}>
            {showLineNumbers ? (
              <table className="border-collapse">
                <tbody>
                  {lines.map((line, i) => (
                    <tr key={i}>
                      <td className="pr-4 text-zinc-600 select-none text-right w-8">
                        {i + 1}
                      </td>
                      <td className="text-zinc-100 whitespace-pre">{line}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <span className="text-zinc-100">{code}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Inline code component
export function InlineCode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded bg-muted text-sm font-mono",
        className
      )}
      dir="ltr"
    >
      {children}
    </code>
  );
}

// Code diff component
export function CodeDiff({
  oldCode,
  newCode,
  language = "text",
  className,
}: {
  oldCode: string;
  newCode: string;
  language?: string;
  className?: string;
}) {
  const oldLines = oldCode.split("\n");
  const newLines = newCode.split("\n");

  // Simple diff - show removed and added lines
  const maxLines = Math.max(oldLines.length, newLines.length);

  return (
    <div className={cn("rounded-lg border bg-zinc-950 overflow-hidden", className)}>
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-900">
        <span className="text-sm text-zinc-400">التغييرات</span>
      </div>
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm" dir="ltr">
          {Array.from({ length: maxLines }).map((_, i) => {
            const oldLine = oldLines[i];
            const newLine = newLines[i];
            const isRemoved = oldLine !== undefined && oldLine !== newLine;
            const isAdded = newLine !== undefined && oldLine !== newLine;

            return (
              <div key={i}>
                {isRemoved && oldLine && (
                  <div className="bg-red-950/50 text-red-300">
                    <span className="inline-block w-6 text-red-500">-</span>
                    {oldLine}
                  </div>
                )}
                {isAdded && newLine && (
                  <div className="bg-green-950/50 text-green-300">
                    <span className="inline-block w-6 text-green-500">+</span>
                    {newLine}
                  </div>
                )}
                {!isRemoved && !isAdded && newLine !== undefined && (
                  <div className="text-zinc-400">
                    <span className="inline-block w-6"> </span>
                    {newLine}
                  </div>
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
