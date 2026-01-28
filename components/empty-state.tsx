"use client";

import { Folder, History, MessageSquare, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  type: "chat" | "search" | "folder" | "history";
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EMPTY_STATES = {
  chat: {
    icon: <MessageSquare className="h-12 w-12" />,
    title: "ابدأ محادثة جديدة",
    description: "اسأل حكمو أي سؤال وسيساعدك بأفضل ما لديه",
  },
  search: {
    icon: <Search className="h-12 w-12" />,
    title: "لا توجد نتائج",
    description: "جرب البحث بكلمات مختلفة",
  },
  folder: {
    icon: <Folder className="h-12 w-12" />,
    title: "المجلد فارغ",
    description: "أضف محادثات لهذا المجلد لتنظيمها",
  },
  history: {
    icon: <History className="h-12 w-12" />,
    title: "لا توجد محادثات سابقة",
    description: "ستظهر محادثاتك هنا بعد إنشائها",
  },
};

export function EmptyState({
  type,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const state = EMPTY_STATES[type];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 min-h-[300px]",
        className
      )}
    >
      <div className="text-muted-foreground mb-4">{state.icon}</div>
      <h3 className="text-lg font-medium mb-2">{title || state.title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {description || state.description}
      </p>
      {action && (
        <Button onClick={action.onClick}>
          <Sparkles className="h-4 w-4 ml-2" />
          {action.label}
        </Button>
      )}
    </div>
  );
}

// Welcome screen for new users
export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[60vh]">
      <div className="text-6xl mb-6">🧠</div>
      <h1 className="text-3xl font-bold mb-4">مرحباً بك في حكمو</h1>
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        مساعدك الذكي للصحة باللغة العربية. اسألني عن أي موضوع صحي وسأقدم لك
        معلومات موثوقة ونصائح مفيدة.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
          <span>💬</span> محادثات ذكية
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
          <span>🎤</span> إدخال صوتي
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
          <span>🔧</span> أدوات متقدمة
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-sm">
          <span>🇸🇦</span> عربي بالكامل
        </div>
      </div>
      <Button onClick={onStart} size="lg">
        <Sparkles className="h-5 w-5 ml-2" />
        ابدأ الآن
      </Button>
    </div>
  );
}
