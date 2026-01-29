import { generateText } from "ai";
import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { getLanguageModel } from "@/lib/ai/providers";
import { isArabic, normalizeArabic } from "@/lib/arabic-nlp";
import { db } from "@/lib/db/queries";
import { business, businessKnowledge } from "@/lib/db/schema";

// Business AI Chat - context-aware responses for businesses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, customerMessage, customerName, conversationHistory } =
      body;

    if (!businessId || !customerMessage) {
      return NextResponse.json(
        { error: "businessId and customerMessage required" },
        { status: 400 }
      );
    }

    // Normalize Arabic text for better processing
    const normalizedMessage = isArabic(customerMessage)
      ? normalizeArabic(customerMessage)
      : customerMessage;

    // Fetch business from database
    let businessRecord;
    let knowledge: (typeof businessKnowledge.$inferSelect)[] = [];

    try {
      const [foundBusiness] = await db
        .select()
        .from(business)
        .where(eq(business.id, businessId))
        .limit(1);

      if (foundBusiness) {
        businessRecord = foundBusiness;
        knowledge = await db
          .select()
          .from(businessKnowledge)
          .where(eq(businessKnowledge.businessId, businessId));
      }
    } catch (dbError) {
      console.log("[Business Chat] DB fetch failed, using fallback:", dbError);
    }

    // Build context from real data or fallback
    const businessContext = businessRecord
      ? {
          name: businessRecord.name,
          type: businessRecord.type,
          workingHours:
            businessRecord.workingHours ||
            businessRecord.workingHoursAr ||
            "غير محدد",
          phone: businessRecord.phone || "",
          address: businessRecord.address || "",
          personality: businessRecord.aiPersonality || "friendly",
          knowledgeItems: knowledge.map((k) => ({
            type: k.type,
            title: k.title,
            content: k.content,
          })),
        }
      : getFallbackContext();

    const systemPrompt = buildBusinessPrompt(businessContext, customerName);

    const { text } = await generateText({
      model: getLanguageModel("chat-model"),
      system: systemPrompt,
      messages: [
        ...(conversationHistory || []).map(
          (msg: { role: string; content: string }) => ({
            role: msg.role as "user" | "assistant",
            content: msg.content,
          })
        ),
        { role: "user" as const, content: normalizedMessage },
      ],
    });

    return NextResponse.json({
      response: text,
      businessId,
    });
  } catch (error) {
    console.error("[Business Chat] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

function getFallbackContext() {
  return {
    name: "النشاط",
    type: "other",
    workingHours: "غير محدد",
    phone: "",
    address: "",
    personality: "friendly",
    knowledgeItems: [],
  };
}

function buildBusinessPrompt(
  businessContext: {
    name: string;
    type: string;
    workingHours: string;
    phone: string;
    address: string;
    personality: string;
    knowledgeItems: { type: string; title: string; content: string }[];
  },
  customerName: string
): string {
  // Build knowledge section from actual uploaded data
  let knowledgeSection = "";
  if (businessContext.knowledgeItems.length > 0) {
    knowledgeSection = businessContext.knowledgeItems
      .map((k) => `## ${k.title}\n${k.content}`)
      .join("\n\n");
  } else {
    knowledgeSection = "لا توجد معلومات إضافية متاحة.";
  }

  const personalityMap: Record<string, string> = {
    friendly: "ودود ومفيد",
    professional: "محترف ورسمي",
    casual: "عفوي ومرح",
  };

  return `أنت موظف خدمة عملاء في ${businessContext.name}. ترد على عملاء واتساب بطريقة ودية ومحترفة.

# هويتك
- اسمك: مساعد ${businessContext.name}
- لغتك: عربي سعودي (استخدم: وش، عشان، مو، إي، يعني)
- شخصيتك: ${personalityMap[businessContext.personality] || "ودود ومفيد"}

# معلومات النشاط
- ساعات العمل: ${businessContext.workingHours}
- رقم التواصل: ${businessContext.phone || "غير محدد"}
- العنوان: ${businessContext.address || "غير محدد"}

# قاعدة المعرفة
${knowledgeSection}

# قواعد مهمة
1. رد بجملتين-ثلاث فقط، مختصر ومفيد
2. لا تقول "أنا ذكاء اصطناعي" أبداً
3. لو العميل سأل سؤال ما تعرف جوابه، قل "خليني أسأل الموظف وأرد عليك"
4. استخدم إيموجي بشكل خفيف (1-2 في الرسالة)
5. اسم العميل: ${customerName || "العميل"}
6. لو العميل طلب موظف بشري، قل "أكيد! أحوّلك لأحد الشباب الحين"

# ممنوع
- تأكيد حجوزات بدون معلومات كاملة
- إعطاء أسعار غير موجودة في قاعدة المعرفة
- وعود ما تقدر تنفذها`;
}
