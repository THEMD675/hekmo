"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeysManager } from "@/components/api-keys-manager";
import { WebhooksManager } from "@/components/webhooks-manager";
import Link from "next/link";
import { Code, Key, Webhook, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeveloperPage() {
  return (
    <div className="container max-w-4xl py-8 px-4" dir="rtl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code className="h-6 w-6" />
            للمطورين
          </h1>
          <p className="text-muted-foreground mt-2">
            إدارة مفاتيح API والويب هوك
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/docs">
            <BookOpen className="h-4 w-4 ml-2" />
            التوثيق
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="keys" dir="rtl">
        <TabsList className="mb-6">
          <TabsTrigger className="gap-2" value="keys">
            <Key className="h-4 w-4" />
            مفاتيح API
          </TabsTrigger>
          <TabsTrigger className="gap-2" value="webhooks">
            <Webhook className="h-4 w-4" />
            ويب هوك
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <ApiKeysManager />
        </TabsContent>

        <TabsContent value="webhooks">
          <WebhooksManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
