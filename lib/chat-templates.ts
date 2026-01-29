// Chat templates for common business queries

export interface ChatTemplate {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  category: "customer-service" | "sales" | "operations" | "marketing" | "general";
  prompt: string;
  promptAr: string;
}

export const chatTemplates: ChatTemplate[] = [
  // Customer Service
  {
    id: "customer-inquiry",
    title: "Customer Inquiry",
    titleAr: "استفسار عميل",
    description: "Handle common customer questions",
    descriptionAr: "التعامل مع أسئلة العملاء الشائعة",
    icon: "💬",
    category: "customer-service",
    prompt: "A customer is asking about [product/service]. They want to know [details]. Respond professionally in Arabic.",
    promptAr: "عميل يسأل عن [المنتج/الخدمة]. يريد معرفة [التفاصيل]. رد بشكل احترافي.",
  },
  {
    id: "complaint-handling",
    title: "Complaint Handling",
    titleAr: "معالجة الشكاوى",
    description: "Respond to customer complaints",
    descriptionAr: "الرد على شكاوى العملاء",
    icon: "🛠️",
    category: "customer-service",
    prompt: "A customer is complaining about [issue]. Help me respond professionally and offer a solution.",
    promptAr: "عميل يشتكي من [المشكلة]. ساعدني في الرد باحترافية وتقديم حل.",
  },
  
  // Sales
  {
    id: "product-info",
    title: "Product Information",
    titleAr: "معلومات المنتج",
    description: "Share product details with customers",
    descriptionAr: "مشاركة تفاصيل المنتج مع العملاء",
    icon: "📦",
    category: "sales",
    prompt: "Customer wants details about [product]. Include price, features, and availability.",
    promptAr: "العميل يريد تفاصيل عن [المنتج]. أضف السعر والمميزات والتوفر.",
  },
  {
    id: "price-quote",
    title: "Price Quote",
    titleAr: "عرض سعر",
    description: "Generate a price quote",
    descriptionAr: "إنشاء عرض سعر",
    icon: "💰",
    category: "sales",
    prompt: "Create a price quote for [items/services]. The customer is [customer name].",
    promptAr: "أنشئ عرض سعر لـ [المنتجات/الخدمات]. العميل هو [اسم العميل].",
  },
  
  // Operations
  {
    id: "business-hours",
    title: "Business Hours",
    titleAr: "ساعات العمل",
    description: "Share operating hours",
    descriptionAr: "مشاركة ساعات العمل",
    icon: "🕐",
    category: "operations",
    prompt: "Tell customer about our business hours, location, and how to reach us.",
    promptAr: "أخبر العميل عن ساعات العمل والموقع وطرق التواصل معنا.",
  },
  {
    id: "order-status",
    title: "Order Status",
    titleAr: "حالة الطلب",
    description: "Update customer on their order",
    descriptionAr: "تحديث العميل عن طلبه",
    icon: "📋",
    category: "operations",
    prompt: "Customer asking about order #[order_number]. Current status is [status]. Expected delivery [date].",
    promptAr: "العميل يسأل عن الطلب رقم #[رقم_الطلب]. الحالة الحالية [الحالة]. التوصيل المتوقع [التاريخ].",
  },
  
  // Marketing
  {
    id: "promotion-announce",
    title: "Promotion Announcement",
    titleAr: "إعلان عرض",
    description: "Share promotions and discounts",
    descriptionAr: "مشاركة العروض والخصومات",
    icon: "🎉",
    category: "marketing",
    prompt: "Create an announcement for our [discount]% off sale on [products]. Valid until [date].",
    promptAr: "أنشئ إعلان لعرض خصم [النسبة]% على [المنتجات]. ساري حتى [التاريخ].",
  },
  {
    id: "new-product-launch",
    title: "New Product Launch",
    titleAr: "إطلاق منتج جديد",
    description: "Announce new products",
    descriptionAr: "الإعلان عن منتجات جديدة",
    icon: "🚀",
    category: "marketing",
    prompt: "We're launching [product]. Key features: [features]. Price: [price]. Create an exciting announcement.",
    promptAr: "نحن نطلق [المنتج]. المميزات: [المميزات]. السعر: [السعر]. أنشئ إعلان مثير.",
  },
  
  // General
  {
    id: "thank-you",
    title: "Thank You Message",
    titleAr: "رسالة شكر",
    description: "Thank customers for their purchase",
    descriptionAr: "شكر العملاء على الشراء",
    icon: "🙏",
    category: "general",
    prompt: "Create a thank you message for a customer who just purchased [product/service].",
    promptAr: "أنشئ رسالة شكر لعميل اشترى للتو [المنتج/الخدمة].",
  },
  {
    id: "appointment-confirm",
    title: "Appointment Confirmation",
    titleAr: "تأكيد موعد",
    description: "Confirm customer appointments",
    descriptionAr: "تأكيد مواعيد العملاء",
    icon: "📅",
    category: "general",
    prompt: "Confirm appointment for [customer] on [date] at [time] for [service].",
    promptAr: "أكد الموعد لـ [العميل] في [التاريخ] الساعة [الوقت] لـ [الخدمة].",
  },
  {
    id: "follow-up",
    title: "Customer Follow-up",
    titleAr: "متابعة العميل",
    description: "Follow up with past customers",
    descriptionAr: "متابعة العملاء السابقين",
    icon: "📞",
    category: "general",
    prompt: "Create a follow-up message for [customer] who purchased [product] on [date]. Ask about their experience.",
    promptAr: "أنشئ رسالة متابعة لـ [العميل] الذي اشترى [المنتج] في [التاريخ]. اسأل عن تجربته.",
  },
];

export const templatesByCategory = chatTemplates.reduce(
  (acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  },
  {} as Record<string, ChatTemplate[]>
);

export function getTemplateById(id: string): ChatTemplate | undefined {
  return chatTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: string): ChatTemplate[] {
  return chatTemplates.filter((t) => t.category === category);
}
