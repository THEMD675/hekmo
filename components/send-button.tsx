"use client";

import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SendButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SendButton({
  disabled = false,
  loading = false,
  onClick,
  className,
}: SendButtonProps) {
  return (
    <Button
      className={cn(
        "rounded-full h-10 w-10 p-0",
        disabled && "opacity-50",
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      size="icon"
      type="submit"
    >
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ArrowUp className="h-5 w-5" />
      )}
    </Button>
  );
}
