import {
  handleWhatsAppWebhook,
  verifyWhatsAppWebhook,
} from "@/lib/integrations/whatsapp";

// Webhook verification
export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode") || "";
  const token = url.searchParams.get("hub.verify_token") || "";
  const challenge = url.searchParams.get("hub.challenge") || "";

  const result = verifyWhatsAppWebhook(mode, token, challenge);

  if (result) {
    return new Response(result, { status: 200 });
  }

  return Response.json({ error: "Verification failed" }, { status: 403 });
}

// Webhook handler
export async function POST(request: Request) {
  try {
    const webhook = await request.json();
    await handleWhatsAppWebhook(webhook);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("WhatsApp webhook error:", error);
    return Response.json({ error: "Failed to process" }, { status: 500 });
  }
}
