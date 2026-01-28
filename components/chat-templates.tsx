"use client";

import {
  BookOpen,
  Briefcase,
  Calculator,
  ChefHat,
  Code,
  FileText,
  Heart,
  Languages,
  Plane,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatTemplate {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  prompt: string;
  category: "work" | "learning" | "lifestyle" | "creative";
}

const TEMPLATES: ChatTemplate[] = [
  // Work
  {
    id: "email",
    icon: <FileText className="h-5 w-5" />,
    title: "كتابة إيميل",
    description: "صياغة رسائل احترافية",
    prompt: "ساعدني في كتابة إيميل احترافي. سأخبرك بالموضوع والمستلم.",
    category: "work",
  },
  {
    id: "code-help",
    icon: <Code className="h-5 w-5" />,
    title: "مساعدة برمجية",
    description: "حل مشاكل الكود",
    prompt: "أحتاج مساعدة في البرمجة. سأشارك معك الكود والمشكلة.",
    category: "work",
  },
  {
    id: "presentation",
    icon: <Briefcase className="h-5 w-5" />,
    title: "عرض تقديمي",
    description: "إنشاء محتوى العروض",
    prompt: "ساعدني في إنشاء عرض تقديمي. ما هو الموضوع الذي تريده؟",
    category: "work",
  },

  // Learning
  {
    id: "explain",
    icon: <BookOpen className="h-5 w-5" />,
    title: "اشرح لي",
    description: "فهم مواضيع جديدة",
    prompt: "اشرح لي موضوعاً بطريقة بسيطة. ما الذي تريد فهمه؟",
    category: "learning",
  },
  {
    id: "translate",
    icon: <Languages className="h-5 w-5" />,
    title: "ترجمة",
    description: "ترجمة نصوص",
    prompt: "أريد ترجمة نص. من أي لغة وإلى أي لغة؟",
    category: "learning",
  },
  {
    id: "math",
    icon: <Calculator className="h-5 w-5" />,
    title: "حل رياضيات",
    description: "حل مسائل حسابية",
    prompt: "ساعدني في حل مسألة رياضية. ما هي المسألة؟",
    category: "learning",
  },

  // Lifestyle
  {
    id: "travel",
    icon: <Plane className="h-5 w-5" />,
    title: "تخطيط سفر",
    description: "خطط رحلتك القادمة",
    prompt: "ساعدني في التخطيط لرحلة. إلى أين تريد السفر ومتى؟",
    category: "lifestyle",
  },

  // Creative
  {
    id: "story",
    icon: <Sparkles className="h-5 w-5" />,
    title: "اكتب قصة",
    description: "قصص إبداعية",
    prompt: "اكتب لي قصة قصيرة. ما هو الموضوع الذي تريده؟",
    category: "creative",
  },
  {
    id: "image",
    icon: <Sparkles className="h-5 w-5" />,
    title: "صمم صورة",
    description: "توليد صور بالذكاء الاصطناعي",
    prompt: "أريد توليد صورة. صف لي ماذا تريد أن ترى في الصورة.",
    category: "creative",
  },
];

interface ChatTemplatesProps {
  onSelect: (prompt: string) => void;
}

export function ChatTemplates({ onSelect }: ChatTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "work", label: "عمل", icon: "💼" },
    { id: "learning", label: "تعلم", icon: "📚" },
    { id: "lifestyle", label: "حياة", icon: "✨" },
    { id: "creative", label: "إبداع", icon: "🎨" },
  ];

  const filteredTemplates = selectedCategory
    ? TEMPLATES.filter((t) => t.category === selectedCategory)
    : TEMPLATES;

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          className={cn(
            "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
            selectedCategory
              ? "bg-muted hover:bg-muted/80"
              : "bg-primary text-primary-foreground"
          )}
          onClick={() => setSelectedCategory(null)}
          type="button"
        >
          الكل
        </button>
        {categories.map((cat) => (
          <button
            className={cn(
              "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            )}
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            type="button"
          >
            <span className="ml-1">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        {filteredTemplates.map((template) => (
          <button
            className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-right"
            key={template.id}
            onClick={() => onSelect(template.prompt)}
            type="button"
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {template.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{template.title}</div>
              <div className="text-sm text-muted-foreground truncate">
                {template.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// Quick suggestions for empty chat
export function QuickSuggestions({
  onSelect,
}: {
  onSelect: (text: string) => void;
}) {
  const suggestions = [
    "اكتب لي كود بايثون",
    "ساعدني أكتب إيميل",
    "اشرح لي الذكاء الاصطناعي",
    "ترجم لي هذا النص",
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((suggestion) => (
        <Button
          className="text-sm"
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          size="sm"
          variant="outline"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
