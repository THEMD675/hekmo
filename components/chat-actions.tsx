"use client";

import {
  Archive,
  Copy,
  Download,
  Edit2,
  MoreHorizontal,
  Pin,
  PinOff,
  Share2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ChatActionsProps {
  chatId: string;
  chatTitle?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onRename?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  className?: string;
}

export function ChatActions({
  chatId,
  chatTitle,
  isPinned = false,
  isArchived = false,
  onPin,
  onArchive,
  onDelete,
  onRename,
  onShare,
  onExport,
  className,
}: ChatActionsProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handlePin = () => {
    onPin?.();
    const pinned = getPinnedChats();
    if (isPinned) {
      setPinnedChats(pinned.filter((id) => id !== chatId));
      toast.success("تم إلغاء التثبيت");
    } else {
      setPinnedChats([...pinned, chatId]);
      toast.success("تم تثبيت المحادثة");
    }
    setOpen(false);
  };

  const handleArchive = () => {
    onArchive?.();
    const archived = getArchivedChats();
    if (isArchived) {
      setArchivedChats(archived.filter((id) => id !== chatId));
      toast.success("تم إلغاء الأرشفة");
    } else {
      setArchivedChats([...archived, chatId]);
      toast.success("تم أرشفة المحادثة");
    }
    setOpen(false);
  };

  const handleDelete = async () => {
    if (!confirm("هل أنت متأكد من حذف هذه المحادثة؟")) return;

    try {
      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error();

      onDelete?.();
      toast.success("تم حذف المحادثة");
      router.push("/");
    } catch {
      toast.error("فشل حذف المحادثة");
    }
    setOpen(false);
  };

  const handleDuplicate = async () => {
    try {
      const response = await fetch("/api/chat/duplicate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) throw new Error();

      const { id } = await response.json();
      toast.success("تم نسخ المحادثة");
      router.push(`/chat/${id}`);
    } catch {
      toast.error("فشل نسخ المحادثة");
    }
    setOpen(false);
  };

  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <Button
          className={cn("h-8 w-8", className)}
          size="icon"
          variant="ghost"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Pin/Unpin */}
        <DropdownMenuItem onClick={handlePin}>
          {isPinned ? (
            <>
              <PinOff className="h-4 w-4 ml-2" />
              إلغاء التثبيت
            </>
          ) : (
            <>
              <Pin className="h-4 w-4 ml-2" />
              تثبيت
            </>
          )}
        </DropdownMenuItem>

        {/* Rename */}
        <DropdownMenuItem
          onClick={() => {
            onRename?.();
            setOpen(false);
          }}
        >
          <Edit2 className="h-4 w-4 ml-2" />
          إعادة تسمية
        </DropdownMenuItem>

        {/* Archive */}
        <DropdownMenuItem onClick={handleArchive}>
          <Archive className="h-4 w-4 ml-2" />
          {isArchived ? "إلغاء الأرشفة" : "أرشفة"}
        </DropdownMenuItem>

        {/* Duplicate */}
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="h-4 w-4 ml-2" />
          نسخ
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Share */}
        <DropdownMenuItem
          onClick={() => {
            onShare?.();
            setOpen(false);
          }}
        >
          <Share2 className="h-4 w-4 ml-2" />
          مشاركة
        </DropdownMenuItem>

        {/* Export */}
        <DropdownMenuItem
          onClick={() => {
            onExport?.();
            setOpen(false);
          }}
        >
          <Download className="h-4 w-4 ml-2" />
          تصدير
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4 ml-2" />
          حذف
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Local storage helpers
const PINNED_KEY = "hekmo-pinned-chats";
const ARCHIVED_KEY = "hekmo-archived-chats";

export function getPinnedChats(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PINNED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setPinnedChats(ids: string[]) {
  localStorage.setItem(PINNED_KEY, JSON.stringify(ids));
}

export function getArchivedChats(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ARCHIVED_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setArchivedChats(ids: string[]) {
  localStorage.setItem(ARCHIVED_KEY, JSON.stringify(ids));
}
