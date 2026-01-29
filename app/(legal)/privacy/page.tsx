import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لتطبيق حكمو - مدربك الصحي الذكي",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <article
        className="prose prose-lg dark:prose-invert mx-auto text-right"
        dir="rtl"
      >
        <h1 className="text-4xl font-bold mb-8">سياسة الخصوصية</h1>

        <p className="text-muted-foreground mb-8">
          آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">مقدمة</h2>
          <p>
            نحن في حكمو نقدر خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه
            السياسة كيفية جمع واستخدام وحماية معلوماتك.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">البيانات التي نجمعها</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>معلومات الحساب (البريد الإلكتروني، الاسم)</li>
            <li>محادثاتك مع المساعد الذكي</li>
            <li>بيانات الاستخدام والتفضيلات</li>
            <li>معلومات الجهاز والمتصفح</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">كيف نستخدم بياناتك</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>تقديم خدمات صحية مخصصة لك</li>
            <li>تحسين تجربة المستخدم</li>
            <li>إرسال تحديثات مهمة عن الخدمة</li>
            <li>تحليل وتطوير منتجاتنا</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">حماية البيانات</h2>
          <p>
            نستخدم تشفير SSL/TLS لحماية بياناتك أثناء النقل. يتم تخزين بياناتك
            في خوادم آمنة مع إجراءات حماية متقدمة.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">حقوقك</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>طلب نسخة من بياناتك</li>
            <li>تصحيح أي معلومات غير دقيقة</li>
            <li>حذف حسابك وبياناتك</li>
            <li>الاعتراض على معالجة بياناتك</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">التواصل معنا</h2>
          <p>
            لأي استفسارات حول الخصوصية، تواصل معنا على:{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:privacy@hekmo.ai"
            >
              privacy@hekmo.ai
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
