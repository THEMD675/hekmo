"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { motion } from "framer-motion";
import { memo } from "react";
import { Sunrise, Activity, Moon, Pill } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { VisibilityType } from "./visibility-selector";

type SuggestedActionsProps = {
  chatId: string;
  sendMessage: UseChatHelpers<ChatMessage>["sendMessage"];
  selectedVisibilityType: VisibilityType;
};

// Health-focused suggested actions - inspired by WHOOP/Oura patterns
const SUGGESTED_ACTIONS = [
  {
    icon: Sunrise,
    title: "روتين الصباح",
    prompt: "ابني لي روتين صباحي لطاقة عالية",
    gradient: "from-amber-500 to-orange-500",
  },
  {
    icon: Activity,
    title: "تحليل الاستشفاء",
    prompt: "نسبة استشفائي ٤٢٪ — وش أغير؟",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Moon,
    title: "تحسين النوم",
    prompt: "عطني خطة لتحسين النوم العميق",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Pill,
    title: "المكملات",
    prompt: "وش أفضل مكملات للطاقة والتركيز؟",
    gradient: "from-rose-500 to-pink-500",
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
            "group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card/50 p-4 text-right transition-all",
            "hover:border-primary/30 hover:bg-card hover:shadow-sm"
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
          transition={{ delay: 0.05 * index }}
          type="button"
        >
          {/* Icon with gradient background */}
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br",
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
