"use client";

import { useCallback, useEffect, useState } from "react";

const PINNED_CHATS_KEY = "hekmo-pinned-chats";

export function usePinnedChats() {
  const [pinnedChatIds, setPinnedChatIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(PINNED_CHATS_KEY);
    if (stored) {
      try {
        setPinnedChatIds(JSON.parse(stored));
      } catch {
        setPinnedChatIds([]);
      }
    }
  }, []);

  const savePinnedChats = useCallback((ids: string[]) => {
    localStorage.setItem(PINNED_CHATS_KEY, JSON.stringify(ids));
    setPinnedChatIds(ids);
  }, []);

  const pinChat = useCallback(
    (chatId: string) => {
      if (!pinnedChatIds.includes(chatId)) {
        const newPinned = [chatId, ...pinnedChatIds];
        savePinnedChats(newPinned);
      }
    },
    [pinnedChatIds, savePinnedChats]
  );

  const unpinChat = useCallback(
    (chatId: string) => {
      const newPinned = pinnedChatIds.filter((id) => id !== chatId);
      savePinnedChats(newPinned);
    },
    [pinnedChatIds, savePinnedChats]
  );

  const togglePin = useCallback(
    (chatId: string) => {
      if (pinnedChatIds.includes(chatId)) {
        unpinChat(chatId);
      } else {
        pinChat(chatId);
      }
    },
    [pinnedChatIds, pinChat, unpinChat]
  );

  const isPinned = useCallback(
    (chatId: string) => {
      return pinnedChatIds.includes(chatId);
    },
    [pinnedChatIds]
  );

  return {
    pinnedChatIds,
    pinChat,
    unpinChat,
    togglePin,
    isPinned,
  };
}
