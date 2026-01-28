"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Pin, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatChatDate } from "@/lib/utils/date";
import { getPinnedChats, getArchivedChats } from "@/components/chat-actions";

interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt?: Date;
}

interface ChatListProps {
  chats: Chat[];
  className?: string;
}

export function ChatList({ chats, className }: ChatListProps) {
  const pathname = usePathname();
  const pinnedIds = getPinnedChats();
  const archivedIds = getArchivedChats();

  // Separate chats
  const pinned = chats.filter((c) => pinnedIds.includes(c.id));
  const archived = chats.filter((c) => archivedIds.includes(c.id));
  const regular = chats.filter(
    (c) => !pinnedIds.includes(c.id) && !archivedIds.includes(c.id)
  );

  // Group by date
  const groupByDate = (chatList: Chat[]) => {
    const groups: Record<string, Chat[]> = {};

    for (const chat of chatList) {
      const date = chat.updatedAt || chat.createdAt;
      const key = formatChatDate(date);

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(chat);
    }

    return groups;
  };

  const regularGroups = groupByDate(regular);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Pinned */}
      {pinned.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <Pin className="h-3 w-3" />
            مثبت
          </div>
          {pinned.map((chat) => (
            <ChatItem
              chat={chat}
              isActive={pathname === `/chat/${chat.id}`}
              isPinned
              key={chat.id}
            />
          ))}
        </div>
      )}

      {/* Regular (grouped by date) */}
      {Object.entries(regularGroups).map(([date, chatGroup]) => (
        <div className="space-y-1" key={date}>
          <div className="px-2 text-xs text-muted-foreground">{date}</div>
          {chatGroup.map((chat) => (
            <ChatItem
              chat={chat}
              isActive={pathname === `/chat/${chat.id}`}
              key={chat.id}
            />
          ))}
        </div>
      ))}

      {/* Archived */}
      {archived.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <Archive className="h-3 w-3" />
            مؤرشف
          </div>
          {archived.map((chat) => (
            <ChatItem
              chat={chat}
              isActive={pathname === `/chat/${chat.id}`}
              isArchived
              key={chat.id}
            />
          ))}
        </div>
      )}

      {chats.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          لا توجد محادثات
        </div>
      )}
    </div>
  );
}

interface ChatItemProps {
  chat: Chat;
  isActive?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
}

function ChatItem({ chat, isActive, isPinned, isArchived }: ChatItemProps) {
  return (
    <Link
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "hover:bg-muted text-foreground",
        isArchived && "opacity-60"
      )}
      href={`/chat/${chat.id}`}
    >
      <MessageSquare className="h-4 w-4 flex-shrink-0" />
      <span className="flex-1 truncate text-sm">{chat.title}</span>
      {isPinned && <Pin className="h-3 w-3 text-muted-foreground" />}
    </Link>
  );
}
