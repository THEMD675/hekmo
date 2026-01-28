"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SuggestedMessagesProps {
  suggestions: string[];
  onSelect: (message: string) => void;
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  "اكتب لي كود بايثون",
  "ساعدني أكتب إيميل",
  "اشرح لي الذكاء الاصطناعي",
  "ترجم لي هذا النص",
];

export function SuggestedMessages({
  suggestions = DEFAULT_SUGGESTIONS,
  onSelect,
  className,
}: SuggestedMessagesProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
      {suggestions.map((suggestion, idx) => (
        <Button
          className="text-sm"
          key={idx}
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
