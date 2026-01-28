"use client";

import { useState } from "react";
import { Copy, Check, Link, Users, Eye, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareChatDialogProps {
  chatId: string;
  trigger?: React.ReactNode;
}

export function ShareChatDialog({ chatId, trigger }: ShareChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [role, setRole] = useState<"viewer" | "editor">("viewer");
  const [copied, setCopied] = useState(false);

  const generateLink = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, role }),
      });

      if (!response.ok) {
        throw new Error("فشل إنشاء الرابط");
      }

      const data = await response.json();
      setInviteLink(data.inviteLink);
    } catch (error) {
      toast.error("فشل إنشاء رابط المشاركة");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!inviteLink) return;

    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("تم نسخ الرابط");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm" variant="outline">
            <Link className="h-4 w-4 ml-2" />
            مشاركة
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            مشاركة المحادثة
          </DialogTitle>
          <DialogDescription>
            شارك هذه المحادثة مع الآخرين للتعاون معاً.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Role selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">صلاحيات المدعو</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                  role === "viewer"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                )}
                onClick={() => setRole("viewer")}
                type="button"
              >
                <Eye className="h-4 w-4" />
                <div className="text-right">
                  <div className="text-sm font-medium">مشاهد</div>
                  <div className="text-xs text-muted-foreground">
                    قراءة فقط
                  </div>
                </div>
              </button>
              <button
                className={cn(
                  "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                  role === "editor"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-muted"
                )}
                onClick={() => setRole("editor")}
                type="button"
              >
                <Edit3 className="h-4 w-4" />
                <div className="text-right">
                  <div className="text-sm font-medium">محرر</div>
                  <div className="text-xs text-muted-foreground">
                    إرسال رسائل
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Generate or show link */}
          {inviteLink ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">رابط المشاركة</label>
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 rounded-md border bg-muted text-sm font-mono truncate"
                  dir="ltr"
                  readOnly
                  value={inviteLink}
                />
                <Button onClick={copyLink} size="icon" variant="outline">
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                أي شخص لديه هذا الرابط يمكنه الانضمام كـ{" "}
                {role === "editor" ? "محرر" : "مشاهد"}
              </p>
            </div>
          ) : (
            <Button
              className="w-full"
              disabled={loading}
              onClick={generateLink}
            >
              {loading ? "جاري الإنشاء..." : "إنشاء رابط المشاركة"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
