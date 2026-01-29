# Hekmo

AI-powered customer service for Saudi businesses. 24/7 WhatsApp support in Arabic.

**[hekmo.ai](https://hekmo.ai)**

> ⚠️ **AGENTS**: Read `HEKMO_SOURCE_OF_TRUTH.md` before making any changes.

## What is Hekmo?

Hekmo is an AI agent that handles customer inquiries for Saudi businesses via WhatsApp.

- Responds in Saudi Arabic dialect
- Learns from your business data (menu, prices, FAQs)
- Handles bookings, inquiries, complaints
- Escalates to human when needed

## Stack

- Next.js 16 (App Router)
- DeepSeek V3 via Vercel AI Gateway (chat)
- Gemini 2.5 Flash Lite (title generation)
- Supabase PostgreSQL (Drizzle ORM)
- NextAuth v5
- Tailwind CSS 4 + shadcn/ui
- Vercel (deployment)
- WhatsApp Business API

## Development

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

## Documentation

- `ENV_SETUP.md` - Environment variables setup
- `GO_LIVE_CHECKLIST.md` - Production launch checklist
- `HEKMO_SOURCE_OF_TRUTH.md` - Architecture and features

## Key Directories

```
app/api/business/       # Business platform APIs
app/api/whatsapp/       # WhatsApp webhook and OAuth
app/dashboard/          # Business dashboard
app/onboarding/         # Business onboarding flow
lib/ai/                 # AI providers, prompts, tools
lib/db/                 # Database schema and queries
```

## Business Flow

1. Business signs up at hekmo.ai
2. Business connects WhatsApp number
3. Business uploads knowledge (menu, FAQs)
4. Customers message on WhatsApp
5. Hekmo AI responds automatically
6. Business monitors conversations on dashboard
