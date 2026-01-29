import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط استخدام تطبيق حكمو - مدربك الصحي الذكي",
};

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-16">
      <article
        className="prose prose-lg dark:prose-invert mx-auto text-right"
        dir="rtl"
      >
        <h1 className="text-4xl font-bold mb-8">شروط الاستخدام</h1>

        <p className="text-muted-foreground mb-8">
          آخر تحديث: {new Date().toLocaleDateString("ar-SA")}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">القبول بالشروط</h2>
          <p>
            باستخدامك لتطبيق حكمو، فإنك توافق على هذه الشروط والأحكام. إذا لم
            توافق على أي جزء من هذه الشروط، يرجى عدم استخدام الخدمة.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">وصف الخدمة</h2>
          <p>
            حكمو هو مساعد صحي ذكي يقدم معلومات ونصائح صحية عامة. الخدمة لا تعتبر
            بديلاً عن الاستشارة الطبية المتخصصة.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            إخلاء المسؤولية الطبية
          </h2>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="font-semibold text-destructive">تنبيه مهم:</p>
            <p>
              المعلومات المقدمة من حكمو هي للأغراض التعليمية والمعلوماتية فقط،
              ولا تشكل نصيحة طبية. استشر طبيبك دائماً قبل اتخاذ أي قرارات صحية.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">حساب المستخدم</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>أنت مسؤول عن الحفاظ على سرية حسابك</li>
            <li>يجب أن تكون المعلومات المقدمة دقيقة</li>
            <li>يحق لنا إنهاء الحسابات التي تنتهك الشروط</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">الاستخدام المقبول</h2>
          <p>يجب عليك عدم:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>استخدام الخدمة لأغراض غير قانونية</li>
            <li>محاولة الوصول غير المصرح به للنظام</li>
            <li>إساءة استخدام أو إرهاق الخدمة</li>
            <li>نشر محتوى ضار أو مسيء</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">الملكية الفكرية</h2>
          <p>
            جميع المحتويات والعلامات التجارية والشعارات هي ملك لحكمو. لا يجوز
            نسخها أو توزيعها دون إذن كتابي.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">التعديلات</h2>
          <p>
            نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سنخطرك بأي تغييرات جوهرية
            عبر البريد الإلكتروني أو إشعار في التطبيق.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">القانون المطبق</h2>
          <p>
            تخضع هذه الشروط لقوانين المملكة العربية السعودية. أي نزاعات ستحل في
            محاكم المملكة العربية السعودية.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">التواصل معنا</h2>
          <p>
            لأي استفسارات، تواصل معنا على:{" "}
            <a
              className="text-primary hover:underline"
              href="mailto:support@hekmo.ai"
            >
              support@hekmo.ai
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
