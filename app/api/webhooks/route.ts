import { auth } from "@/app/(auth)/auth";

// Webhook configuration for integrations
// Allows external services to receive events from Hekmo

interface Webhook {
  id: string;
  url: string;
  secret: string;
  events: string[];
  active: boolean;
  createdAt: Date;
  lastTriggered: Date | null;
}

// In-memory store (use database in production)
const webhooks = new Map<string, Webhook[]>();

// Available webhook events
export const WEBHOOK_EVENTS = [
  "chat.created",
  "chat.deleted",
  "message.sent",
  "message.received",
  "subscription.created",
  "subscription.cancelled",
  "user.updated",
] as const;

type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

// Generate webhook secret
function generateSecret(): string {
  const { randomBytes } = require("node:crypto");
  return `whsec_${randomBytes(24).toString("base64url")}`;
}

// Sign webhook payload
function signPayload(payload: string, secret: string): string {
  const crypto = require("node:crypto");
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userWebhooks = webhooks.get(session.user.id) || [];

  return Response.json({
    webhooks: userWebhooks.map((w) => ({
      id: w.id,
      url: w.url,
      events: w.events,
      active: w.active,
      createdAt: w.createdAt,
      lastTriggered: w.lastTriggered,
      // Don't expose secret
    })),
    availableEvents: WEBHOOK_EVENTS,
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, events } = await request.json();

    if (!url || !URL.canParse(url)) {
      return Response.json({ error: "رابط غير صالح" }, { status: 400 });
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return Response.json(
        { error: "يجب اختيار حدث واحد على الأقل" },
        { status: 400 }
      );
    }

    // Validate events
    const validEvents = events.filter((e) => WEBHOOK_EVENTS.includes(e));
    if (validEvents.length === 0) {
      return Response.json({ error: "لا توجد أحداث صالحة" }, { status: 400 });
    }

    const userWebhooks = webhooks.get(session.user.id) || [];

    // Limit webhooks per user
    if (userWebhooks.length >= 10) {
      return Response.json(
        { error: "تم الوصول للحد الأقصى من الويب هوك (10)" },
        { status: 400 }
      );
    }

    const secret = generateSecret();
    const newWebhook: Webhook = {
      id: crypto.randomUUID(),
      url,
      secret,
      events: validEvents,
      active: true,
      createdAt: new Date(),
      lastTriggered: null,
    };

    userWebhooks.push(newWebhook);
    webhooks.set(session.user.id, userWebhooks);

    return Response.json({
      id: newWebhook.id,
      url: newWebhook.url,
      secret, // Only returned on creation
      events: newWebhook.events,
      message: "احفظ السر في مكان آمن. لن يظهر مرة أخرى.",
    });
  } catch (error) {
    console.error("Webhook creation error:", error);
    return Response.json({ error: "فشل إنشاء الويب هوك" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { webhookId } = await request.json();

    if (!webhookId) {
      return Response.json({ error: "معرف الويب هوك مطلوب" }, { status: 400 });
    }

    const userWebhooks = webhooks.get(session.user.id) || [];
    const filtered = userWebhooks.filter((w) => w.id !== webhookId);

    if (filtered.length === userWebhooks.length) {
      return Response.json({ error: "الويب هوك غير موجود" }, { status: 404 });
    }

    webhooks.set(session.user.id, filtered);

    return Response.json({ success: true, message: "تم حذف الويب هوك" });
  } catch (error) {
    console.error("Webhook deletion error:", error);
    return Response.json({ error: "فشل حذف الويب هوك" }, { status: 500 });
  }
}

// Trigger webhooks for an event (for internal use)
export async function triggerWebhooks(
  userId: string,
  event: WebhookEvent,
  payload: Record<string, unknown>
) {
  const userWebhooks = webhooks.get(userId) || [];
  const activeWebhooks = userWebhooks.filter(
    (w) => w.active && w.events.includes(event)
  );

  const results = await Promise.allSettled(
    activeWebhooks.map(async (webhook) => {
      const body = JSON.stringify({
        event,
        timestamp: new Date().toISOString(),
        data: payload,
      });

      const signature = signPayload(body, webhook.secret);

      const response = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Hekmo-Signature": signature,
          "X-Hekmo-Event": event,
        },
        body,
      });

      // Update last triggered
      webhook.lastTriggered = new Date();

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      return { webhookId: webhook.id, status: "success" };
    })
  );

  return results;
}
