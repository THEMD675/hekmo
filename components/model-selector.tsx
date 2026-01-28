"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, Zap, Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Model {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  tier: "free" | "pro" | "enterprise";
  provider: string;
  maxTokens: number;
  features: string[];
}

const MODELS: Model[] = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    nameAr: "جي بي تي-4 ميني",
    description: "سريع ومجاني للاستخدام اليومي",
    tier: "free",
    provider: "OpenAI",
    maxTokens: 4096,
    features: ["سريع", "اقتصادي"],
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    nameAr: "جي بي تي-4",
    description: "النموذج الأكثر ذكاءً من OpenAI",
    tier: "pro",
    provider: "OpenAI",
    maxTokens: 8192,
    features: ["ذكي جداً", "تحليل الصور"],
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    nameAr: "كلود 3.5 سونيت",
    description: "متوازن بين السرعة والذكاء",
    tier: "pro",
    provider: "Anthropic",
    maxTokens: 8192,
    features: ["كتابة ممتازة", "تحليل طويل"],
  },
  {
    id: "gemini-2-flash",
    name: "Gemini 2.0 Flash",
    nameAr: "جيميني 2 فلاش",
    description: "سريع جداً مع فهم متعدد الوسائط",
    tier: "pro",
    provider: "Google",
    maxTokens: 8192,
    features: ["سريع جداً", "متعدد اللغات"],
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onSelect: (modelId: string) => void;
  userTier?: "free" | "pro" | "enterprise";
  className?: string;
}

export function ModelSelector({
  selectedModel,
  onSelect,
  userTier = "free",
  className,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const currentModel = MODELS.find((m) => m.id === selectedModel) || MODELS[0];

  const canUseModel = (model: Model) => {
    if (userTier === "enterprise") return true;
    if (userTier === "pro") return model.tier !== "enterprise";
    return model.tier === "free";
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "free":
        return <Zap className="h-4 w-4 text-green-500" />;
      case "pro":
        return <Sparkles className="h-4 w-4 text-primary" />;
      case "enterprise":
        return <Crown className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button className={cn("gap-2", className)} variant="outline">
          {getTierIcon(currentModel.tier)}
          <span className="hidden sm:inline">{currentModel.nameAr}</span>
          <span className="sm:hidden">{currentModel.name.split(" ")[0]}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72" dir="rtl">
        <DropdownMenuLabel>اختر النموذج</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {MODELS.map((model) => {
          const available = canUseModel(model);
          const selected = model.id === selectedModel;

          return (
            <DropdownMenuItem
              className={cn(
                "flex items-start gap-3 p-3 cursor-pointer",
                !available && "opacity-50"
              )}
              disabled={!available}
              key={model.id}
              onClick={() => {
                if (available) {
                  onSelect(model.id);
                  setOpen(false);
                }
              }}
            >
              <div className="mt-0.5">{getTierIcon(model.tier)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{model.nameAr}</span>
                  {selected && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">
                  {model.description}
                </p>
                <div className="flex gap-1 mt-1">
                  {model.features.map((f) => (
                    <span
                      className="text-xs px-1.5 py-0.5 bg-muted rounded"
                      key={f}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              {!available && (
                <span className="text-xs text-primary">ترقية</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
