# HEKMO - Source of Truth

> **Last Updated**: January 28, 2026
> **Status**: 100/100 Features Complete | 150+ Files | 13,000+ Lines | Production Ready

---

## 🎯 What is Hekmo?

**Hekmo (حكمو)** is an AI-powered customer service platform for Saudi businesses. It provides 24/7 automated WhatsApp support with deep Arabic language understanding and Saudi cultural context.

**Live URL**: https://hekmo.ai

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 16 + React 19 + Tailwind 4 + shadcn/ui            │
├─────────────────────────────────────────────────────────────┤
│                         API LAYER                            │
│  Next.js API Routes + Streaming + Rate Limiting             │
├─────────────────────────────────────────────────────────────┤
│                        AI ENGINE                             │
│  Vercel AI SDK + OpenAI + Claude + Gemini                   │
├─────────────────────────────────────────────────────────────┤
│                        DATA LAYER                            │
│  Supabase PostgreSQL + Drizzle ORM + pgvector (RAG)         │
├─────────────────────────────────────────────────────────────┤
│                      INTEGRATIONS                            │
│  Stripe + Slack + Discord + WhatsApp + Telegram             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Completed Features (100/100)

### CORE (6/6)
- [x] Voice Input (STT) - Web Speech API with Arabic support
- [x] Voice Output (TTS) - Web Speech API with Arabic voices
- [x] Chat Search - Full-text search through conversations
- [x] Web Search Tool - Tavily integration for real-time search
- [x] RAG Knowledge Base - Supabase pgvector for embeddings
- [x] Long-term Memory - Mem0 pattern for user context

### AUTHENTICATION (3/3)
- [x] Password Reset Flow - Email-based with tokens
- [x] Account Deletion - GDPR-compliant data removal
- [x] OAuth Providers - Google, Apple, GitHub

### PAYMENTS (3/3)
- [x] Stripe Integration - Checkout sessions & webhooks
- [x] Subscription Tiers - Free, Pro, Enterprise
- [x] Usage-based Billing - Token counting & limits

### UI COMPONENTS (18/18)
- [x] Arabic Localization - Full RTL support
- [x] Error Messages - Arabic translations
- [x] Onboarding Flow - Multi-step introduction
- [x] Settings Page - User preferences
- [x] Profile Page - Account management
- [x] Chat Export - JSON & Markdown download
- [x] Keyboard Shortcuts - Global hotkeys
- [x] Command Palette - cmdk integration
- [x] Theme Customization - Dark/Light + accent colors
- [x] Font Size Controls - Accessibility
- [x] Code Syntax Highlighting - Multiple themes
- [x] Markdown Preview - Enhanced rendering
- [x] LaTeX/Math Rendering - KaTeX integration
- [x] Mermaid Diagrams - Chart rendering
- [x] Image Display - Generated images gallery
- [x] File Tree Component - Code navigation
- [x] Code Diff Viewer - Side-by-side comparison
- [x] Terminal Component - Command output display

### CHAT FEATURES (10/10)
- [x] Multi-model Support - GPT-4, Claude, Gemini
- [x] Model Selector UI - With Arabic descriptions
- [x] System Prompt Customization - Per-chat settings
- [x] Temperature/Parameters - Fine-tuning controls
- [x] Conversation Folders - Organization system
- [x] Pin Important Chats - Quick access
- [x] Archive Old Chats - Declutter UI
- [x] Share Chat Link - Public sharing
- [x] Collaborative Chat - Multi-user sessions
- [x] Chat Templates - Pre-defined prompts

### AI TOOLS (10/10)
- [x] Calculator - Math, BMI, calories
- [x] Code Execution - Sandboxed JS/Python
- [x] Image Generation - DALL-E 3 integration
- [x] PDF Reader - Text extraction
- [x] URL Summarizer - Web content analysis
- [x] YouTube Summarizer - Video metadata
- [x] Translation - Multi-language support
- [x] Grammar Checker - Arabic & English
- [x] Prayer Times - Aladhan API
- [x] Quran/Hadith Search - Islamic content

### AGENTS (5/5)
- [x] Multi-agent Orchestration - Task routing
- [x] Agent Memory - Persistent context
- [x] Tool Approval UI - User confirmation
- [x] Chain of Thought Display - Thinking indicator
- [x] Source Citations - Reference display

### ARTIFACTS (5/5)
- [x] Canvas/Whiteboard - Drawing tools
- [x] Diagram Editor - Mermaid integration
- [x] Spreadsheet - Excel-like functionality
- [x] Presentation Mode - Slide viewer
- [x] Version History - Change tracking

### SEO & LEGAL (8/8)
- [x] robots.txt - Search engine directives
- [x] sitemap.xml - Dynamic sitemap
- [x] Meta Tags - OpenGraph & Twitter
- [x] Structured Data - JSON-LD schema
- [x] Privacy Policy - Arabic content
- [x] Terms of Service - Arabic content
- [x] Cookie Consent - GDPR banner
- [x] GDPR Compliance - Data export/delete

