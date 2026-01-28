"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function SidebarToggle({ isOpen, onToggle }: SidebarToggleProps) {
  return (
    <Button
      className="fixed top-4 right-4 z-50 md:hidden"
      onClick={onToggle}
      size="icon"
      variant="outline"
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </Button>
  );
}
