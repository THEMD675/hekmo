"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NewChatButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function NewChatButton({
  variant = "default",
  size = "default",
  className,
}: NewChatButtonProps) {
  const router = useRouter();

  const handleNewChat = () => {
    router.push("/");
    router.refresh();
  };

  return (
    <Button
      className={cn(className)}
      onClick={handleNewChat}
      size={size}
      variant={variant}
    >
      <Plus className={cn("h-5 w-5", size !== "icon" && "ml-2")} />
      {size !== "icon" && "محادثة جديدة"}
    </Button>
  );
}