### PERFORMANCE (6/6)
- [x] Image Optimization - AVIF/WebP
- [x] Code Splitting - Dynamic imports
- [x] Lazy Loading - Component-level
- [x] Service Worker/PWA - Offline support
- [x] CDN Configuration - Cache headers
- [x] Database Indexing - Query optimization

### MONITORING (4/4)
- [x] Error Tracking - Sentry integration
- [x] Analytics - PostHog events
- [x] Uptime Monitoring - Health endpoints
- [x] Performance Metrics - Web Vitals

### TESTING (4/4)
- [x] Unit Tests - Vitest
- [x] Integration Tests - API testing
- [x] E2E Tests - Playwright
- [x] Accessibility Tests - axe-core

### MOBILE (4/4)
- [x] Responsive Design - Mobile-first
- [x] Touch Gestures - Swipe navigation
- [x] PWA Install Prompt - Add to home
- [x] Push Notifications - Web Push API

### API (4/4)
- [x] Rate Limiting UI - Usage display
- [x] API Key Management - Developer keys
- [x] Webhook Support - Event notifications
- [x] Developer Documentation - API docs page

### INTEGRATIONS (6/6)
- [x] Slack Bot - Slash commands
- [x] Discord Bot - Interactions API
- [x] WhatsApp - Business API
- [x] Telegram Bot - Commands & callbacks
- [x] Calendar - Google Calendar API
- [x] Email - Gmail API integration

### SAUDI-SPECIFIC (4/4)
- [x] Absher Integration - Government auth
- [x] SADAD Payment - Bill payment
- [x] Nafath Authentication - Digital ID
- [x] Arabic NLP Optimization - Saudi dialect

---

## 📁 File Structure

```
hekmo/
├── app/
│   ├── (auth)/           # Auth pages (login, register, reset)
│   ├── (chat)/           # Chat interface & settings
│   ├── (legal)/          # Privacy, terms pages
│   └── api/              # API routes
│       ├── chat/         # Chat endpoints
│       ├── health/       # Health check
│       ├── integrations/ # Slack, Discord, etc.
│       ├── keys/         # API key management
│       ├── stripe/       # Payment webhooks
│       ├── user/         # User management
│       └── webhooks/     # Webhook management
├── components/
│   ├── artifacts/        # Canvas, Spreadsheet, etc.
│   ├── markdown/         # LaTeX, Mermaid
│   ├── ui/               # shadcn components
│   └── *.tsx             # Feature components
├── hooks/                # Custom React hooks
├── lib/
│   ├── ai/
│   │   ├── tools/        # AI tool implementations
│   │   ├── models.ts     # Model definitions
│   │   └── prompts.ts    # System prompts
│   ├── db/               # Database schema & queries
│   └── integrations/     # External service integrations
├── tests/
│   ├── a11y/             # Accessibility tests
│   ├── e2e/              # End-to-end tests
│   ├── integration/      # API tests
│   └── unit/             # Unit tests
└── public/               # Static assets
```

---

## 🔐 Environment Variables

```env
# Core
NEXT_PUBLIC_APP_URL=https://hekmo.ai
AUTH_SECRET=

# Database
POSTGRES_URL=

# AI Providers
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_AI_API_KEY=

# Search
TAVILY_API_KEY=

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_YEARLY=

# Analytics
NEXT_PUBLIC_POSTHOG_API_KEY=
SENTRY_DSN=

# Integrations
SLACK_BOT_TOKEN=
SLACK_SIGNING_SECRET=
DISCORD_BOT_TOKEN=
DISCORD_PUBLIC_KEY=
TELEGRAM_BOT_TOKEN=
WHATSAPP_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# Saudi
ABSHER_API_KEY=
SADAD_API_KEY=
NAFATH_APP_ID=
NAFATH_SECRET=
```

---

## 🚀 Deployment

Deployed on **Vercel** with automatic deployments from `main` branch.

```bash
# Deploy to production
git push origin main

# Pull environment variables
vercel env pull .env.local --environment=production
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS 4 |
| Components | shadcn/ui + Radix UI |
| Database | PostgreSQL (Supabase) |
| ORM | Drizzle |
| AI | Vercel AI SDK |
| Auth | NextAuth v5 |
| Payments | Stripe |
| Analytics | PostHog |
| Errors | Sentry |
| Testing | Playwright + Vitest |

---

## 🇸🇦 Saudi Arabia Focus

- **Full Arabic RTL** - Native right-to-left layout
- **Saudi Dialect** - Recognizes local expressions
- **Prayer Times** - Automatic city detection
- **Quran/Hadith** - Islamic content search
- **Government** - Absher, Nafath integration
- **Payments** - SADAD bill payment
- **Health Focus** - Saudi health guidelines

---

## 📝 Changelog

### v1.0.0 (January 28, 2026)
- Initial release with 100 features
- Full Arabic localization
- All integrations complete
- Production ready

---

*Built with ❤️ for Saudi Arabia*
