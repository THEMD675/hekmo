# Hekmo

The world's most advanced wellness AI. Sleep, stress, protocols, recovery — powered by science.

**[hekmo.ai](https://hekmo.ai)**

> ⚠️ **AGENTS**: Read `HEKMO_SOURCE_OF_TRUTH.md` before making any changes.

## Stack

- Next.js 16 (App Router)
- DeepSeek V3 via Vercel AI Gateway (chat)
- Gemini 2.5 Flash Lite (title generation)
- Supabase PostgreSQL (Drizzle ORM)
- NextAuth v5
- Tailwind CSS 4 + shadcn/ui
- Vercel (deployment)

## Development

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

## Documentation

**ONE SOURCE OF TRUTH**: `HEKMO_SOURCE_OF_TRUTH.md`

Contains: Architecture, features, bugs, external repos, solutions, roadmap.

## Key Directories

```
app/                    # Next.js App Router pages
components/             # Active UI components
components/ai-elements/ # GOLDMINE: 28 unused ready-to-use components
lib/ai/                 # AI providers, prompts, tools
lib/db/                 # Database schema and queries
```
