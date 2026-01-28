"use client";

import { MessageSquare, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Chat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

interface ChatSearchProps {
  className?: string;
}

export function ChatSearch({ className }: ChatSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Chat[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const searchChats = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `/api/history/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data.chats || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query) {
        searchChats(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchChats]);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "f" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(true);
        const input = document.querySelector(
          "[data-search-input]"
        ) as HTMLInputElement;
        input?.focus();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  if (!isOpen) {
    return (
      <Button
        className={cn(
          "w-full justify-start gap-2 text-muted-foreground",
          className
        )}
        onClick={() => setIsOpen(true)}
        variant="ghost"
      >
        <Search className="h-4 w-4" />
        <span className="text-sm">البحث في المحادثات...</span>
        <kbd className="mr-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>F
        </kbd>
      </Button>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          className="pr-9 pl-9"
          data-search-input
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث في المحادثات..."
          value={query}
        />
        <Button
          className="absolute left-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
          onClick={() => {
            setIsOpen(false);
            setQuery("");
            setResults([]);
          }}
          size="icon"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {(results.length > 0 || isSearching) && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-md border bg-popover p-1 shadow-lg">
          {isSearching ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              جاري البحث...
            </div>
          ) : results.length > 0 ? (
            results.map((chat) => (
              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm hover:bg-accent text-right"
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                type="button"
              >
                <MessageSquare className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{chat.title || "محادثة جديدة"}</span>
              </button>
            ))
          ) : query ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              لم يتم العثور على نتائج
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
