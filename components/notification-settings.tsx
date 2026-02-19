"use client";

import { Bell, BellOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  getPushSubscription,
  isPushSupported,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
} from "@/lib/push-notifications";

export function NotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStatus() {
      if (!isPushSupported()) {
        setSupported(false);
        setLoading(false);
        return;
      }

      setSupported(true);

      const subscription = await getPushSubscription();
      setEnabled(!!subscription);
      setLoading(false);
    }

    checkStatus();
  }, []);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);

    try {
      if (checked) {
        // Request permission first
        const permission = await requestNotificationPermission();

        if (permission !== "granted") {
          toast.error("يجب السماح بالإشعارات أولاً");
          setLoading(false);
          return;
        }

        // Subscribe
        const subscription = await subscribeToPush();

        if (subscription) {
          setEnabled(true);
          toast.success("تم تفعيل الإشعارات");
        } else {
          toast.error("فشل تفعيل الإشعارات");
        }
      } else {
        // Unsubscribe
        const success = await unsubscribeFromPush();

        if (success) {
          setEnabled(false);
          toast.success("تم إلغاء الإشعارات");
        } else {
          toast.error("فشل إلغاء الإشعارات");
        }
      }
    } catch (_error) {
      toast.error("حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
        <BellOff className="h-5 w-5 text-muted-foreground" />
        <div>
          <div className="font-medium">الإشعارات غير مدعومة</div>
          <div className="text-sm text-muted-foreground">
            متصفحك لا يدعم إشعارات الويب
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border">
      <div className="flex items-center gap-3">
        <Bell className="h-5 w-5 text-muted-foreground" />
        <div>
          <div className="font-medium">إشعارات الدفع</div>
          <div className="text-sm text-muted-foreground">
            احصل على إشعارات عند وصول رسائل جديدة
          </div>
        </div>
      </div>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <Switch checked={enabled} onCheckedChange={handleToggle} />
      )}
    </div>
  );
}
