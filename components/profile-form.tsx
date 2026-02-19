"use client";

import { Camera, Loader2, Mail, Save, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProfileForm() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("الاسم مطلوب");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        // Update session
        await update({ name: name.trim() });
        toast.success("تم تحديث الملف الشخصي");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل تحديث الملف الشخصي");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file
    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار صورة");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجا");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { url } = await response.json();
        await update({ image: url });
        toast.success("تم تحديث الصورة");
      } else {
        throw new Error();
      }
    } catch {
      toast.error("فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session.user.image || undefined} />
            <AvatarFallback className="text-2xl">
              {(session.user.name || session.user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <label className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
            <input
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleAvatarUpload}
              type="file"
            />
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </label>
        </div>
        <div>
          <h3 className="font-medium">{session.user.name || "مستخدم"}</h3>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            الاسم
          </label>
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك"
            value={name}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="h-4 w-4" />
            البريد الإلكتروني
          </label>
          <Input dir="ltr" disabled value={session.user.email || ""} />
          <p className="text-xs text-muted-foreground">
            لا يمكن تغيير البريد الإلكتروني
          </p>
        </div>

        <Button disabled={loading} onClick={handleSave}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
          ) : (
            <Save className="h-4 w-4 ml-2" />
          )}
          حفظ التغييرات
        </Button>
      </div>
    </div>
  );
}
