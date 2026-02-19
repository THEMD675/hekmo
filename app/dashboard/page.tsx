"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Business {
  id: string;
  name: string;
  nameAr?: string;
  type: string;
  phone?: string;
  workingHours?: string;
  whatsappConnected: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
  messagesThisMonth: number;
  messagesLimit: number;
  trialEndsAt?: string;
}

interface Conversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  status: string;
  lastMessageAt: string;
  messagesCount: number;
}

interface DashboardData {
  business: Business;
  stats: {
    totalConversations: number;
    knowledgeItems: number;
  };
  recentConversations: Conversation[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "overview" | "conversations" | "settings"
  >("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchDashboardData = async () => {
    try {
      const businessId = localStorage.getItem("hekmo_business_id");

      if (!businessId) {
        // No business registered, redirect to onboarding
        router.push("/onboarding");
        return;
      }

      const response = await fetch(`/api/business/${businessId}`);

      if (response.status === 401) {
        // Auth required, redirect to guest login
        window.location.href = `/api/auth/guest?redirectUrl=${encodeURIComponent(window.location.href)}`;
        return;
      }

      if (response.status === 404) {
        // Business not found, clear localStorage and redirect
        localStorage.removeItem("hekmo_business_id");
        router.push("/onboarding");
        return;
      }

      if (!response.ok) {
        throw new Error("فشل تحميل البيانات");
      }

      const dashboardData = await response.json();
      setData(dashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hekmo_business_id");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold transition"
            onClick={() => router.push("/onboarding")}
          >
            إنشاء نشاط جديد
          </button>
        </div>
      </div>
    );
  }

  const business = data?.business;
  const stats = data?.stats;
  const conversations = data?.recentConversations || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Nav */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link className="text-xl font-bold text-emerald-400" href="/">
            Hekmo
          </Link>
          <nav className="flex gap-4">
            <TabButton
              active={activeTab === "overview"}
              onClick={() => setActiveTab("overview")}
            >
              نظرة عامة
            </TabButton>
            <TabButton
              active={activeTab === "conversations"}
              onClick={() => setActiveTab("conversations")}
            >
              المحادثات
            </TabButton>
            <TabButton
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            >
              الإعدادات
            </TabButton>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">{business?.name || "نشاطي"}</span>
          <button
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
            onClick={handleLogout}
          >
            تسجيل خروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <OverviewTab
            business={business!}
            conversations={conversations}
            stats={stats!}
          />
        )}
        {activeTab === "conversations" && (
          <ConversationsTab conversations={conversations} />
        )}
        {activeTab === "settings" && (
          <SettingsTab
            business={business!}
            knowledgeCount={stats?.knowledgeItems || 0}
            onUpdate={fetchDashboardData}
          />
        )}
      </main>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition ${
        active
          ? "bg-emerald-500/20 text-emerald-400"
          : "text-gray-400 hover:text-white"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function OverviewTab({
  business,
  stats,
  conversations,
}: {
  business: Business;
  stats: { totalConversations: number; knowledgeItems: number };
  conversations: Conversation[];
}) {
  const usagePercent =
    business.messagesLimit > 0
      ? Math.round((business.messagesThisMonth / business.messagesLimit) * 100)
      : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">نظرة عامة</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="المحادثات" value={String(stats.totalConversations)} />
        <StatCard
          label="الرسائل هذا الشهر"
          value={String(business.messagesThisMonth || 0)}
        />
        <StatCard label="الحد الشهري" value={`${usagePercent}%`} />
        <StatCard
          label="قاعدة المعرفة"
          value={`${stats.knowledgeItems} عنصر`}
        />
      </div>

      {/* WhatsApp Status */}
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold mb-1">حالة WhatsApp</h3>
            <p className="text-gray-400">{business.phone || "لم يتم الربط"}</p>
          </div>
          <div className="flex items-center gap-2">
            {business.whatsappConnected ? (
              <>
                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-emerald-400">متصل</span>
              </>
            ) : (
              <>
                <span className="w-3 h-3 bg-yellow-500 rounded-full" />
                <span className="text-yellow-400">غير متصل</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Status */}
      <SubscriptionCard business={business} />

      {/* Recent Conversations */}
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="font-bold mb-4">آخر المحادثات</h3>
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">لا توجد محادثات بعد</p>
        ) : (
          <div className="space-y-4">
            {conversations.slice(0, 5).map((conv) => (
              <ConversationPreview
                key={conv.id}
                lastMessage={`${conv.messagesCount} رسالة`}
                name={conv.customerName || conv.customerPhone}
                time={formatTime(conv.lastMessageAt)}
                unread={conv.status === "active"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationsTab({
  conversations,
}: {
  conversations: Conversation[];
}) {
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Conversation List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <input
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            placeholder="بحث..."
            type="search"
          />
        </div>
        <div className="overflow-auto h-full">
          {conversations.length === 0 ? (
            <p className="text-gray-400 text-center py-8">لا توجد محادثات</p>
          ) : (
            conversations.map((conv) => (
              <ConversationListItem
                active={selectedConversation === conv.id}
                key={conv.id}
                name={conv.customerName || conv.customerPhone}
                onClick={() => setSelectedConversation(conv.id)}
                preview={`${conv.messagesCount} رسالة`}
                time={formatTime(conv.lastMessageAt)}
                unread={conv.status === "active"}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat View */}
      <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold">
                  {conversations.find((c) => c.id === selectedConversation)
                    ?.customerName || "عميل"}
                </h3>
                <p className="text-sm text-gray-400">
                  {
                    conversations.find((c) => c.id === selectedConversation)
                      ?.customerPhone
                  }
                </p>
              </div>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
                نقل لموظف
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <p className="text-gray-400 text-center py-8">
                اضغط على محادثة لعرضها
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400">اختر محادثة لعرضها</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({
  business,
  knowledgeCount,
  onUpdate,
}: {
  business: Business;
  knowledgeCount: number;
  onUpdate: () => void;
}) {
  const [name, setName] = useState(business.name);
  const [type, setType] = useState(business.type);
  const [workingHours, setWorkingHours] = useState(business.workingHours || "");
  const [phone, setPhone] = useState(business.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/business/${business.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, workingHours, phone }),
      });

      if (response.ok) {
        onUpdate();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      {/* Business Info */}
      <section className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-6">
        <h2 className="text-lg font-bold mb-4">معلومات النشاط</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              اسم النشاط
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              onChange={(e) => setName(e.target.value)}
              type="text"
              value={name}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              نوع النشاط
            </label>
            <select
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value="restaurant">مطعم</option>
              <option value="cafe">كافيه</option>
              <option value="salon">صالون</option>
              <option value="clinic">عيادة</option>
              <option value="other">آخر</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              ساعات العمل
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              onChange={(e) => setWorkingHours(e.target.value)}
              type="text"
              value={workingHours}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              رقم التواصل
            </label>
            <input
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              value={phone}
            />
          </div>
          <button
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 rounded-lg font-bold transition"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </button>
        </div>
      </section>

      {/* AI Training */}
      <section className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-6">
        <h2 className="text-lg font-bold mb-4">تدريب الذكاء الاصطناعي</h2>
        <p className="text-gray-400 mb-4">
          لديك {knowledgeCount} عنصر في قاعدة المعرفة.
        </p>
        <Link
          className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          href="/onboarding?step=knowledge"
        >
          + إضافة معلومات
        </Link>
      </section>

      {/* WhatsApp */}
      <section className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h2 className="text-lg font-bold mb-4">ربط WhatsApp</h2>
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <p className="font-bold">{business.phone || "لم يتم الربط"}</p>
            <p
              className={`text-sm ${business.whatsappConnected ? "text-emerald-400" : "text-yellow-400"}`}
            >
              {business.whatsappConnected ? "متصل ويعمل" : "غير متصل"}
            </p>
          </div>
          <button className="px-4 py-2 border border-gray-600 hover:border-emerald-500 hover:text-emerald-400 rounded-lg transition">
            {business.whatsappConnected ? "إلغاء الربط" : "ربط الآن"}
          </button>
        </div>
      </section>
    </div>
  );
}

// Helper Components

function StatCard({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}) {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {change && (
        <p
          className={`text-sm ${positive ? "text-emerald-400" : "text-red-400"}`}
        >
          {change}
        </p>
      )}
    </div>
  );
}

function ConversationPreview({
  name,
  lastMessage,
  time,
  unread,
}: {
  name: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
          {name[0]}
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-400">{lastMessage}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{time}</p>
        {unread && (
          <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-1" />
        )}
      </div>
    </div>
  );
}

function ConversationListItem({
  name,
  preview,
  time,
  active,
  unread,
  onClick,
}: {
  name: string;
  preview: string;
  time: string;
  active?: boolean;
  unread?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`p-4 border-b border-gray-800 cursor-pointer transition ${active ? "bg-emerald-500/10" : "hover:bg-gray-800"}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={`font-bold ${unread ? "text-white" : "text-gray-300"}`}
        >
          {name}
        </span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p
        className={`text-sm truncate ${unread ? "text-gray-300" : "text-gray-500"}`}
      >
        {preview}
      </p>
    </div>
  );
}

function SubscriptionCard({ business }: { business: Business }) {
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId);
    try {
      const response = await fetch("/api/business/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          businessId: business.id,
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.type === "contact") {
        window.location.href = `mailto:${data.email}`;
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    } finally {
      setUpgrading(null);
    }
  };

  const plans = [
    { id: "starter", name: "المبتدئ", price: 499, messages: "1,000" },
    { id: "business", name: "الأعمال", price: 1499, messages: "10,000" },
    { id: "enterprise", name: "المؤسسات", price: null, messages: "غير محدود" },
  ];

  const currentPlanIndex = plans.findIndex(
    (p) => p.id === business.subscriptionPlan
  );

  return (
    <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-8">
      <h3 className="font-bold mb-4">الاشتراك</h3>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-lg font-bold text-emerald-400">
            {plans.find((p) => p.id === business.subscriptionPlan)?.name ||
              "تجريبي"}
          </p>
          <p className="text-sm text-gray-400">
            {business.subscriptionStatus === "trial"
              ? "فترة تجريبية"
              : business.subscriptionStatus === "active"
                ? "نشط"
                : business.subscriptionStatus === "past_due"
                  ? "متأخر الدفع"
                  : business.subscriptionStatus}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">الرسائل هذا الشهر</p>
          <p className="font-bold">
            {business.messagesThisMonth || 0} /{" "}
            {business.messagesLimit === -1 ? "∞" : business.messagesLimit}
          </p>
        </div>
      </div>

      {/* Upgrade Options */}
      {business.subscriptionPlan !== "enterprise" && (
        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-800">
          {plans.map((plan, idx) => (
            <button
              className={`p-3 rounded-lg text-center transition ${
                idx <= currentPlanIndex
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              }`}
              disabled={idx <= currentPlanIndex || upgrading !== null}
              key={plan.id}
              onClick={() => idx > currentPlanIndex && handleUpgrade(plan.id)}
            >
              <p className="font-bold text-sm">{plan.name}</p>
              <p className="text-xs">
                {plan.price ? `${plan.price} ر.س` : "تواصل معنا"}
              </p>
              {upgrading === plan.id && (
                <span className="text-xs">جاري...</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) {
    return "الآن";
  }
  if (diffMins < 60) {
    return `منذ ${diffMins} د`;
  }
  if (diffHours < 24) {
    return `منذ ${diffHours} س`;
  }
  if (diffDays < 7) {
    return `منذ ${diffDays} ي`;
  }
  return date.toLocaleDateString("ar-SA");
}
