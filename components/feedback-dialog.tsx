"use client";

import { useState } from "react";
import { MessageSquare, Star, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  messageId?: string;
  trigger?: React.ReactNode;
}

const FEEDBACK_TYPES = [
  { id: "helpful", label: "مفيد", emoji: "👍" },
  { id: "not-helpful", label: "غير مفيد", emoji: "👎" },
  { id: "inaccurate", label: "غير دقيق", emoji: "❌" },
  { id: "offensive", label: "غير لائق", emoji: "⚠️" },
  { id: "other", label: "أخرى", emoji: "💬" },
];

export function FeedbackDialog({ messageId, trigger }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!rating && !feedbackType) {
      toast.error("الرجاء اختيار تقييم أو نوع الملاحظة");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          rating,
          feedbackType,
          comment,
        }),
      });

      if (!response.ok) throw new Error();

      toast.success("شكراً على ملاحظاتك!");
      setOpen(false);
      setRating(0);
      setFeedbackType(null);
      setComment("");
    } catch {
      toast.error("فشل إرسال الملاحظات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="ghost">
            <MessageSquare className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>أرسل ملاحظاتك</DialogTitle>
          <DialogDescription>
            ساعدنا في تحسين حكمو من خلال إرسال ملاحظاتك
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <label className="text-sm font-medium">التقييم العام</label>
            <div className="flex gap-1 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  className={cn(
                    "p-1 transition-colors",
                    star <= rating
                      ? "text-yellow-500"
                      : "text-muted-foreground hover:text-yellow-400"
                  )}
                  key={star}
                  onClick={() => setRating(star)}
                  type="button"
                >
                  <Star
                    className="h-8 w-8"
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">نوع الملاحظة</label>
            <div className="flex flex-wrap gap-2">
              {FEEDBACK_TYPES.map((type) => (
                <button
                  className={cn(
                    "px-3 py-1.5 rounded-full border text-sm transition-colors",
                    feedbackType === type.id
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-muted"
                  )}
                  key={type.id}
                  onClick={() => setFeedbackType(type.id)}
                  type="button"
                >
                  <span className="ml-1">{type.emoji}</span>
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium">تعليق (اختياري)</label>
            <textarea
              className="w-full min-h-[80px] px-3 py-2 rounded-md border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              onChange={(e) => setComment(e.target.value)}
              placeholder="أخبرنا المزيد..."
              value={comment}
            />
          </div>

          {/* Submit */}
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            ) : (
              <Send className="h-4 w-4 ml-2" />
            )}
            إرسال الملاحظات
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Quick feedback buttons for messages
export function QuickFeedback({ messageId }: { messageId: string }) {
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  const sendFeedback = async (type: "up" | "down") => {
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
    <div className="flex gap-1">
      <button
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          feedback === "up" && "text-green-500"
        )}
        disabled={feedback !== null}
        onClick={() => sendFeedback("up")}
        title="مفيد"
        type="button"
      >
        👍
      </button>
      <button
        className={cn(
          "p-1 rounded hover:bg-muted transition-colors",
          feedback === "down" && "text-red-500"
        )}
        disabled={feedback !== null}
        onClick={() => sendFeedback("down")}
        title="غير مفيد"
        type="button"
      >
        👎
      </button>
    </div>
  );
}
