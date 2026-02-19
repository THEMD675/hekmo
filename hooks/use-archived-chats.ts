"use client";

import { useCallback, useEffect, useState } from "react";

const ARCHIVED_CHATS_KEY = "hekmo-archived-chats";

export function useArchivedChats() {
  const [archivedChatIds, setArchivedChatIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(ARCHIVED_CHATS_KEY);
    if (stored) {
      try {
        setArchivedChatIds(JSON.parse(stored));
      } catch {
        setArchivedChatIds([]);
      }
    }
  }, []);

  const saveArchivedChats = useCallback((ids: string[]) => {
    localStorage.setItem(ARCHIVED_CHATS_KEY, JSON.stringify(ids));
    setArchivedChatIds(ids);
  }, []);

  const archiveChat = useCallback(
    (chatId: string) => {
      if (!archivedChatIds.includes(chatId)) {
        const newArchived = [...archivedChatIds, chatId];
        saveArchivedChats(newArchived);
      }
    },
    [archivedChatIds, saveArchivedChats]
  );

  const unarchiveChat = useCallback(
    (chatId: string) => {
      const newArchived = archivedChatIds.filter((id) => id !== chatId);
      saveArchivedChats(newArchived);
    },
    [archivedChatIds, saveArchivedChats]
  );

  const toggleArchive = useCallback(
    (chatId: string) => {
      if (archivedChatIds.includes(chatId)) {
        unarchiveChat(chatId);
      } else {
        archiveChat(chatId);
      }
    },
    [archivedChatIds, archiveChat, unarchiveChat]
  );

  const isArchived = useCallback(
    (chatId: string) => {
      return archivedChatIds.includes(chatId);
    },
    [archivedChatIds]
  );

  return {
    archivedChatIds,
    archiveChat,
    unarchiveChat,
    toggleArchive,
    isArchived,
  };
}
