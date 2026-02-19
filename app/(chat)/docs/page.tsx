"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DocsPage() {
  const [_copiedCode, setCopiedCode] = useState<string | null>(null);

  const _copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const curlExample = `curl -X POST https://api.hekmo.ai/v1/chat/completions \\
  -H "Authorization: Bearer hk_live_xxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "hekmo",
    "messages": [
      {"role": "user", "content": "ما هو أفضل وقت للنوم؟"}
    ]
  }'`;

  const jsExample = `const response = await fetch('https://api.hekmo.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer hk_live_xxxxx',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'hekmo',
    messages: [
      { role: 'user', content: 'ما هو أفضل وقت للنوم؟' }
    ],
  }),
});

const data = await response.json();
console.log(data.choices[0].message.content);`;

  const pythonExample = `import requests

response = requests.post(
    'https://api.hekmo.ai/v1/chat/completions',
    headers={
        'Authorization': 'Bearer hk_live_xxxxx',
        'Content-Type': 'application/json',
    },
    json={
        'model': 'hekmo',
        'messages': [
            {'role': 'user', 'content': 'ما هو أفضل وقت للنوم؟'}
        ],
    }
)

print(response.json()['choices'][0]['message']['content'])`;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Hekmo API Documentation</h1>
      <p className="text-xl text-muted-foreground mb-8">
        وثائق API لدمج حكمو في تطبيقاتك
      </p>

      {/* Getting Started */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">البداية السريعة</h2>
        <div className="space-y-4">
          <p>1. احصل على مفتاح API من صفحة الإعدادات</p>
          <p>2. استخدم المفتاح في طلباتك</p>
          <p>3. ابدأ ببناء تطبيقك!</p>
        </div>
      </section>

      {/* Authentication */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">المصادقة</h2>
        <p className="mb-4">استخدم Bearer token في header الطلب:</p>
        <div className="bg-muted rounded-lg p-4 font-mono text-sm" dir="ltr">
          Authorization: Bearer hk_live_xxxxx
        </div>
      </section>

      {/* Endpoints */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">نقاط النهاية</h2>

        <div className="space-y-6">
          {/* Chat Completions */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-sm font-mono">
                POST
              </span>
              <span className="font-mono">/v1/chat/completions</span>
            </div>
            <p className="text-muted-foreground mb-4">إنشاء محادثة مع حكمو</p>

            <h4 className="font-semibold mb-2">Parameters</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 pr-4">الاسم</th>
                    <th className="text-right py-2 pr-4">النوع</th>
                    <th className="text-right py-2">الوصف</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono">model</td>
                    <td className="py-2 pr-4">string</td>
                    <td className="py-2">
                      النموذج المستخدم (hekmo, hekmo-pro)
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono">messages</td>
                    <td className="py-2 pr-4">array</td>
                    <td className="py-2">قائمة الرسائل</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 pr-4 font-mono">temperature</td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2">0-2، افتراضي 0.7</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">max_tokens</td>
                    <td className="py-2 pr-4">number</td>
                    <td className="py-2">الحد الأقصى للرموز</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">أمثلة الكود</h2>

        <Tabs defaultValue="curl">
          <TabsList className="mb-4">
            <TabsTrigger value="curl">cURL</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>

          <TabsContent value="curl">
            <CodeBlock code={curlExample} language="bash" />
          </TabsContent>

          <TabsContent value="javascript">
            <CodeBlock code={jsExample} language="javascript" />
          </TabsContent>

          <TabsContent value="python">
            <CodeBlock code={pythonExample} language="python" />
          </TabsContent>
        </Tabs>
      </section>

      {/* Rate Limits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">حدود الاستخدام</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded-lg">
            <thead className="bg-muted">
              <tr>
                <th className="text-right py-3 px-4">الخطة</th>
                <th className="text-right py-3 px-4">الطلبات/الدقيقة</th>
                <th className="text-right py-3 px-4">الرموز/اليوم</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-3 px-4">مجاني</td>
                <td className="py-3 px-4">10</td>
                <td className="py-3 px-4">100,000</td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-4">احترافي</td>
                <td className="py-3 px-4">60</td>
                <td className="py-3 px-4">1,000,000</td>
              </tr>
              <tr className="border-t">
                <td className="py-3 px-4">مؤسسات</td>
                <td className="py-3 px-4">غير محدود</td>
                <td className="py-3 px-4">غير محدود</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Error Codes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">رموز الأخطاء</h2>
        <div className="space-y-3">
          <div className="flex gap-4">
            <span className="font-mono text-red-500">400</span>
            <span>طلب غير صالح</span>
          </div>
          <div className="flex gap-4">
            <span className="font-mono text-red-500">401</span>
            <span>غير مصرح</span>
          </div>
          <div className="flex gap-4">
            <span className="font-mono text-red-500">429</span>
            <span>تجاوز حد الطلبات</span>
          </div>
          <div className="flex gap-4">
            <span className="font-mono text-red-500">500</span>
            <span>خطأ في الخادم</span>
          </div>
        </div>
      </section>

      {/* Support */}
      <section>
        <h2 className="text-2xl font-bold mb-4">الدعم</h2>
        <p className="text-muted-foreground">
          للمساعدة، تواصل معنا على{" "}
          <a
            className="text-primary hover:underline"
            href="mailto:api@hekmo.ai"
          >
            api@hekmo.ai
          </a>
        </p>
      </section>
    </div>
  );
}
