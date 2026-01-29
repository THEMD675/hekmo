"use client";

import { Calendar, Mail, Shield, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-5 w-72 mt-2" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const user = session?.user;
  const initials = user?.email?.slice(0, 2).toUpperCase() || "؟";

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">الملف الشخصي</h1>
        <p className="text-muted-foreground mt-2">عرض وإدارة معلومات حسابك</p>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.image || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {user?.name || "مستخدم حكمو"}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4" />
                  {user?.email || "بدون بريد إلكتروني"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Account Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              تفاصيل الحساب
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>البريد الإلكتروني</span>
              </div>
              <span className="font-medium">{user?.email || "غير متوفر"}</span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>تاريخ الانضمام</span>
              </div>
              <span className="font-medium">
                {new Date().toLocaleDateString("ar-SA", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>نوع الحساب</span>
              </div>
              <Badge variant="secondary">مجاني</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <Card>
          <CardHeader>
            <CardTitle>إحصائيات الاستخدام</CardTitle>
            <CardDescription>نظرة عامة على استخدامك لحكمو</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary">-</div>
                <div className="text-sm text-muted-foreground">محادثة</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary">-</div>
                <div className="text-sm text-muted-foreground">رسالة</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
