# Hekmo - Go Live Checklist

## What's Built ✅

| Component | Status | URL |
|-----------|--------|-----|
| Landing Page | ✅ Live | https://hekmo.ai |
| Dashboard | ✅ WIRED TO DB | https://hekmo.ai/dashboard |
| Onboarding | ✅ WIRED TO DB | https://hekmo.ai/onboarding |
| WhatsApp Webhook | ✅ WIRED TO DB | https://hekmo.ai/api/whatsapp/webhook |
| Business AI Chat | ✅ Working | https://hekmo.ai/api/business/chat |
| Business Registration | ✅ WIRED | https://hekmo.ai/api/business/register |
| Knowledge Management | ✅ WIRED | https://hekmo.ai/api/business/knowledge |
| Business Details API | ✅ WIRED | https://hekmo.ai/api/business/[id] |
| Stripe Checkout | ✅ Ready | https://hekmo.ai/api/stripe/checkout |
| Stripe Webhooks | ✅ Ready | https://hekmo.ai/api/stripe/webhook |
| Supabase Edge Function | ✅ DEPLOYED | https://jepstjrvylflmdyxwwdi.supabase.co/functions/v1/hekmo-ai |

## User Flow (End-to-End)

1. **Landing**: User visits hekmo.ai → Sees Arabic marketing page
2. **Auth**: User clicks "ابدأ مجاناً" → Guest auth creates session
3. **Onboarding**: User enters business info → Saved to DB → Gets businessId
4. **WhatsApp**: User connects WhatsApp (requires Meta config)
5. **Knowledge**: User uploads menu/FAQs → Saved to DB
6. **Dashboard**: User sees real stats, conversations from DB
7. **Customers**: Customer messages WhatsApp → Webhook → AI responds using business knowledge

## Required Configuration

### 1. Database Migration (Required)

Run this SQL in your Postgres database:

```bash
# The migration file is at:
lib/db/migrations/0010_hekmo_business_tables.sql

# Run via psql or your database client
psql $POSTGRES_URL -f lib/db/migrations/0010_hekmo_business_tables.sql
```

### 2. Stripe Configuration (Required for billing)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get your keys:
   - `STRIPE_SECRET_KEY` - from API keys
   - `STRIPE_WEBHOOK_SECRET` - create webhook pointing to `https://hekmo.ai/api/stripe/webhook`
3. Add to Vercel env vars

### 3. WhatsApp Business API (Required for WhatsApp)

1. Go to [Meta Business Suite](https://business.facebook.com)
2. Create a WhatsApp Business account
3. Get credentials:
   - `WHATSAPP_ACCESS_TOKEN` - permanent token
   - `WHATSAPP_VERIFY_TOKEN` - your custom verify token (default: `hekmo_verify_token`)
4. Configure webhook URL: `https://hekmo.ai/api/whatsapp/webhook`
5. Subscribe to: `messages`

### 4. Vercel Environment Variables

Add these in [Vercel Project Settings](https://vercel.com/dashboard):

```env
# Required
POSTGRES_URL=your_postgres_url
AUTH_SECRET=random_32_char_string

# Stripe (for billing)
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# WhatsApp (for messaging)
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_VERIFY_TOKEN=hekmo_verify_token

# AI (one of these)
OPENAI_API_KEY=sk-xxx
# or
DEEPSEEK_API_KEY=xxx
```

## Pricing Plans

| Plan | Price (SAR/month) | Messages | WhatsApp Numbers |
|------|-------------------|----------|------------------|
| Starter | 499 | 1,000 | 1 |
| Business | 1,499 | 10,000 | 3 |
| Enterprise | Custom | Unlimited | Unlimited |

## Testing

### Test AI Response
```bash
curl -X POST https://hekmo.ai/api/business/chat \
  -H "Content-Type: application/json" \
  -d '{"businessId":"test","customerMessage":"السلام عليكم","customerName":"Test"}'
```

### Test WhatsApp Webhook Verification
```bash
curl "https://hekmo.ai/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=hekmo_verify_token&hub.challenge=test"
# Should return: test
```

## Revenue Model

- **Target**: $10M ARR
- **Average Customer Value**: ~$1,000/month
- **Customers Needed**: ~833 businesses
- **Focus Market**: Saudi restaurants, cafes, salons, clinics

## Next Steps

1. Run database migration
2. Configure Stripe
3. Configure WhatsApp Business API
4. Onboard first 10 pilot customers
5. Iterate based on feedback
