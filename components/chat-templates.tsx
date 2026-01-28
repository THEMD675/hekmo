"use client";

import { useState } from "react";
import { 
  Sparkles, 
  FileText, 
  Code, 
  Languages, 
  Calculator,
  Heart,
  BookOpen,
  Briefcase,
  ChefHat,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatTemplate {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  prompt: string;
  category: "health" | "work" | "learning" | "lifestyle";
}

const TEMPLATES: ChatTemplate[] = [
  // Health
  {
    id: "health-checkup",
    icon: <Heart className="h-5 w-5" />,
    title: "فحص صحي يومي",
    description: "تحقق من صحتك اليومية",
    prompt: "أود إجراء فحص صحي يومي. كيف حالتي الصحية اليوم؟ اسألني عن نومي، طعامي، وتمارينني.",
    category: "health",
  },
  {
    id: "nutrition",
    icon: <ChefHat className="h-5 w-5" />,
    title: "نصائح غذائية",
    description: "وجبات صحية ونظام غذائي",
    prompt: "أريد نصائح غذائية صحية. ما هي الوجبات المناسبة لي؟",
    category: "health",
  },
  {
    id: "fitness",
    icon: <Sparkles className="h-5 w-5" />,
    title: "برنامج رياضي",
    description: "تمارين مخصصة لك",
    prompt: "ساعدني في إنشاء برنامج رياضي مناسب لي. اسألني عن أهدافي ومستوى لياقتي.",
    category: "health",
  },

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
];

interface ChatTemplatesProps {
  onSelect: (prompt: string) => void;
}

export function ChatTemplates({ onSelect }: ChatTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "health", label: "صحة", icon: "💚" },
    { id: "work", label: "عمل", icon: "💼" },
    { id: "learning", label: "تعلم", icon: "📚" },
    { id: "lifestyle", label: "حياة", icon: "✨" },
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
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
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
export function QuickSuggestions({ onSelect }: { onSelect: (text: string) => void }) {
  const suggestions = [
    "كيف أحسن نومي؟",
    "اكتب لي إيميل احترافي",
    "اشرح لي الذكاء الاصطناعي",
    "ما هي أوقات الصلاة؟",
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
