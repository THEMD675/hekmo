"use client";

import { Check, Copy, Key, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateArabic } from "@/lib/utils/date";

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsed?: string;
}

export function ApiKeysManager() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const fetchKeys = async () => {
    try {
      const response = await fetch("/api/keys");
      if (response.ok) {
        const data = await response.json();
        setKeys(data.keys || []);
      }
    } catch {
      toast.error("فشل تحميل المفاتيح");
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("الرجاء إدخال اسم للمفتاح");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch("/api/keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewKey(data.key);
        setNewKeyName("");
        fetchKeys();
        toast.success("تم إنشاء المفتاح");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل إنشاء المفتاح");
    } finally {
      setCreating(false);
    }
  };

  const deleteKey = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المفتاح؟")) {
      return;
    }

    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setKeys(keys.filter((k) => k.id !== id));
        toast.success("تم حذف المفتاح");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل حذف المفتاح");
    }
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    toast.success("تم نسخ المفتاح");
    setTimeout(() => setCopied(false), 2000);
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
      {/* New Key Form */}
      <div className="flex gap-3">
        <Input
          className="flex-1"
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="اسم المفتاح (مثال: تطبيق الموبايل)"
          value={newKeyName}
        />
        <Button disabled={creating} onClick={createKey}>
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 ml-2" />
              إنشاء مفتاح
            </>
          )}
        </Button>
      </div>

      {/* New Key Display */}
      {newKey && (
        <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
            تم إنشاء المفتاح بنجاح! احفظه الآن، لن يظهر مرة أخرى.
          </p>
          <div className="flex gap-2">
            <code
              className="flex-1 px-3 py-2 rounded bg-white dark:bg-black font-mono text-sm overflow-auto"
              dir="ltr"
            >
              {newKey}
            </code>
            <Button
              onClick={() => copyKey(newKey)}
              size="icon"
              variant="outline"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            className="mt-2"
            onClick={() => setNewKey(null)}
            size="sm"
            variant="ghost"
          >
            إغلاق
          </Button>
        </div>
      )}

      {/* Keys List */}
      <div className="space-y-3">
        {keys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>لا توجد مفاتيح API</p>
          </div>
        ) : (
          keys.map((key) => (
            <div
              className="flex items-center justify-between p-4 rounded-lg border"
              key={key.id}
            >
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {key.prefix}...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {formatDateArabic(new Date(key.createdAt))}
                </span>
                <Button
                  onClick={() => deleteKey(key.id)}
                  size="icon"
                  variant="ghost"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
