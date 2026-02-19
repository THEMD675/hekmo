"use client";

import { Maximize2, Minimize2, Terminal as TerminalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TerminalLine {
  type: "input" | "output" | "error";
  content: string;
  timestamp?: Date;
}

interface TerminalProps {
  lines?: TerminalLine[];
  onCommand?: (command: string) => void;
  title?: string;
  className?: string;
  readonly?: boolean;
}

export function Terminal({
  lines = [],
  onCommand,
  title = "Terminal",
  className,
  readonly = false,
}: TerminalProps) {
  const [input, setInput] = useState("");
  const [maximized, setMaximized] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && onCommand) {
      onCommand(input.trim());
      setInput("");
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border bg-zinc-950 overflow-hidden",
        maximized ? "fixed inset-4 z-50" : "",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-zinc-400" />
          <span className="text-sm text-zinc-400">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            className="h-6 w-6 text-zinc-400 hover:text-white"
            onClick={() => setMaximized(!maximized)}
            size="icon"
            variant="ghost"
          >
            {maximized ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Terminal body */}
      <div
        className="flex-1 p-4 overflow-y-auto font-mono text-sm min-h-[200px] max-h-[400px]"
        onClick={handleTerminalClick}
        ref={terminalRef}
      >
        {lines.map((line, index) => (
          <div
            className={cn(
              "whitespace-pre-wrap break-all",
              line.type === "input" && "text-green-400",
              line.type === "output" && "text-zinc-300",
              line.type === "error" && "text-red-400"
            )}
            key={index}
          >
            {line.type === "input" && <span className="text-blue-400">$ </span>}
            {line.content}
          </div>
        ))}

        {/* Input line */}
        {!readonly && (
          <form className="flex items-center" onSubmit={handleSubmit}>
            <span className="text-blue-400">$ </span>
            <input
              className="flex-1 bg-transparent text-green-400 outline-none border-none"
              onChange={(e) => setInput(e.target.value)}
              placeholder=""
              ref={inputRef}
              type="text"
              value={input}
            />
          </form>
        )}
      </div>
    </div>
  );
}

// Simple output-only terminal for displaying command results
export function TerminalOutput({
  output,
  error,
  command,
  className,
}: {
  output?: string;
  error?: string;
  command?: string;
  className?: string;
}) {
  const lines: TerminalLine[] = [];

  if (command) {
    lines.push({ type: "input", content: command });
  }
  if (output) {
    lines.push({ type: "output", content: output });
  }
  if (error) {
    lines.push({ type: "error", content: error });
  }

  return (
    <Terminal className={className} lines={lines} readonly title="Output" />
  );
}
