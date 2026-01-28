"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypingAnimation({
  text,
  speed = 30,
  onComplete,
}: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
    onComplete?.();
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <span className="animate-pulse">▋</span>
      )}
    </span>
  );
}

// Animated dots for loading
export function LoadingDots({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="animate-[bounce_1s_infinite_0ms]">.</span>
      <span className="animate-[bounce_1s_infinite_200ms]">.</span>
      <span className="animate-[bounce_1s_infinite_400ms]">.</span>
    </span>
  );
}

// Cursor blink animation
export function BlinkingCursor() {
  return (
    <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-0.5" />
  );
}
