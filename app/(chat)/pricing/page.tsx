"use client";

import { Building2, Check, Crown, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PricingTier {
  id: string;
  name: string;
  nameAr: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

const TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    nameAr: "مجاني",
    price: { monthly: 0, yearly: 0 },
    description: "للاستخدام الشخصي البسيط",
    icon: <Zap className="h-6 w-6" />,
    features: [
      "50 رسالة يومياً",
      "نموذج GPT-4o mini",
      "البحث في الإنترنت",
      "أوقات الصلاة",
      "الآلة الحاسبة",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    nameAr: "احترافي",
    price: { monthly: 49, yearly: 490 },
    description: "للمستخدمين النشطين",
    icon: <Crown className="h-6 w-6" />,
    highlighted: true,
    features: [
      "رسائل غير محدودة",
      "جميع النماذج (GPT-4, Claude, Gemini)",
      "توليد الصور",
      "قراءة ملفات PDF",
      "تلخيص يوتيوب",
      "الذاكرة طويلة المدى",
      "أولوية في الاستجابة",
      "دعم فني سريع",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    nameAr: "مؤسسات",
    price: { monthly: -1, yearly: -1 },
    description: "للشركات والمؤسسات",
    icon: <Building2 className="h-6 w-6" />,
    features: [
      "كل ميزات Pro",
      "API مخصص",
      "تكامل مع أنظمتكم",
      "حسابات متعددة",
      "تقارير وتحليلات",
      "دعم فني مخصص 24/7",
      "اتفاقية مستوى خدمة (SLA)",
      "تدريب الفريق",
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (tierId: string) => {
    if (tierId === "free") {
      router.push("/");
      return;
    }

    if (tierId === "enterprise") {
      window.location.href = "mailto:enterprise@hekmo.ai";
      return;
    }

    setLoading(tierId);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: tierId,
          billingInterval: billing,
        }),
      });

      if (!response.ok) {
        throw new Error();
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch {
      toast.error("حدث خطأ، يرجى المحاولة لاحقاً");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">اختر خطتك المناسبة</h1>
          <p className="text-xl text-muted-foreground mb-8">
            ابدأ مجاناً وترقى حسب احتياجاتك
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 rounded-full bg-muted">
            <button
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                billing === "monthly"
                  ? "bg-background shadow"
                  : "hover:bg-background/50"
              )}
              onClick={() => setBilling("monthly")}
              type="button"
            >
              شهري
            </button>
            <button
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                billing === "yearly"
                  ? "bg-background shadow"
                  : "hover:bg-background/50"
              )}
              onClick={() => setBilling("yearly")}
              type="button"
            >
              سنوي
              <span className="mr-1 text-xs text-primary">وفر 17%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              className={cn(
                "relative p-6 rounded-2xl border bg-card",
                tier.highlighted && "border-primary shadow-lg scale-105"
              )}
              key={tier.id}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  الأكثر شعبية
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className={cn(
                    "p-2 rounded-lg",
                    tier.highlighted
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {tier.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{tier.nameAr}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tier.description}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                {tier.price.monthly === 0 ? (
                  <div className="text-3xl font-bold">مجاني</div>
                ) : tier.price.monthly === -1 ? (
                  <div className="text-3xl font-bold">تواصل معنا</div>
                ) : (
                  <div>
                    <span className="text-3xl font-bold">
                      {billing === "monthly"
                        ? tier.price.monthly
                        : Math.round(tier.price.yearly / 12)}
                    </span>
                    <span className="text-muted-foreground mr-1">ر.س/شهر</span>
                    {billing === "yearly" && tier.price.yearly > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {tier.price.yearly} ر.س/سنة
                      </div>
                    )}
                  </div>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature, idx) => (
                  <li className="flex items-start gap-2" key={idx}>
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full"
                disabled={loading === tier.id}
                onClick={() => handleSubscribe(tier.id)}
                variant={tier.highlighted ? "default" : "outline"}
              >
                {loading === tier.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : tier.id === "free" ? (
                  "ابدأ مجاناً"
                ) : tier.id === "enterprise" ? (
                  "تواصل معنا"
                ) : (
                  "اشترك الآن"
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">أسئلة شائعة</h2>
          <div className="max-w-2xl mx-auto text-right space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">
                هل يمكنني إلغاء الاشتراك في أي وقت؟
              </h3>
              <p className="text-sm text-muted-foreground">
                نعم، يمكنك إلغاء اشتراكك في أي وقت من صفحة الإعدادات.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">ما طرق الدفع المتاحة؟</h3>
              <p className="text-sm text-muted-foreground">
                نقبل جميع البطاقات الائتمانية (Visa, Mastercard, مدى) بالإضافة
                إلى Apple Pay.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">هل هناك ضمان استرداد المال؟</h3>
              <p className="text-sm text-muted-foreground">
                نعم، نقدم ضمان استرداد المال خلال 7 أيام من الاشتراك.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
