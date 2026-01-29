import { NextRequest, NextResponse } from "next/server";
import { getLanguageModel } from "@/lib/ai/providers";
import { generateText } from "ai";

// Business AI Chat - context-aware responses for businesses
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, customerMessage, customerName, conversationHistory } = body;

    if (!businessId || !customerMessage) {
      return NextResponse.json(
        { error: "businessId and customerMessage required" },
        { status: 400 }
      );
    }

    // TODO: Fetch business context from database
    // const business = await getBusinessById(businessId);
    // const knowledge = await getBusinessKnowledge(businessId);

    // For now, mock business context
    const businessContext = {
      name: "مطعم الريف",
      type: "restaurant",
      workingHours: "9 صباحاً - 12 منتصف الليل",
      menu: `
        سندوتشات:
        - برجر لحم: 35 ر.س
        - برجر دجاج: 30 ر.س
        - شاورما لحم: 25 ر.س
        - شاورما دجاج: 22 ر.س
        
        وجبات:
        - وجبة برجر لحم (مع بطاطس ومشروب): 45 ر.س
        - وجبة شاورما (مع بطاطس ومشروب): 35 ر.س
        
        مشروبات:
        - بيبسي/كوكا: 5 ر.س
        - عصير طازج: 15 ر.س
        - قهوة عربية: 10 ر.س
      `,
      faqs: `
        - هل عندكم توصيل؟ نعم، نوصل لكل مناطق الرياض.
        - كم وقت التوصيل؟ من 30-45 دقيقة حسب الموقع.
        - هل فيه جلسات عائلية؟ نعم، عندنا قسم عائلات.
        - طرق الدفع؟ نقد، مدى، أبل باي، فيزا.
      `,
    };

    const systemPrompt = buildBusinessPrompt(businessContext, customerName);

    const { text } = await generateText({
      model: getLanguageModel("chat-model"),
      system: systemPrompt,
      messages: [
        ...(conversationHistory || []).map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: "user" as const, content: customerMessage },
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

function buildBusinessPrompt(business: any, customerName: string): string {
  return `أنت موظف خدمة عملاء في ${business.name}. ترد على عملاء واتساب بطريقة ودية ومحترفة.

# هويتك
- اسمك: مساعد ${business.name}
- لغتك: عربي سعودي (استخدم: وش، عشان، مو، إي، يعني)
- شخصيتك: ودود، سريع، مفيد

# معلومات النشاط
ساعات العمل: ${business.workingHours}

# القائمة والأسعار
${business.menu}

# الأسئلة الشائعة
${business.faqs}

# قواعد مهمة
1. رد بجملتين-ثلاث فقط، مختصر ومفيد
2. لا تقول "أنا ذكاء اصطناعي" أبداً
3. لو العميل سأل سؤال ما تعرف جوابه، قل "خليني أسأل الموظف وأرد عليك"
4. استخدم إيموجي بشكل خفيف (1-2 في الرسالة)
5. اسم العميل: ${customerName || "العميل"}
6. لو العميل طلب موظف بشري، قل "أكيد! أحوّلك لأحد الشباب الحين"

# ممنوع
- تأكيد حجوزات بدون معلومات كاملة (التاريخ، الوقت، عدد الأشخاص، الاسم)
- إعطاء أسعار غير موجودة في القائمة
- وعود ما تقدر تنفذها`;
}
