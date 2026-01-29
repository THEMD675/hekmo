"use client";

import { useState } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "conversations" | "settings">("overview");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Nav */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-emerald-400">Hekmo</Link>
          <nav className="flex gap-4">
            <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
              نظرة عامة
            </TabButton>
            <TabButton active={activeTab === "conversations"} onClick={() => setActiveTab("conversations")}>
              المحادثات
            </TabButton>
            <TabButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
              الإعدادات
            </TabButton>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">مطعم الريف</span>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            تسجيل خروج
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "conversations" && <ConversationsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition ${
        active ? "bg-emerald-500/20 text-emerald-400" : "text-gray-400 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function OverviewTab() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">نظرة عامة</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="المحادثات اليوم" value="127" change="+12%" positive />
        <StatCard label="الرسائل" value="1,847" change="+23%" positive />
        <StatCard label="معدل الرد" value="< 30 ثانية" />
        <StatCard label="رضا العملاء" value="94%" change="+2%" positive />
      </div>

      {/* WhatsApp Status */}
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold mb-1">حالة WhatsApp</h3>
            <p className="text-gray-400">+966 50 123 4567</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-emerald-400">متصل</span>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h3 className="font-bold mb-4">آخر المحادثات</h3>
        <div className="space-y-4">
          <ConversationPreview
            name="أحمد محمد"
            lastMessage="أبي أحجز طاولة لـ 4 أشخاص"
            time="منذ 2 دقيقة"
            unread
          />
          <ConversationPreview
            name="سارة العلي"
            lastMessage="وش عندكم من الحلويات؟"
            time="منذ 15 دقيقة"
          />
          <ConversationPreview
            name="خالد السعيد"
            lastMessage="شكراً، الأكل كان لذيذ 👍"
            time="منذ ساعة"
          />
        </div>
      </div>
    </div>
  );
}

function ConversationsTab() {
  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Conversation List */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <input
            type="search"
            placeholder="بحث..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="overflow-auto h-full">
          <ConversationListItem name="أحمد محمد" preview="أبي أحجز طاولة..." time="2 د" active unread />
          <ConversationListItem name="سارة العلي" preview="وش عندكم من..." time="15 د" />
          <ConversationListItem name="خالد السعيد" preview="شكراً، الأكل..." time="1 س" />
          <ConversationListItem name="فاطمة أحمد" preview="كم سعر الـ..." time="2 س" />
          <ConversationListItem name="محمد العتيبي" preview="هل عندكم..." time="3 س" />
        </div>
      </div>

      {/* Chat View */}
      <div className="col-span-2 bg-gray-900 rounded-xl border border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold">أحمد محمد</h3>
            <p className="text-sm text-gray-400">+966 55 111 2222</p>
          </div>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition">
            نقل لموظف
          </button>
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <ChatBubble from="customer" message="السلام عليكم" time="10:30 ص" />
          <ChatBubble from="ai" message="وعليكم السلام! أهلاً فيك في مطعم الريف. كيف أقدر أساعدك؟" time="10:30 ص" />
          <ChatBubble from="customer" message="أبي أحجز طاولة لـ 4 أشخاص بكرة الساعة 8 المساء" time="10:31 ص" />
          <ChatBubble from="ai" message="تمام! عندنا طاولة متاحة بكرة الساعة 8. تبي أحجزها باسمك؟ 📋" time="10:31 ص" />
          <ChatBubble from="customer" message="إي، احجزها باسم أحمد محمد" time="10:32 ص" />
          <ChatBubble from="ai" message="تم الحجز! ✅\n\n📅 بكرة (الأربعاء)\n🕗 8:00 مساءً\n👥 4 أشخاص\n📝 باسم: أحمد محمد\n\nنتشرف بزيارتكم! لو تبي تعدل أو تلغي، كلمني وقت ما تبي." time="10:32 ص" />
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="اكتب رد..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
            <button className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg font-bold transition">
              إرسال
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">الإعدادات</h1>

      {/* Business Info */}
      <section className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-6">
        <h2 className="text-lg font-bold mb-4">معلومات النشاط</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">اسم النشاط</label>
            <input
              type="text"
              defaultValue="مطعم الريف"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">نوع النشاط</label>
            <select className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none">
              <option>مطعم</option>
              <option>كافيه</option>
              <option>صالون</option>
              <option>عيادة</option>
              <option>آخر</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">ساعات العمل</label>
            <input
              type="text"
              defaultValue="9 صباحاً - 12 منتصف الليل"
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* AI Training */}
      <section className="p-6 bg-gray-900 rounded-xl border border-gray-800 mb-6">
        <h2 className="text-lg font-bold mb-4">تدريب الذكاء الاصطناعي</h2>
        <p className="text-gray-400 mb-4">ارفع ملفات تساعد Hekmo يفهم نشاطك ويرد على العملاء صح.</p>
        <div className="space-y-3">
          <UploadItem name="قائمة الطعام" status="uploaded" />
          <UploadItem name="الأسئلة الشائعة" status="uploaded" />
          <UploadItem name="قائمة الأسعار" status="pending" />
        </div>
        <button className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition flex items-center gap-2">
          <span>+</span> رفع ملف جديد
        </button>
      </section>

      {/* WhatsApp */}
      <section className="p-6 bg-gray-900 rounded-xl border border-gray-800">
        <h2 className="text-lg font-bold mb-4">ربط WhatsApp</h2>
        <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
          <div>
            <p className="font-bold">+966 50 123 4567</p>
            <p className="text-sm text-emerald-400">متصل ويعمل</p>
          </div>
          <button className="px-4 py-2 border border-gray-600 hover:border-red-500 hover:text-red-400 rounded-lg transition">
            إلغاء الربط
          </button>
        </div>
      </section>
    </div>
  );
}

// Helper Components

function StatCard({ label, value, change, positive }: { label: string; value: string; change?: string; positive?: boolean }) {
  return (
    <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {change && (
        <p className={`text-sm ${positive ? "text-emerald-400" : "text-red-400"}`}>{change}</p>
      )}
    </div>
  );
}

function ConversationPreview({ name, lastMessage, time, unread }: { name: string; lastMessage: string; time: string; unread?: boolean }) {
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
        {unread && <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full mt-1"></span>}
      </div>
    </div>
  );
}

function ConversationListItem({ name, preview, time, active, unread }: { name: string; preview: string; time: string; active?: boolean; unread?: boolean }) {
  return (
    <div className={`p-4 border-b border-gray-800 cursor-pointer transition ${active ? "bg-emerald-500/10" : "hover:bg-gray-800"}`}>
      <div className="flex justify-between items-start mb-1">
        <span className={`font-bold ${unread ? "text-white" : "text-gray-300"}`}>{name}</span>
        <span className="text-xs text-gray-500">{time}</span>
      </div>
      <p className={`text-sm truncate ${unread ? "text-gray-300" : "text-gray-500"}`}>{preview}</p>
    </div>
  );
}

function ChatBubble({ from, message, time }: { from: "customer" | "ai"; message: string; time: string }) {
  return (
    <div className={`flex ${from === "ai" ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[70%] p-3 rounded-xl ${from === "ai" ? "bg-gray-800" : "bg-emerald-500/20"}`}>
        <p className="whitespace-pre-wrap">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
}

function UploadItem({ name, status }: { name: string; status: "uploaded" | "pending" }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
      <span>{name}</span>
      {status === "uploaded" ? (
        <span className="text-emerald-400 text-sm">✓ مرفوع</span>
      ) : (
        <span className="text-yellow-400 text-sm">⏳ في الانتظار</span>
      )}
    </div>
  );
}
