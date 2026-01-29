import { generateText } from "ai";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getLanguageModel } from "@/lib/ai/providers";
import { db } from "@/lib/db/queries";
import {
  business,
  businessKnowledge,
  conversation,
  conversationMessage,
} from "@/lib/db/schema";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "hekmo_verify_token";
const GRAPH_API_URL = "https://graph.facebook.com/v18.0";

// Webhook verification (GET)
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

// Webhook handler (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("[WhatsApp] Webhook received:", JSON.stringify(body, null, 2));

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.[0]) {
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

    console.log(
      `[WhatsApp] Message from ${customerName} (${customerPhone}): ${messageText}`
    );

    // Find business by WhatsApp phone number ID
    const [businessRecord] = await db
      .select()
      .from(business)
      .where(eq(business.whatsappPhoneNumberId, businessPhoneNumberId))
      .limit(1);

    if (!businessRecord) {
      console.error(
        "[WhatsApp] No business found for phone number ID:",
        businessPhoneNumberId
      );
      return NextResponse.json({ status: "ok" });
    }

    // Find or create conversation
    let [conv] = await db
      .select()
      .from(conversation)
      .where(
        and(
          eq(conversation.businessId, businessRecord.id),
          eq(conversation.customerPhone, customerPhone)
        )
      )
      .limit(1);

    if (!conv) {
      [conv] = await db
        .insert(conversation)
        .values({
          businessId: businessRecord.id,
          customerPhone,
          customerName,
          customerWaId: customerPhone,
        })
        .returning();
    }

    // Check for duplicate message
    const [existingMsg] = await db
      .select()
      .from(conversationMessage)
      .where(eq(conversationMessage.waMessageId, messageId))
      .limit(1);

    if (existingMsg) {
      console.log("[WhatsApp] Duplicate message ignored:", messageId);
      return NextResponse.json({ status: "ok" });
    }

    // Store customer message
    await db.insert(conversationMessage).values({
      conversationId: conv.id,
      businessId: businessRecord.id,
      waMessageId: messageId,
      role: "customer",
      content: messageText,
    });

    // Update conversation
    await db
      .update(conversation)
      .set({
        lastMessageAt: new Date(),
        messagesCount: ((conv.messagesCount as number) || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(conversation.id, conv.id));

    // Generate AI response
    const aiResponse = await generateBusinessAIResponse(
      businessRecord,
      messageText,
      customerName,
      conv.id
    );

    // Store AI response
    await db.insert(conversationMessage).values({
      conversationId: conv.id,
      businessId: businessRecord.id,
      role: "ai",
      content: aiResponse,
    });

    // Send via WhatsApp
    await sendWhatsAppMessage({
      phoneNumberId: businessPhoneNumberId,
      to: customerPhone,
      message: aiResponse,
      accessToken:
        businessRecord.whatsappAccessToken ||
        process.env.WHATSAPP_ACCESS_TOKEN!,
    });

    // Update message count for billing
    await db
      .update(business)
      .set({
        messagesThisMonth:
          ((businessRecord.messagesThisMonth as number) || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(business.id, businessRecord.id));

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[WhatsApp] Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function generateBusinessAIResponse(
  businessRecord: typeof business.$inferSelect,
  message: string,
  customerName: string,
  conversationId: string
): Promise<string> {
  try {
    // Fetch business knowledge
    const knowledge = await db
      .select()
      .from(businessKnowledge)
      .where(eq(businessKnowledge.businessId, businessRecord.id));

    // Build knowledge context
    const knowledgeContext = knowledge
      .map((k) => `## ${k.title}\n${k.content}`)
      .join("\n\n");

    // Fetch conversation history
    const history = await db
      .select()
      .from(conversationMessage)
      .where(eq(conversationMessage.conversationId, conversationId))
      .orderBy(conversationMessage.createdAt)
      .limit(10);

    const historyContext = history
      .map((m) => `${m.role === "customer" ? "العميل" : "أنت"}: ${m.content}`)
      .join("\n");

    const systemPrompt = buildBusinessPrompt(
      businessRecord,
      knowledgeContext,
      customerName
    );

    const { text } = await generateText({
      model: getLanguageModel("chat-model"),
      system: systemPrompt,
      messages: [
        ...(historyContext
          ? [
              {
                role: "system" as const,
                content: `المحادثة السابقة:\n${historyContext}`,
              },
            ]
          : []),
        { role: "user" as const, content: message },
      ],
    });

    return text;
  } catch (error) {
    console.error("[WhatsApp] AI generation failed:", error);
    return `شكراً على رسالتك يا ${customerName}! أحد الموظفين بيرد عليك قريب إن شاء الله.`;
  }
}

function buildBusinessPrompt(
  businessRecord: typeof business.$inferSelect,
  knowledgeContext: string,
  customerName: string
): string {
  return `أنت موظف خدمة عملاء في ${businessRecord.name}. ترد على عملاء واتساب بطريقة ودية ومحترفة.

# هويتك
- اسمك: مساعد ${businessRecord.name}
- لغتك: عربي سعودي (استخدم: وش، عشان، مو، إي، يعني)
- شخصيتك: ${businessRecord.aiPersonality === "professional" ? "محترف ورسمي" : businessRecord.aiPersonality === "casual" ? "عفوي ومرح" : "ودود ومفيد"}

# معلومات النشاط
ساعات العمل: ${businessRecord.workingHours || businessRecord.workingHoursAr || "غير محدد"}
العنوان: ${businessRecord.address || "غير محدد"}
رقم التواصل: ${businessRecord.phone || "غير محدد"}

# قاعدة المعرفة
${knowledgeContext || "لا توجد معلومات إضافية"}

# قواعد مهمة
1. رد بجملتين-ثلاث فقط، مختصر ومفيد
2. لا تقول "أنا ذكاء اصطناعي" أبداً
3. لو العميل سأل سؤال ما تعرف جوابه، قل "خليني أسأل الموظف وأرد عليك"
4. استخدم إيموجي بشكل خفيف (1-2 في الرسالة)
5. اسم العميل: ${customerName}
6. لو العميل طلب موظف بشري، قل "أكيد! أحوّلك لأحد الشباب الحين"

# ممنوع
- تأكيد حجوزات بدون معلومات كاملة
- إعطاء أسعار غير موجودة في قاعدة المعرفة
- وعود ما تقدر تنفذها`;
}

async function sendWhatsAppMessage({
  phoneNumberId,
  to,
  message,
  accessToken,
}: {
  phoneNumberId: string;
  to: string;
  message: string;
  accessToken: string;
}) {
  if (!accessToken) {
    console.error("[WhatsApp] No access token");
    return;
  }

  try {
    const response = await fetch(`${GRAPH_API_URL}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { body: message },
      }),
    });

    if (response.ok) {
      console.log("[WhatsApp] Message sent to", to);
    } else {
      const error = await response.text();
      console.error("[WhatsApp] Send failed:", error);
    }
  } catch (error) {
    console.error("[WhatsApp] Send error:", error);
  }
}
