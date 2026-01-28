"use client";

import { useEffect, useState } from "react";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ["⌘", "K"], description: "فتح لوحة الأوامر", category: "تنقل" },
  { keys: ["⌘", "N"], description: "محادثة جديدة", category: "تنقل" },
  { keys: ["⌘", "B"], description: "إظهار/إخفاء الشريط الجانبي", category: "تنقل" },
  { keys: ["⌘", ","], description: "فتح الإعدادات", category: "تنقل" },
  { keys: ["Esc"], description: "إغلاق النافذة المنبثقة", category: "تنقل" },

  // Chat
  { keys: ["Enter"], description: "إرسال الرسالة", category: "محادثة" },
  { keys: ["Shift", "Enter"], description: "سطر جديد", category: "محادثة" },
  { keys: ["⌘", "↑"], description: "تعديل آخر رسالة", category: "محادثة" },
  { keys: ["⌘", "C"], description: "نسخ الرد", category: "محادثة" },
  { keys: ["⌘", "R"], description: "إعادة توليد الرد", category: "محادثة" },

  // Voice
  { keys: ["⌘", "M"], description: "تشغيل/إيقاف الميكروفون", category: "صوت" },
  { keys: ["Space"], description: "إيقاف/تشغيل القراءة", category: "صوت" },

  // Actions
  { keys: ["⌘", "S"], description: "حفظ المحادثة", category: "إجراءات" },
  { keys: ["⌘", "E"], description: "تصدير المحادثة", category: "إجراءات" },
  { keys: ["⌘", "D"], description: "تكرار المحادثة", category: "إجراءات" },
  { keys: ["⌘", "Delete"], description: "حذف المحادثة", category: "إجراءات" },
];

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  // Global keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show shortcuts dialog with ?
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const categories = [...new Set(SHORTCUTS.map((s) => s.category))];

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            اختصارات لوحة المفاتيح
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {SHORTCUTS.filter((s) => s.category === category).map(
                  (shortcut, idx) => (
                    <div
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted"
                      key={idx}
                    >
                      <span className="text-sm">{shortcut.description}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, keyIdx) => (
                          <kbd
                            className="px-2 py-1 text-xs font-medium bg-muted rounded border"
                            key={keyIdx}
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          اضغط <kbd className="px-1 py-0.5 bg-muted rounded">⌘</kbd> +{" "}
          <kbd className="px-1 py-0.5 bg-muted rounded">?</kbd> لفتح هذه القائمة
        </p>
      </DialogContent>
    </Dialog>
  );
}

// Hook for registering shortcuts
export function useKeyboardShortcut(
  keys: string[],
  callback: () => void,
  options: { preventDefault?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const modifiers = {
        meta: e.metaKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        shift: e.shiftKey,
      };

      const keyMatch = keys.every((key) => {
        if (key === "⌘" || key === "cmd") return modifiers.meta || modifiers.ctrl;
        if (key === "shift") return modifiers.shift;
        if (key === "alt") return modifiers.alt;
        return e.key.toLowerCase() === key.toLowerCase();
      });

      if (keyMatch) {
        if (options.preventDefault) e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [keys, callback, options.preventDefault]);
}
