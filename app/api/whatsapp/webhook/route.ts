import { NextRequest, NextResponse } from "next/server";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "hekmo_verify_token";
const GRAPH_API_URL = "https://graph.facebook.com/v18.0";

// Webhook verification (GET) - Meta sends this to verify the webhook
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp] Webhook verified");
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse("Forbidden", { status: 403 });
}

// Webhook handler (POST) - Meta sends messages here
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log for debugging
    console.log("[WhatsApp] Webhook received:", JSON.stringify(body, null, 2));

    // Extract message data
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    
    if (!value?.messages?.[0]) {
      // Not a message event (could be status update, etc.)
      return NextResponse.json({ status: "ok" });
    }

    const message = value.messages[0];
    const contact = value.contacts?.[0];
    const metadata = value.metadata;
    
    const customerPhone = message.from;
    const customerName = contact?.profile?.name || "Customer";
    const messageText = message.text?.body || "";
    const messageId = message.id;
    const businessPhoneNumberId = metadata?.phone_number_id;

    console.log(`[WhatsApp] Message from ${customerName} (${customerPhone}): ${messageText}`);

    // TODO: Look up business by phone_number_id
    // TODO: Store message in database
    // TODO: Get AI response based on business context
    // TODO: Send reply via WhatsApp Business API

    // For now, send a placeholder response
    const aiResponse = await generateAIResponse(messageText, customerName);
    
    await sendWhatsAppMessage({
      phoneNumberId: businessPhoneNumberId,
      to: customerPhone,
      message: aiResponse,
    });

    return NextResponse.json({ status: "ok" });

  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function generateAIResponse(
  message: string, 
  customerName: string,
  businessId: string = "default"
): Promise<string> {
  try {
    // Call the business AI endpoint
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/business/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessId,
        customerMessage: message,
        customerName,
      }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error("[WhatsApp] AI generation failed:", error);
    // Fallback response
    return `شكراً على رسالتك يا ${customerName}! أحد الموظفين بيرد عليك قريب إن شاء الله.`;
  }
}

async function sendWhatsAppMessage({
  phoneNumberId,
  to,
  message,
}: {
  phoneNumberId: string;
  to: string;
  message: string;
}) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.error("[WhatsApp] No access token configured");
    return;
  }

  try {
    const response = await fetch(
      `${GRAPH_API_URL}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: to,
          type: "text",
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp] Send failed:", error);
    } else {
      console.log("[WhatsApp] Message sent to", to);
    }
  } catch (error) {
    console.error("[WhatsApp] Send error:", error);
  }
}
