"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      toast.error("الرجاء كتابة DELETE للتأكيد");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmation }),
      });

      if (!response.ok) throw new Error();

      toast.success("تم حذف الحساب بنجاح");

      // Sign out and redirect
      await signOut({ redirect: false });
      router.push("/");
    } catch {
      toast.error("فشل حذف الحساب");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/delete");

      if (!response.ok) throw new Error();

      // Download the file
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "hekmo-data-export.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("تم تحميل بياناتك");
    } catch {
      toast.error("فشل تصدير البيانات");
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 ml-2" />
          حذف الحساب
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            حذف الحساب نهائياً
          </DialogTitle>
          <DialogDescription>
            هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بياناتك بشكل دائم.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Warning */}
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/50">
            <h4 className="font-medium text-destructive mb-2">
              سيتم حذف:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• جميع محادثاتك ورسائلك</li>
              <li>• ملفاتك ومستنداتك</li>
              <li>• إعداداتك وتفضيلاتك</li>
              <li>• اشتراكك (إن وجد)</li>
            </ul>
          </div>

          {/* Export data option */}
          <Button
            className="w-full"
            onClick={handleExportData}
            variant="outline"
          >
            تحميل نسخة من بياناتي أولاً
          </Button>

          {/* Confirmation input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              اكتب <span className="font-mono text-destructive">DELETE</span>{" "}
              للتأكيد:
            </label>
            <Input
              dir="ltr"
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
              value={confirmation}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1"
              disabled={loading || confirmation !== "DELETE"}
              onClick={handleDelete}
              variant="destructive"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "حذف الحساب نهائياً"
              )}
            </Button>
            <Button
              className="flex-1"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
