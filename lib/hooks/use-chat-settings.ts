"use client";

import { useCallback, useEffect, useState } from "react";

interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
}

const DEFAULT_SETTINGS: ChatSettings = {
  model: "gpt-4o-mini",
  temperature: 0.7,
  maxTokens: 4096,
  topP: 1,
  systemPrompt: "",
};

const STORAGE_KEY = "hekmo-chat-settings";

export function useChatSettings(chatId?: string) {
  const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // Load settings
  useEffect(() => {
    const key = chatId ? `${STORAGE_KEY}-${chatId}` : STORAGE_KEY;
    const stored = localStorage.getItem(key);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
    setLoaded(true);
  }, [chatId]);

  // Save settings
  const updateSettings = useCallback(
    (updates: Partial<ChatSettings>) => {
      setSettings((prev) => {
        const newSettings = { ...prev, ...updates };
        const key = chatId ? `${STORAGE_KEY}-${chatId}` : STORAGE_KEY;
        localStorage.setItem(key, JSON.stringify(newSettings));
        return newSettings;
      });
    },
    [chatId]
  );

  // Reset to defaults
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    const key = chatId ? `${STORAGE_KEY}-${chatId}` : STORAGE_KEY;
    localStorage.removeItem(key);
  }, [chatId]);

  return {
    settings,
    updateSettings,
    resetSettings,
    loaded,
  };
}
