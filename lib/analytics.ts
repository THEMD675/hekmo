import posthog from "posthog-js";

// Initialize PostHog (call once on app load)
export function initAnalytics() {
  if (typeof window === "undefined") return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  if (!key) {
    console.warn("[Analytics] PostHog API key not configured");
    return;
  }

  posthog.init(key, {
    api_host: "https://app.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    persistence: "localStorage",
    autocapture: false, // We'll track manually
  });
}

// Track custom events
export function trackEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  // Check if PostHog is initialized
  if (typeof posthog?.capture === "function") {
    posthog.capture(eventName, properties);
  }

  // Also log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[Analytics]", eventName, properties);
  }
}

// Identify user
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  if (typeof posthog?.identify === "function") {
    posthog.identify(userId, traits);
  }
}

// Reset user (on logout)
export function resetUser() {
  if (typeof window === "undefined") return;

  if (typeof posthog?.reset === "function") {
    posthog.reset();
  }
}

// Pre-defined event types
export const Events = {
  // Chat
  CHAT_STARTED: "chat_started",
  MESSAGE_SENT: "message_sent",
  MESSAGE_RECEIVED: "message_received",
  CHAT_EXPORTED: "chat_exported",
  CHAT_SHARED: "chat_shared",

  // Voice
  VOICE_INPUT_STARTED: "voice_input_started",
  VOICE_INPUT_COMPLETED: "voice_input_completed",
  VOICE_OUTPUT_PLAYED: "voice_output_played",

  // Tools
  TOOL_USED: "tool_used",
  SEARCH_PERFORMED: "search_performed",

  // Auth
  USER_SIGNED_UP: "user_signed_up",
  USER_LOGGED_IN: "user_logged_in",
  USER_LOGGED_OUT: "user_logged_out",

  // Subscription
  SUBSCRIPTION_STARTED: "subscription_started",
  SUBSCRIPTION_CANCELLED: "subscription_cancelled",
  UPGRADE_CLICKED: "upgrade_clicked",

  // UI
  THEME_CHANGED: "theme_changed",
  LANGUAGE_CHANGED: "language_changed",
  SHORTCUT_USED: "shortcut_used",

  // Errors
  ERROR_OCCURRED: "error_occurred",
  API_ERROR: "api_error",

  // PWA
  PWA_INSTALLED: "pwa_installed",
  PUSH_SUBSCRIBED: "push_subscribed",
} as const;

// Track page views manually
export function trackPageView(path: string) {
  trackEvent("$pageview", { $current_url: path });
}

// Track feature usage
export function trackFeature(feature: string, variant?: string) {
  trackEvent("feature_used", { feature, variant });
}

// Track errors
export function trackError(error: Error, context?: Record<string, unknown>) {
  trackEvent(Events.ERROR_OCCURRED, {
    error_name: error.name,
    error_message: error.message,
    ...context,
  });
}

// Time tracking for performance
const timers: Record<string, number> = {};

export function startTimer(name: string) {
  timers[name] = performance.now();
}

export function endTimer(name: string, properties?: Record<string, unknown>) {
  const start = timers[name];
  if (!start) return;

  const duration = performance.now() - start;
  delete timers[name];

  trackEvent("timing", {
    name,
    duration_ms: Math.round(duration),
    ...properties,
  });

  return duration;
}
