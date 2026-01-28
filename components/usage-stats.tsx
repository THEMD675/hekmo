"use client";

import { useState, useEffect } from "react";
import { BarChart3, MessageSquare, Zap, Clock, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface UsageStats {
  messagesUsed: number;
  messagesLimit: number;
  tokensUsed: number;
  tokensLimit: number;
  toolCalls: number;
  avgResponseTime: number;
  streak: number;
}

export function UsageStats() {
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/user/usage");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch {
        // Use mock data
        setStats({
          messagesUsed: 147,
          messagesLimit: 500,
          tokensUsed: 45230,
          tokensLimit: 100000,
          toolCalls: 23,
          avgResponseTime: 1.2,
          streak: 5,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-muted rounded-lg" />
        <div className="h-20 bg-muted rounded-lg" />
      </div>
    );
  }

  if (!stats) return null;

  const messagesPercent = (stats.messagesUsed / stats.messagesLimit) * 100;
  const tokensPercent = (stats.tokensUsed / stats.tokensLimit) * 100;

  return (
    <div className="space-y-4">
      {/* Usage Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Messages */}
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">الرسائل</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {stats.messagesUsed.toLocaleString("ar-SA")} /{" "}
              {stats.messagesLimit.toLocaleString("ar-SA")}
            </span>
          </div>
          <Progress
            className={cn(
              "h-2",
              messagesPercent > 80 && "[&>div]:bg-yellow-500",
              messagesPercent > 95 && "[&>div]:bg-red-500"
            )}
            value={messagesPercent}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {messagesPercent > 80
              ? "اقتربت من الحد الأقصى"
              : "استخدام عادي"}
          </p>
        </div>

        {/* Tokens */}
        <div className="p-4 rounded-lg border bg-card">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">التوكنز</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {(stats.tokensUsed / 1000).toFixed(1)}K /{" "}
              {(stats.tokensLimit / 1000).toFixed(0)}K
            </span>
          </div>
          <Progress
            className={cn(
              "h-2",
              tokensPercent > 80 && "[&>div]:bg-yellow-500",
              tokensPercent > 95 && "[&>div]:bg-red-500"
            )}
            value={tokensPercent}
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg border bg-card text-center">
          <BarChart3 className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <div className="text-lg font-bold">
            {stats.toolCalls.toLocaleString("ar-SA")}
          </div>
          <div className="text-xs text-muted-foreground">أدوات مستخدمة</div>
        </div>
        <div className="p-3 rounded-lg border bg-card text-center">
          <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <div className="text-lg font-bold">{stats.avgResponseTime}s</div>
          <div className="text-xs text-muted-foreground">متوسط الاستجابة</div>
        </div>
        <div className="p-3 rounded-lg border bg-card text-center">
          <TrendingUp className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
          <div className="text-lg font-bold">
            {stats.streak.toLocaleString("ar-SA")} 🔥
          </div>
          <div className="text-xs text-muted-foreground">أيام متتالية</div>
        </div>
      </div>
    </div>
  );
}
