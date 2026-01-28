"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Edit2, Check, X, MoreHorizontal, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelSelector } from "@/components/model-selector";
import { SystemPromptEditor } from "@/components/system-prompt-editor";
import { ShareChatDialog } from "@/components/share-chat-dialog";
import { ChatActions } from "@/components/chat-actions";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  chatId: string;
  title?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  onTitleChange?: (title: string) => void;
  className?: string;
  isReadonly?: boolean;
  selectedVisibilityType?: "public" | "private";
}

export function ChatHeader({
  chatId,
  title = "محادثة جديدة",
  selectedModel = "gpt-4o-mini",
  onModelChange,
  onTitleChange,
  className,
  isReadonly,
  selectedVisibilityType,
}: ChatHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      onTitleChange?.(editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <header
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3 border-b bg-background/95 backdrop-blur",
        className
      )}
    >
      {/* Left side - Back button on mobile */}
      <div className="flex items-center gap-2">
        <Button asChild className="md:hidden" size="icon" variant="ghost">
          <Link href="/">
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>

        {/* Title */}
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              className="h-8 w-48"
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") handleCancelEdit();
              }}
              value={editedTitle}
            />
            <Button onClick={handleSaveTitle} size="icon" variant="ghost">
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={handleCancelEdit} size="icon" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors"
            onClick={() => setIsEditing(true)}
            type="button"
          >
            <span className="truncate max-w-[200px]">{title}</span>
            <Edit2 className="h-3 w-3 opacity-50" />
          </button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {onModelChange && (
          <ModelSelector
            className="hidden sm:flex"
            onSelect={onModelChange}
            selectedModel={selectedModel}
          />
        )}

        <SystemPromptEditor chatId={chatId} />

        <ShareChatDialog
          chatId={chatId}
          trigger={
            <Button size="icon" variant="ghost">
              <Share2 className="h-5 w-5" />
            </Button>
          }
        />

        <ChatActions chatId={chatId} chatTitle={title} />
      </div>
    </header>
  );
}
