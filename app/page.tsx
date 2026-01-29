import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Hekmo
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
          AI-powered customer service for Saudi businesses.
          <br />
          <span className="text-emerald-400">
            24/7 WhatsApp support in Arabic.
          </span>
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-lg transition"
            href="/register"
          >
            ابدأ مجاناً
          </Link>
          <Link
            className="px-8 py-4 border border-gray-600 hover:border-emerald-500 rounded-lg font-bold text-lg transition"
            href="/login"
          >
            تسجيل دخول
          </Link>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">لماذا Hekmo؟</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            description="ربط مباشر مع واتساب. الذكاء الاصطناعي يرد على عملائك في أي وقت."
            icon="💬"
            title="دعم WhatsApp 24/7"
          />
          <FeatureCard
            description="يفهم اللهجة السعودية ويرد بطريقة طبيعية. مو روبوت، صديق للعميل."
            icon="🇸🇦"
            title="عربي سعودي أصلي"
          />
          <FeatureCard
            description="ارفع قائمة الطعام، الأسعار، الأسئلة الشائعة. Hekmo يتعلم ويرد صح."
            icon="🧠"
            title="تعلّم من بياناتك"
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">الأسعار</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <PricingCard
            features={["1,000 رسالة/شهر", "رقم واتساب واحد", "دعم بالإيميل"]}
            name="Starter"
            price="499"
          />
          <PricingCard
            featured
            features={[
              "10,000 رسالة/شهر",
              "3 أرقام واتساب",
              "دعم أولوية",
              "لوحة تحكم متقدمة",
            ]}
            name="Business"
            price="1,499"
          />
          <PricingCard
            features={[
              "رسائل غير محدودة",
              "أرقام غير محدودة",
              "مدير حساب مخصص",
              "API كامل",
            ]}
            name="Enterprise"
            price="Custom"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">جاهز تبدأ؟</h2>
        <p className="text-gray-400 mb-8">
          تجربة مجانية 14 يوم. بدون بطاقة ائتمان.
        </p>
        <Link
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-lg transition inline-block"
          href="/register"
        >
          ابدأ الآن
        </Link>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-gray-800 text-center text-gray-500">
        <p>© 2026 Hekmo. Made in Saudi Arabia 🇸🇦</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function PricingCard({
  name,
  price,
  features,
  featured,
}: {
  name: string;
  price: string;
  features: string[];
  featured?: boolean;
}) {
  return (
    <div
      className={`p-6 rounded-xl border ${
        featured
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-gray-700 bg-gray-800/50"
      }`}
    >
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <div className="text-3xl font-bold mb-4">
        {price === "Custom" ? "تواصل معنا" : `${price} ر.س/شهر`}
      </div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li className="text-gray-400 flex items-center gap-2" key={i}>
            <span className="text-emerald-500">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link
        className={`block text-center py-2 rounded-lg font-bold transition ${
          featured
            ? "bg-emerald-500 hover:bg-emerald-600"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
        href="/register"
      >
        اختر الباقة
      </Link>
    </div>
  );
}
