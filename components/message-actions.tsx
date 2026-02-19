"use client";

import {
  Check,
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MessageActionsProps {
  content?: string;
  messageId?: string;
  role?: "user" | "assistant";
  onRegenerate?: () => void;
  className?: string;
  chatId?: string;
  isLoading?: boolean;
  message?: unknown;
  setMode?: unknown;
  vote?: unknown;
}

export function MessageActions({
  content,
  messageId,
  role,
  onRegenerate,
  className,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const handleCopy = async () => {
    if (!content) {
      return;
    }
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("تم النسخ");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("فشل النسخ");
    }
  };

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = "ar-SA";
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const handleFeedback = async (type: "up" | "down") => {
    setFeedback(type);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          feedbackType: type === "up" ? "helpful" : "not-helpful",
        }),
      });
    } catch {
      // Silent fail
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        className
      )}
    >
      {/* Copy */}
      <Button onClick={handleCopy} size="icon" title="نسخ" variant="ghost">
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      {/* Speak (only for assistant messages) */}
      {role === "assistant" && (
        <Button
          className={cn(speaking && "text-primary")}
          onClick={handleSpeak}
          size="icon"
          title={speaking ? "إيقاف" : "استماع"}
          variant="ghost"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      )}

      {/* Feedback (only for assistant messages) */}
      {role === "assistant" && (
        <>
          <Button
            className={cn(feedback === "up" && "text-green-500")}
            disabled={feedback !== null}
            onClick={() => handleFeedback("up")}
            size="icon"
            title="مفيد"
            variant="ghost"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            className={cn(feedback === "down" && "text-red-500")}
            disabled={feedback !== null}
            onClick={() => handleFeedback("down")}
            size="icon"
            title="غير مفيد"
            variant="ghost"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Regenerate (only for last assistant message) */}
      {role === "assistant" && onRegenerate && (
        <Button
          onClick={onRegenerate}
          size="icon"
          title="إعادة التوليد"
          variant="ghost"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
