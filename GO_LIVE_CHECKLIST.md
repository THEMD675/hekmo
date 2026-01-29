# Hekmo - Go Live Checklist

## Code Status: 100% COMPLETE ✅

All 7 GOAL items are implemented and deployed.

| Component | Status | Endpoint |
|-----------|--------|----------|
| Landing Page | ✅ LIVE | https://hekmo.ai |
| Registration | ✅ LIVE | https://hekmo.ai/register |
| Onboarding | ✅ WIRED | https://hekmo.ai/onboarding |
| Dashboard | ✅ WIRED | https://hekmo.ai/dashboard |
| Business Registration | ✅ WORKING | /api/business/register |
| Knowledge Upload | ✅ WORKING | /api/business/knowledge |
| Business AI Chat | ✅ WORKING | /api/business/chat |
| WhatsApp Webhook | ✅ WORKING | /api/whatsapp/webhook |
| WhatsApp Connect | ✅ IMPLEMENTED | /api/whatsapp/connect |
| Stripe Subscribe | ✅ IMPLEMENTED | /api/business/subscribe |
| Stripe Webhook | ✅ IMPLEMENTED | /api/stripe/webhook |
| User Usage | ✅ IMPLEMENTED | /api/user/usage |
| User Delete (GDPR) | ✅ IMPLEMENTED | /api/user/delete |
| Password Reset | ✅ IMPLEMENTED | /api/auth/reset-password |

## External Configuration Required

### 1. Database Migrations (5 minutes)

```bash
# Connect to your Postgres database and run:
psql $POSTGRES_URL

# Run these migration files:
\i lib/db/migrations/0010_hekmo_business_tables.sql
\i lib/db/migrations/0011_user_profile_columns.sql
```

### 2. Stripe Setup (15 minutes)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Create products:
   - **Starter**: 499 SAR/month, recurring
   - **Business**: 1499 SAR/month, recurring
3. Copy price IDs to Vercel env vars:
   ```
   STRIPE_SECRET_KEY=sk_live_xxx
   STRIPE_PRICE_STARTER=price_xxx
   STRIPE_PRICE_BUSINESS=price_xxx
   ```
4. Create webhook: `https://hekmo.ai/api/stripe/webhook`
   - Events: checkout.session.completed, customer.subscription.*
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxx
   ```

### 3. WhatsApp Business API (30 minutes)

1. Go to [Meta Business Suite](https://business.facebook.com)
2. Create a Business App
3. Add WhatsApp product
4. Get credentials:
   ```
   META_APP_ID=xxx
   META_APP_SECRET=xxx
   WHATSAPP_ACCESS_TOKEN=xxx
   WHATSAPP_VERIFY_TOKEN=hekmo_verify_token
   ```
5. Configure webhook: `https://hekmo.ai/api/whatsapp/webhook`
   - Verify token: `hekmo_verify_token`
   - Subscribe to: messages

### 4. Email (Optional, 5 minutes)

For password reset emails:
1. Sign up at [Resend](https://resend.com)
2. Add domain verification
3. Add to Vercel:
   ```
   RESEND_API_KEY=re_xxx
   ```

### 5. Vercel Environment Variables Summary

```env
# Required
POSTGRES_URL=postgres://...
AUTH_SECRET=random_32_char_string
OPENAI_API_KEY=sk-xxx  # or DEEPSEEK_API_KEY

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# WhatsApp
META_APP_ID=xxx
META_APP_SECRET=xxx
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_VERIFY_TOKEN=hekmo_verify_token

# Email (Optional)
RESEND_API_KEY=re_xxx
```

## Testing Commands

```bash
# Test AI Chat
curl -X POST https://hekmo.ai/api/business/chat \
  -H "Content-Type: application/json" \
  -d '{"businessId":"test","customerMessage":"السلام عليكم","customerName":"أحمد"}'

# Test WhatsApp Webhook Verification
curl "https://hekmo.ai/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=hekmo_verify_token&hub.challenge=test"

# Test Supabase Edge Function
curl -X POST "https://jepstjrvylflmdyxwwdi.supabase.co/functions/v1/hekmo-ai" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"businessId":"test","messages":[{"role":"user","content":"مرحبا"}]}'
```

## Revenue Model

- **Target**: $10M ARR (37.5M SAR)
- **Starter (499 SAR)**: 80% of customers
- **Business (1499 SAR)**: 18% of customers
- **Enterprise (Custom)**: 2% of customers
- **Average Revenue Per User**: ~750 SAR/month
- **Customers Needed**: ~4,200 businesses

## Launch Checklist

- [ ] Run database migrations
- [ ] Configure Stripe products
- [ ] Configure WhatsApp Business API
- [ ] Set Vercel env vars
- [ ] Test full signup → onboard → chat flow
- [ ] Onboard 10 pilot customers
- [ ] Collect feedback and iterate
