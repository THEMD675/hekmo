"use client";

import { useState, useEffect, useCallback } from "react";

const FOLDERS_KEY = "hekmo-chat-folders";

export interface ChatFolder {
  id: string;
  name: string;
  color: string;
  chatIds: string[];
  createdAt: Date;
}

const DEFAULT_COLORS = [
  "#ef4444", // red
  "#f97316", // orange
  "#eab308", // yellow
  "#22c55e", // green
  "#3b82f6", // blue
  "#8b5cf6", // purple
  "#ec4899", // pink
];

export function useChatFolders() {
  const [folders, setFolders] = useState<ChatFolder[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load folders from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FOLDERS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFolders(parsed.map((f: ChatFolder) => ({
          ...f,
          createdAt: new Date(f.createdAt),
        })));
      } catch {
        setFolders([]);
      }
    }
    setLoaded(true);
  }, []);

  // Save folders to localStorage
  const saveFolders = useCallback((newFolders: ChatFolder[]) => {
    localStorage.setItem(FOLDERS_KEY, JSON.stringify(newFolders));
    setFolders(newFolders);
  }, []);

  // Create a new folder
  const createFolder = useCallback((name: string, color?: string) => {
    const newFolder: ChatFolder = {
      id: crypto.randomUUID(),
      name,
      color: color || DEFAULT_COLORS[folders.length % DEFAULT_COLORS.length],
      chatIds: [],
      createdAt: new Date(),
    };
    saveFolders([...folders, newFolder]);
    return newFolder;
  }, [folders, saveFolders]);

  // Delete a folder
  const deleteFolder = useCallback((folderId: string) => {
    saveFolders(folders.filter((f) => f.id !== folderId));
  }, [folders, saveFolders]);

  // Rename a folder
  const renameFolder = useCallback((folderId: string, newName: string) => {
    saveFolders(
      folders.map((f) =>
        f.id === folderId ? { ...f, name: newName } : f
      )
    );
  }, [folders, saveFolders]);

  // Add chat to folder
  const addChatToFolder = useCallback((chatId: string, folderId: string) => {
    saveFolders(
      folders.map((f) =>
        f.id === folderId && !f.chatIds.includes(chatId)
          ? { ...f, chatIds: [...f.chatIds, chatId] }
          : f
      )
    );
  }, [folders, saveFolders]);

  // Remove chat from folder
  const removeChatFromFolder = useCallback((chatId: string, folderId: string) => {
    saveFolders(
      folders.map((f) =>
        f.id === folderId
          ? { ...f, chatIds: f.chatIds.filter((id) => id !== chatId) }
          : f
      )
    );
  }, [folders, saveFolders]);

  // Get folder for a chat
  const getFolderForChat = useCallback((chatId: string) => {
    return folders.find((f) => f.chatIds.includes(chatId));
  }, [folders]);

  // Move chat between folders
  const moveChatToFolder = useCallback((chatId: string, toFolderId: string | null) => {
    saveFolders(
      folders.map((f) => ({
        ...f,
        chatIds: toFolderId === f.id
          ? [...f.chatIds.filter((id) => id !== chatId), chatId]
          : f.chatIds.filter((id) => id !== chatId),
      }))
    );
  }, [folders, saveFolders]);

  return {
    folders,
    loaded,
    createFolder,
    deleteFolder,
    renameFolder,
    addChatToFolder,
    removeChatFromFolder,
    getFolderForChat,
    moveChatToFolder,
    defaultColors: DEFAULT_COLORS,
  };
}
