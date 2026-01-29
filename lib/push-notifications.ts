// Push Notification service for Hekmo PWA
// Uses Web Push API for sending notifications

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported() || !VAPID_PUBLIC_KEY) {
    console.warn("Push notifications not supported or VAPID key missing");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check existing subscription
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
    }

    // Send subscription to server
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    return subscription;
  } catch (error) {
    console.error("Push subscription failed:", error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      // Notify server of unsubscription
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });

      await subscription.unsubscribe();
    }

    return true;
  } catch (error) {
    console.error("Push unsubscription failed:", error);
    return false;
  }
}

// Get current subscription status
export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    return registration.pushManager.getSubscription();
  } catch {
    return null;
  }
}

// Show local notification (for testing)
export function showLocalNotification(
  title: string,
  options?: NotificationOptions
): void {
  if (!isPushSupported() || Notification.permission !== "granted") {
    return;
  }

  new Notification(title, {
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    dir: "rtl",
    lang: "ar",
    ...options,
  });
}

// Utility to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Notification types for Hekmo
export interface HekmoNotification {
  type: "chat" | "reminder" | "update" | "alert";
  title: string;
  body: string;
  data?: {
    chatId?: string;
    action?: string;
    url?: string;
  };
}

// Create notification based on type
export function createHekmoNotification(notification: HekmoNotification): void {
  const options: NotificationOptions = {
    body: notification.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: notification.type,
    dir: "rtl",
    lang: "ar",
    data: notification.data,
  };

  switch (notification.type) {
    case "chat":
      options.requireInteraction = false;
      options.silent = false;
      break;
    case "reminder":
      options.requireInteraction = true;
      (options as NotificationOptions & { vibrate?: number[] }).vibrate = [
        200, 100, 200,
      ];
      break;
    case "alert":
      options.requireInteraction = true;
      (options as NotificationOptions & { vibrate?: number[] }).vibrate = [
        200, 100, 200, 100, 200,
      ];
      break;
    default:
      break;
  }

  showLocalNotification(notification.title, options);
}
