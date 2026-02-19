"use client";

import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface Preferences {
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  accessibility: {
    reducedMotion: boolean;
    highContrast: boolean;
  };
  chat: {
    sendOnEnter: boolean;
    showTimestamps: boolean;
    compactMode: boolean;
  };
}

export function PreferencesForm() {
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences");
      if (response.ok) {
        const data = await response.json();
        setPreferences(data);
      }
    } catch {
      toast.error("فشل تحميل التفضيلات");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    if (!preferences) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        toast.success("تم حفظ التفضيلات");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل حفظ التفضيلات");
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (
    category: keyof Preferences,
    key: string,
    value: boolean
  ) => {
    if (!preferences) {
      return;
    }

    setPreferences({
      ...preferences,
      [category]: {
        ...preferences[category],
        [key]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        فشل تحميل التفضيلات
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Notifications */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">الإشعارات</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">إشعارات البريد</div>
              <div className="text-sm text-muted-foreground">
                استلام تحديثات عبر البريد الإلكتروني
              </div>
            </div>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(v) =>
                updatePreference("notifications", "email", v)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">إشعارات الدفع</div>
              <div className="text-sm text-muted-foreground">
                إشعارات فورية على جهازك
              </div>
            </div>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(v) =>
                updatePreference("notifications", "push", v)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">رسائل تسويقية</div>
              <div className="text-sm text-muted-foreground">
                عروض وتحديثات المنتج
              </div>
            </div>
            <Switch
              checked={preferences.notifications.marketing}
              onCheckedChange={(v) =>
                updatePreference("notifications", "marketing", v)
              }
            />
          </div>
        </div>
      </section>

      {/* Accessibility */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">إمكانية الوصول</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">تقليل الحركة</div>
              <div className="text-sm text-muted-foreground">
                تقليل الرسوم المتحركة
              </div>
            </div>
            <Switch
              checked={preferences.accessibility.reducedMotion}
              onCheckedChange={(v) =>
                updatePreference("accessibility", "reducedMotion", v)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">تباين عالي</div>
              <div className="text-sm text-muted-foreground">
                زيادة تباين الألوان
              </div>
            </div>
            <Switch
              checked={preferences.accessibility.highContrast}
              onCheckedChange={(v) =>
                updatePreference("accessibility", "highContrast", v)
              }
            />
          </div>
        </div>
      </section>

      {/* Chat */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium">المحادثة</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">إرسال بـ Enter</div>
              <div className="text-sm text-muted-foreground">
                اضغط Enter للإرسال
              </div>
            </div>
            <Switch
              checked={preferences.chat.sendOnEnter}
              onCheckedChange={(v) =>
                updatePreference("chat", "sendOnEnter", v)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">عرض الوقت</div>
              <div className="text-sm text-muted-foreground">
                إظهار وقت الرسائل
              </div>
            </div>
            <Switch
              checked={preferences.chat.showTimestamps}
              onCheckedChange={(v) =>
                updatePreference("chat", "showTimestamps", v)
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">الوضع المضغوط</div>
              <div className="text-sm text-muted-foreground">
                تقليل المسافات بين الرسائل
              </div>
            </div>
            <Switch
              checked={preferences.chat.compactMode}
              onCheckedChange={(v) =>
                updatePreference("chat", "compactMode", v)
              }
            />
          </div>
        </div>
      </section>

      {/* Save */}
      <Button disabled={saving} onClick={savePreferences}>
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin ml-2" />
        ) : (
          <Save className="h-4 w-4 ml-2" />
        )}
        حفظ التفضيلات
      </Button>
    </div>
  );
}
