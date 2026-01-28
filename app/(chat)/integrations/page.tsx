"use client";

import { IntegrationsPanel } from "@/components/integrations-panel";

export default function IntegrationsPage() {
  return (
    <div className="container max-w-4xl py-8 px-4" dir="rtl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">التكاملات</h1>
        <p className="text-muted-foreground mt-2">
          اربط حكمو بتطبيقاتك ومنصاتك المفضلة
        </p>
      </div>

      <IntegrationsPanel />
    </div>
  );
}
