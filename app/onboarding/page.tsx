"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "business" | "whatsapp" | "knowledge" | "done";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("business");
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("restaurant");
  const [workingHours, setWorkingHours] = useState("");
  const [phone, setPhone] = useState("");

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Save to database via API
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call
    
    setLoading(false);
    setStep("whatsapp");
  };

  const handleWhatsAppConnect = async () => {
    setLoading(true);
    
    // TODO: Redirect to WhatsApp Business API OAuth
    await new Promise(r => setTimeout(r, 1500)); // Simulate connection
    
    setLoading(false);
    setStep("knowledge");
  };

  const handleKnowledgeSubmit = async () => {
    setLoading(true);
    
    // TODO: Process uploaded files
    await new Promise(r => setTimeout(r, 1000));
    
    setLoading(false);
    setStep("done");
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
              <p className="text-gray-400">ارفع معلومات نشاطك عشان Hekmo يرد على العملاء صح</p>
            </div>

            <div className="space-y-4">
              <UploadCard
                title="قائمة الطعام / الخدمات"
                description="PDF أو صورة"
                icon="📋"
              />
              <UploadCard
                title="الأسئلة الشائعة"
                description="الأسئلة اللي يسألها العملاء كثير"
                icon="❓"
              />
              <UploadCard
                title="معلومات إضافية"
                description="أي شي تبي Hekmo يعرفه"
                icon="📝"
              />
            </div>

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

function UploadCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  const [uploaded, setUploaded] = useState(false);

  return (
    <label
      className={`block p-4 border rounded-lg cursor-pointer transition ${
        uploaded
          ? "border-emerald-500 bg-emerald-500/10"
          : "border-gray-700 bg-gray-900 hover:border-gray-600"
      }`}
    >
      <input
        type="file"
        className="hidden"
        onChange={() => setUploaded(true)}
        accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
      />
      <div className="flex items-center gap-4">
        <div className="text-3xl">{icon}</div>
        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
        {uploaded ? (
          <span className="text-emerald-400">✓</span>
        ) : (
          <span className="text-gray-500">رفع</span>
        )}
      </div>
    </label>
  );
}
