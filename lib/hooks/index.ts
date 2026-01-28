// Re-export all hooks
export { useArtifact } from "@/hooks/use-artifact";
export { useAutoResume } from "@/hooks/use-auto-resume";
export { useChatVisibility } from "@/hooks/use-chat-visibility";
export { useMessages } from "@/hooks/use-messages";
export { useMobile } from "@/hooks/use-mobile";
export { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";

// Custom hooks
export { useChatSettings } from "./use-chat-settings";
export { useChatFolders } from "@/hooks/use-chat-folders";
export {
  useLocalStorage,
  useLocalStorageBoolean,
  useLocalStorageArray,
} from "./use-local-storage";
export { useDebounce, useDebouncedCallback, useThrottledCallback } from "./use-debounce";
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsDarkMode,
  useIsReducedMotion,
  useIsTouch,
} from "./use-media-query";
export { useCopyToClipboard } from "./use-copy-to-clipboard";
