"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RegenerateButtonProps {
  onClick: () => void;
  loading?: boolean;
  className?: string;
}

export function RegenerateButton({
  onClick,
  loading = false,
  className,
}: RegenerateButtonProps) {
  return (
    <Button
      className={cn("gap-2", className)}
      disabled={loading}
      onClick={onClick}
      size="sm"
      variant="ghost"
    >
      <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
      إعادة التوليد
    </Button>
  );
}
