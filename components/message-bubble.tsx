"use client";

import { Bot, User } from "lucide-react";
import { EnhancedMarkdown } from "@/components/enhanced-markdown";
import { MessageActions } from "@/components/message-actions";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLast?: boolean;
  onRegenerate?: () => void;
  className?: string;
}

export function MessageBubble({
  id,
  role,
  content,
  isLast = false,
  onRegenerate,
  className,
}: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "group flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 space-y-2 overflow-hidden",
          isUser && "flex flex-col items-end"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2 max-w-[85%]",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted rounded-tl-sm"
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <EnhancedMarkdown content={content} />
          )}
        </div>

        {/* Actions */}
        <MessageActions
          className={cn(isUser && "flex-row-reverse")}
          content={content}
          messageId={id}
          onRegenerate={isLast && !isUser ? onRegenerate : undefined}
          role={role}
        />
      </div>
    </div>
  );
}
