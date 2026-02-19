"use client";

import { Check, Copy, Loader2, Plus, Trash2, Webhook } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface WebhookData {
  id: string;
  url: string;
  events: string[];
  secret: string;
  createdAt: string;
  active: boolean;
}

const EVENTS = [
  { id: "message.created", label: "رسالة جديدة" },
  { id: "message.updated", label: "تحديث رسالة" },
  { id: "chat.created", label: "محادثة جديدة" },
  { id: "chat.deleted", label: "حذف محادثة" },
  { id: "user.updated", label: "تحديث المستخدم" },
];

export function WebhooksManager() {
  const [webhooks, setWebhooks] = useState<WebhookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newEvents, setNewEvents] = useState<string[]>([]);
  const [copiedSecret, setCopiedSecret] = useState<string | null>(null);

  useEffect(() => {
    fetchWebhooks();
  }, [fetchWebhooks]);

  const fetchWebhooks = async () => {
    try {
      const response = await fetch("/api/webhooks");
      if (response.ok) {
        const data = await response.json();
        setWebhooks(data.webhooks || []);
      }
    } catch {
      toast.error("فشل تحميل الويب هوك");
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async () => {
    if (!newUrl.trim()) {
      toast.error("الرجاء إدخال الرابط");
      return;
    }

    if (newEvents.length === 0) {
      toast.error("الرجاء اختيار حدث واحد على الأقل");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl.trim(),
          events: newEvents,
        }),
      });

      if (response.ok) {
        setNewUrl("");
        setNewEvents([]);
        fetchWebhooks();
        toast.success("تم إنشاء الويب هوك");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل إنشاء الويب هوك");
    } finally {
      setCreating(false);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الويب هوك؟")) {
      return;
    }

    try {
      const response = await fetch(`/api/webhooks?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setWebhooks(webhooks.filter((w) => w.id !== id));
        toast.success("تم حذف الويب هوك");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل حذف الويب هوك");
    }
  };

  const copySecret = async (id: string, secret: string) => {
    await navigator.clipboard.writeText(secret);
    setCopiedSecret(id);
    toast.success("تم نسخ السر");
    setTimeout(() => setCopiedSecret(null), 2000);
  };

  const toggleEvent = (event: string) => {
    if (newEvents.includes(event)) {
      setNewEvents(newEvents.filter((e) => e !== event));
    } else {
      setNewEvents([...newEvents, event]);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* New Webhook Form */}
      <div className="space-y-4 p-4 rounded-lg border bg-muted/30">
        <h3 className="font-medium">إضافة ويب هوك جديد</h3>
        <Input
          dir="ltr"
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://your-server.com/webhook"
          value={newUrl}
        />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">الأحداث:</p>
          <div className="flex flex-wrap gap-2">
            {EVENTS.map((event) => (
              <button
                className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                  newEvents.includes(event.id)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border hover:border-primary"
                }`}
                key={event.id}
                onClick={() => toggleEvent(event.id)}
                type="button"
              >
                {event.label}
              </button>
            ))}
          </div>
        </div>
        <Button disabled={creating} onClick={createWebhook}>
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 ml-2" />
              إضافة
            </>
          )}
        </Button>
      </div>

      {/* Webhooks List */}
      <div className="space-y-3">
        {webhooks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Webhook className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>لا توجد ويب هوك</p>
          </div>
        ) : (
          webhooks.map((webhook) => (
            <div className="p-4 rounded-lg border space-y-3" key={webhook.id}>
              <div className="flex items-start justify-between">
                <div>
                  <code className="text-sm" dir="ltr">
                    {webhook.url}
                  </code>
                  <div className="flex gap-1 mt-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="secondary">
                        {EVENTS.find((e) => e.id === event)?.label || event}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={() => deleteWebhook(webhook.id)}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">السر:</span>
                <code className="px-2 py-0.5 bg-muted rounded" dir="ltr">
                  {webhook.secret.slice(0, 8)}...
                </code>
                <Button
                  onClick={() => copySecret(webhook.id, webhook.secret)}
                  size="icon"
                  variant="ghost"
                >
                  {copiedSecret === webhook.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
