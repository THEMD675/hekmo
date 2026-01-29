"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { Code, FileText, Lightbulb, PenTool } from "lucide-react";
import { memo } from "react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
};

// General-purpose suggested actions - inspired by ChatGPT/Claude
const SUGGESTED_ACTIONS = [
  {
    icon: Code,
    title: "اكتب كود",
    prompt: "اكتب لي كود بايثون لتحليل البيانات",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: PenTool,
    title: "ساعدني أكتب",
    prompt: "ساعدني أكتب إيميل احترافي",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Lightbulb,
    title: "اشرح لي",
    prompt: "اشرح لي الذكاء الاصطناعي بطريقة بسيطة",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: FileText,
    title: "لخص محتوى",
    prompt: "لخص لي هذا المقال في نقاط رئيسية",
    gradient: "from-cyan-500 to-blue-500",
  },
];

function PureSuggestedActions({ chatId, sendMessage }: SuggestedActionsProps) {
  return (
    <div
      className="grid w-full gap-3 sm:grid-cols-2"
      data-testid="suggested-actions"
    >
      {SUGGESTED_ACTIONS.map((action, index) => (
        <motion.button
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            // Material 3 Elevated Card pattern
            "group relative flex items-center gap-3 rounded-2xl bg-card p-4 text-right",
            "shadow-[var(--elevation-1)] transition-all duration-200",
            "hover:shadow-[var(--elevation-2)] hover:scale-[1.01]",
            "active:scale-[0.99]"
          )}
          exit={{ opacity: 0, y: 20 }}
          initial={{ opacity: 0, y: 20 }}
          key={action.prompt}
          onClick={() => {
            window.history.pushState({}, "", `/chat/${chatId}`);
            sendMessage({
              role: "user",
              parts: [{ type: "text", text: action.prompt }],
            });
          }}
          transition={{ delay: 0.05 * index, duration: 0.2 }}
          type="button"
        >
          {/* Icon with gradient background */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm",
              action.gradient
            )}
          >
            <action.icon className="h-5 w-5 text-white" />
          </div>

          {/* Text content */}
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-sm font-medium text-foreground">
              {action.title}
            </span>
            <span className="text-xs text-muted-foreground line-clamp-1">
              {action.prompt}
            </span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(
  PureSuggestedActions,
  (prevProps, nextProps) => {
    if (prevProps.chatId !== nextProps.chatId) {
      return false;
    }
    if (prevProps.selectedVisibilityType !== nextProps.selectedVisibilityType) {
      return false;
    }

    return true;
  }
);
