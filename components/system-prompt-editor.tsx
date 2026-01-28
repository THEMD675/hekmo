"use client";

import { RotateCcw, Save, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SystemPromptEditorProps {
  chatId?: string;
  onUpdate?: (prompt: string) => void;
}

const DEFAULT_PROMPT = `أنت حكمو، مساعد ذكي للصحة باللغة العربية. تقدم معلومات صحية موثوقة ونصائح مفيدة للمستخدمين في السعودية.

- استخدم العربية الفصحى مع فهم اللهجة السعودية
- قدم معلومات دقيقة ومحدثة
- انصح بمراجعة الطبيب في الحالات الطبية
- كن لطيفاً ومتفهماً`;

const PRESET_PROMPTS = [
  {
    id: "health",
    name: "مساعد صحي",
    prompt: DEFAULT_PROMPT,
  },
  {
    id: "concise",
    name: "إجابات مختصرة",
    prompt: "أجب بإيجاز ووضوح. استخدم نقاط عند الحاجة. لا تطيل الشرح.",
  },
  {
    id: "detailed",
    name: "شرح مفصل",
    prompt: "قدم شروحات مفصلة وشاملة. اذكر المصادر والأمثلة عند الإمكان.",
  },
  {
    id: "friendly",
    name: "ودود وغير رسمي",
    prompt: "تحدث بطريقة ودودة وغير رسمية. استخدم أسلوب المحادثة اليومية.",
  },
];

export function SystemPromptEditor({
  chatId,
  onUpdate,
}: SystemPromptEditorProps) {
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [open, setOpen] = useState(false);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    // Load saved prompt for this chat
    if (chatId) {
      const saved = localStorage.getItem(`hekmo-prompt-${chatId}`);
      if (saved) {
        setPrompt(saved);
        setModified(saved !== DEFAULT_PROMPT);
      }
    }
  }, [chatId]);

  const handleSave = () => {
    if (chatId) {
      localStorage.setItem(`hekmo-prompt-${chatId}`, prompt);
    }
    onUpdate?.(prompt);
    setModified(prompt !== DEFAULT_PROMPT);
    toast.success("تم حفظ التعليمات");
    setOpen(false);
  };

  const handleReset = () => {
    setPrompt(DEFAULT_PROMPT);
    if (chatId) {
      localStorage.removeItem(`hekmo-prompt-${chatId}`);
    }
    onUpdate?.(DEFAULT_PROMPT);
    setModified(false);
    toast.success("تم إعادة التعليمات للافتراضية");
  };

  const handlePreset = (presetPrompt: string) => {
    setPrompt(presetPrompt);
  };

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="relative"
          size="icon"
          title="تعليمات النظام"
          variant="ghost"
        >
          <Settings2 className="h-5 w-5" />
          {modified && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">تعليمات النظام</h3>
            <Button onClick={handleReset} size="sm" variant="ghost">
              <RotateCcw className="h-4 w-4 ml-1" />
              إعادة ضبط
            </Button>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {PRESET_PROMPTS.map((preset) => (
              <button
                className="px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors"
                key={preset.id}
                onClick={() => handlePreset(preset.prompt)}
                type="button"
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Editor */}
          <textarea
            className="w-full min-h-[150px] p-3 rounded-lg border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="أدخل التعليمات للذكاء الاصطناعي..."
            value={prompt}
          />

          <p className="text-xs text-muted-foreground">
            هذه التعليمات توجه سلوك الذكاء الاصطناعي في هذه المحادثة.
          </p>

          <Button className="w-full" onClick={handleSave}>
            <Save className="h-4 w-4 ml-2" />
            حفظ التعليمات
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
