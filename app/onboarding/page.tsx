"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "business" | "whatsapp" | "knowledge" | "done";

interface BusinessData {
  id?: string;
  name: string;
  nameAr?: string;
  type: string;
  workingHours?: string;
  phone?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("business");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  
  // Form state
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [workingHours, setWorkingHours] = useState("");
  const [phone, setPhone] = useState("");
  
  // Knowledge state
  const [knowledgeItems, setKnowledgeItems] = useState<{ type: string; title: string; content: string }[]>([]);

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/business/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: businessName,
          nameAr: businessName,
          type: businessType,
          workingHours,
          workingHoursAr: workingHours,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If auth required, redirect to login
        if (response.status === 401) {
          window.location.href = `/api/auth/guest?redirectUrl=${encodeURIComponent(window.location.href)}`;
          return;
        }
        throw new Error(data.error || "فشل إنشاء النشاط");
      }

      setBusiness(data.business);
      // Store business ID in localStorage for dashboard
      localStorage.setItem("hekmo_business_id", data.business.id);
      setStep("whatsapp");
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppConnect = async () => {
    if (!business?.id) {
      setError("يرجى إنشاء النشاط أولاً");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if WhatsApp is configured
      const response = await fetch(`/api/whatsapp/connect?businessId=${business.id}`);
      
      if (response.status === 503) {
        // WhatsApp not configured - skip for now
        setStep("knowledge");
        return;
      }

      if (response.redirected) {
        // Redirect to Meta OAuth
        window.location.href = response.url;
        return;
      }

      const data = await response.json();
      if (data.error) {
        // Not configured, skip step
        setStep("knowledge");
      }
    } catch (err) {
      console.error("WhatsApp connect error:", err);
      // Skip step on error
      setStep("knowledge");
    } finally {
      setLoading(false);
    }
  };

  const handleKnowledgeSubmit = async () => {
    if (!business?.id || knowledgeItems.length === 0) {
      setStep("done");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Upload each knowledge item
      for (const item of knowledgeItems) {
        const response = await fetch("/api/business/knowledge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessId: business.id,
            type: item.type,
            title: item.title,
            content: item.content,
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "فشل رفع المعلومات");
        }
      }

      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <div className="flex justify-center gap-2 mb-12">
          <ProgressDot active={step === "business"} completed={["whatsapp", "knowledge", "done"].includes(step)} />
          <ProgressDot active={step === "whatsapp"} completed={["knowledge", "done"].includes(step)} />
          <ProgressDot active={step === "knowledge"} completed={step === "done"} />
          <ProgressDot active={step === "done"} completed={false} />
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Step 1: Business Info */}
        {step === "business" && (
          <form onSubmit={handleBusinessSubmit} className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">أهلاً في Hekmo!</h1>
              <p className="text-gray-400">خلينا نتعرف على نشاطك</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">اسم النشاط *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="مثال: مطعم الريف"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">نوع النشاط *</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              >
                <option value="restaurant">مطعم</option>
                <option value="cafe">كافيه</option>
                <option value="salon">صالون</option>
                <option value="clinic">عيادة</option>
                <option value="retail">متجر</option>
                <option value="services">خدمات</option>
                <option value="other">آخر</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">ساعات العمل</label>
              <input
                type="text"
                value={workingHours}
                onChange={(e) => setWorkingHours(e.target.value)}
                placeholder="مثال: 9 صباحاً - 12 منتصف الليل"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">رقم التواصل</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={!businessName || loading}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg font-bold text-lg transition"
            >
              {loading ? "جاري الحفظ..." : "التالي ←"}
            </button>
          </form>
        )}

        {/* Step 2: WhatsApp */}
        {step === "whatsapp" && (
          <div className="text-center space-y-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">ربط WhatsApp</h1>
              <p className="text-gray-400">اربط رقم الواتساب لاستقبال رسائل العملاء</p>
            </div>

            <div className="p-8 bg-gray-900 rounded-xl border border-gray-700">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">📱</span>
              </div>
              <h3 className="text-xl font-bold mb-2">WhatsApp Business API</h3>
              <p className="text-gray-400 mb-6">
                الربط الرسمي مع واتساب للأعمال. آمن وموثوق.
              </p>
              <button
                onClick={handleWhatsAppConnect}
                disabled={loading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg font-bold text-lg transition"
              >
                {loading ? "جاري الربط..." : "ربط WhatsApp"}
              </button>
            </div>

            <button
              onClick={() => setStep("knowledge")}
              className="text-gray-400 hover:text-white transition"
            >
              تخطي هذه الخطوة
            </button>
          </div>
        )}

        {/* Step 3: Knowledge Base */}
        {step === "knowledge" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">تدريب الذكاء الاصطناعي</h1>
              <p className="text-gray-400">أضف معلومات نشاطك عشان Hekmo يرد على العملاء صح</p>
            </div>

            <div className="space-y-4">
              <KnowledgeCard
                title="قائمة الطعام / الخدمات"
                description="اكتب القائمة هنا"
                icon="📋"
                type="menu"
                onAdd={(content) => setKnowledgeItems([...knowledgeItems, { type: "menu", title: "قائمة الطعام", content }])}
              />
              <KnowledgeCard
                title="الأسئلة الشائعة"
                description="الأسئلة اللي يسألها العملاء كثير"
                icon="❓"
                type="faq"
                onAdd={(content) => setKnowledgeItems([...knowledgeItems, { type: "faq", title: "الأسئلة الشائعة", content }])}
              />
              <KnowledgeCard
                title="معلومات إضافية"
                description="أي شي تبي Hekmo يعرفه"
                icon="📝"
                type="info"
                onAdd={(content) => setKnowledgeItems([...knowledgeItems, { type: "info", title: "معلومات إضافية", content }])}
              />
            </div>

            {knowledgeItems.length > 0 && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <p className="text-emerald-400">✓ تم إضافة {knowledgeItems.length} عنصر</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep("done")}
                className="flex-1 py-4 border border-gray-600 hover:border-gray-500 rounded-lg font-bold transition"
              >
                تخطي
              </button>
              <button
                onClick={handleKnowledgeSubmit}
                disabled={loading}
                className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg font-bold transition"
              >
                {loading ? "جاري الحفظ..." : "التالي ←"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === "done" && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            <h1 className="text-3xl font-bold">مبروك!</h1>
            <p className="text-gray-400 text-lg">
              Hekmo جاهز يستقبل عملائك.
              <br />
              جرب ترسل رسالة واتساب وشوف السحر!
            </p>
            <button
              onClick={handleFinish}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold text-lg transition"
            >
              دخول لوحة التحكم
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressDot({ active, completed }: { active: boolean; completed: boolean }) {
  return (
    <div
      className={`w-3 h-3 rounded-full transition ${
        active
          ? "bg-emerald-500 ring-4 ring-emerald-500/30"
          : completed
          ? "bg-emerald-500"
          : "bg-gray-700"
      }`}
    />
  );
}

function KnowledgeCard({ 
  title, 
  description, 
  icon, 
  type,
  onAdd 
}: { 
  title: string; 
  description: string; 
  icon: string;
  type: string;
  onAdd: (content: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    if (content.trim()) {
      onAdd(content);
      setAdded(true);
      setExpanded(false);
    }
  };

  return (
    <div
      className={`p-4 border rounded-lg transition ${
        added
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-gray-700 bg-gray-900"
      }`}
    >
      <div 
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => !added && setExpanded(!expanded)}
      >
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        {added ? (
          <span className="text-emerald-400">✓</span>
        ) : (
          <span className="text-gray-500">{expanded ? "▼" : "+"}</span>
        )}
      </div>
      
      {expanded && !added && (
        <div className="mt-4 space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`اكتب ${title} هنا...`}
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
          />
          <button
            onClick={handleAdd}
            disabled={!content.trim()}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg font-bold transition"
          >
            إضافة
          </button>
        </div>
      )}
    </div>
  );
}
