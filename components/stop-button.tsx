"use client";

import { Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StopButtonProps {
  onClick: () => void;
  className?: string;
}

export function StopButton({ onClick, className }: StopButtonProps) {
  return (
    <Button
      className={cn("gap-2 bg-destructive hover:bg-destructive/90", className)}
      onClick={onClick}
      size="sm"
    >
      <Square className="h-4 w-4 fill-current" />
      إيقاف
    </Button>
  );
}
