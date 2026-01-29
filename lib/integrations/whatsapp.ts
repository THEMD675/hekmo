// WhatsApp Integration for Hekmo
// Uses WhatsApp Business API (Cloud API)

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: { body: string };
}

interface WhatsAppWebhook {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messages?: WhatsAppMessage[];
        statuses?: Array<{ id: string; status: string }>;
      };
    }>;
  }>;
}

// Verify WhatsApp webhook
export function verifyWhatsAppWebhook(
  mode: string,
  token: string,
  challenge: string
): string | null {
  if (mode === "subscribe" && token === WHATSAPP_VERIFY_TOKEN) {
    return challenge;
  }
  return null;
}

// Send WhatsApp message
export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.error("WhatsApp credentials not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { body: text },
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("WhatsApp message error:", error);
    return false;
  }
}

// Send WhatsApp template message
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode = "ar"
): Promise<boolean> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: templateName,
            language: { code: languageCode },
          },
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("WhatsApp template error:", error);
    return false;
  }
}

// Handle incoming WhatsApp message
export async function handleWhatsAppWebhook(
  webhook: WhatsAppWebhook
): Promise<void> {
  if (webhook.object !== "whatsapp_business_account") return;

  for (const entry of webhook.entry) {
    for (const change of entry.changes) {
      const messages = change.value.messages;
      if (!messages) continue;

      for (const message of messages) {
        if (message.type === "text" && message.text) {
          await processWhatsAppMessage(message.from, message.text.body);
        }
      }
    }
  }
}

// Process WhatsApp message with Hekmo AI
async function processWhatsAppMessage(
  from: string,
  text: string
): Promise<void> {
  try {
    // Get AI response
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          model: "hekmo",
        }),
      }
    );

    let replyText = "عذراً، حدث خطأ. يرجى المحاولة لاحقاً.";

    if (response.ok) {
      const data = await response.json();
      replyText = data.content || replyText;
    }

    // Send reply
    await sendWhatsAppMessage(from, replyText);
  } catch (error) {
    console.error("WhatsApp processing error:", error);
    await sendWhatsAppMessage(from, "عذراً، الخدمة غير متاحة حالياً.");
  }
}

// Mark message as read
export async function markWhatsAppMessageRead(
  messageId: string
): Promise<void> {
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) return;

  await fetch(
    `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    }
  );
}
