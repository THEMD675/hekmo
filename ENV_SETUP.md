# Hekmo Environment Variables Setup

## Required Variables

### Database (Vercel Postgres)
```env
POSTGRES_URL=postgresql://...
```

### Authentication
```env
AUTH_SECRET=<random 32+ character string>
```

### AI Providers (at least one required)
```env
# Option 1: DeepSeek (recommended - cheapest)
DEEPSEEK_API_KEY=sk-...

# Option 2: OpenAI
OPENAI_API_KEY=sk-...

# Option 3: Local Hekmo model
HEKMO_API_URL=http://localhost:8080
```

## Stripe (Required for billing)
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...  # 499 SAR/month product
STRIPE_PRICE_BUSINESS=price_... # 1499 SAR/month product
```

### Create Stripe Products:
1. Go to https://dashboard.stripe.com/products
2. Create "Hekmo Starter" - 499 SAR/month recurring
3. Create "Hekmo Business" - 1499 SAR/month recurring
4. Copy price IDs to env vars above

## WhatsApp Business API (Required for WhatsApp)
```env
META_APP_ID=...
META_APP_SECRET=...
WHATSAPP_ACCESS_TOKEN=...
WHATSAPP_VERIFY_TOKEN=hekmo_verify_token
```

### Setup WhatsApp:
1. Go to https://developers.facebook.com
2. Create a new app with WhatsApp product
3. Get a permanent access token
4. Configure webhook URL: https://hekmo.ai/api/whatsapp/webhook
5. Set verify token: `hekmo_verify_token`
6. Subscribe to messages

## Email (Optional - for password reset)
```env
RESEND_API_KEY=re_...
```

### Setup Resend:
1. Sign up at https://resend.com
2. Create API key
3. Verify domain (optional, for branded emails)

## Full Example .env.local
```env
# Database
POSTGRES_URL=postgresql://default:xxx@xxx.neon.tech:5432/verceldb?sslmode=require

# Auth
AUTH_SECRET=your-random-secret-string-32-chars

# AI
DEEPSEEK_API_KEY=sk-xxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_STARTER=price_xxx
STRIPE_PRICE_BUSINESS=price_xxx

# WhatsApp
META_APP_ID=xxx
META_APP_SECRET=xxx
WHATSAPP_ACCESS_TOKEN=xxx
WHATSAPP_VERIFY_TOKEN=hekmo_verify_token

# Email
RESEND_API_KEY=re_xxx

# App URL
NEXT_PUBLIC_APP_URL=https://hekmo.ai
```

## Vercel Setup

1. Go to https://vercel.com/[your-project]/settings/environment-variables
2. Add each variable for Production environment
3. Redeploy to apply changes

## Database Migration

After setting POSTGRES_URL, run the migration:

```bash
# Connect to your database
psql $POSTGRES_URL

# Run migration
\i lib/db/migrations/0010_hekmo_business_tables.sql
\i lib/db/migrations/0011_user_profile_columns.sql
```

Or use Drizzle:
```bash
npm run db:push
```
