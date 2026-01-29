"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { initAnalytics, trackPageView, identifyUser, resetUser } from "@/lib/analytics";
import { usePathname } from "next/navigation";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Identify user when session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      identifyUser(session.user.id, {
        email: session.user.email,
        name: session.user.name,
      });
    } else if (status === "unauthenticated") {
      resetUser();
    }
  }, [session, status]);

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      trackPageView(pathname);
    }
  }, [pathname]);

  return <>{children}</>;
}
