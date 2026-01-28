"use client";

import { useState } from "react";
import {
  Paperclip,
  Mic,
  Image,
  FileText,
  Globe,
  Calculator,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ChatInputActionsProps {
  onFileClick?: () => void;
  onVoiceClick?: () => void;
  onToolSelect?: (tool: string) => void;
  isListening?: boolean;
  className?: string;
}

const QUICK_TOOLS = [
  { id: "image", icon: <Image className="h-4 w-4" />, label: "توليد صورة" },
  { id: "search", icon: <Globe className="h-4 w-4" />, label: "بحث الويب" },
  { id: "calculator", icon: <Calculator className="h-4 w-4" />, label: "حاسبة" },
  { id: "pdf", icon: <FileText className="h-4 w-4" />, label: "قراءة PDF" },
];

export function ChatInputActions({
  onFileClick,
  onVoiceClick,
  onToolSelect,
  isListening = false,
  className,
}: ChatInputActionsProps) {
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* File attachment */}
      <Button
        onClick={onFileClick}
        size="icon"
        title="إرفاق ملف"
        type="button"
        variant="ghost"
      >
        <Paperclip className="h-5 w-5" />
      </Button>

      {/* Voice input */}
      <Button
        className={cn(isListening && "text-red-500")}
        onClick={onVoiceClick}
        size="icon"
        title={isListening ? "إيقاف التسجيل" : "إدخال صوتي"}
        type="button"
        variant="ghost"
      >
        <Mic className={cn("h-5 w-5", isListening && "animate-pulse")} />
      </Button>

      {/* Quick tools */}
      <Popover onOpenChange={setToolsOpen} open={toolsOpen}>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            title="أدوات سريعة"
            type="button"
            variant="ghost"
          >
            <Sparkles className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-48 p-2">
          <div className="space-y-1">
            {QUICK_TOOLS.map((tool) => (
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                key={tool.id}
                onClick={() => {
                  onToolSelect?.(tool.id);
                  setToolsOpen(false);
                }}
                type="button"
              >
                {tool.icon}
                {tool.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
