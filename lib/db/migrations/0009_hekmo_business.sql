-- Hekmo Business AI Platform Schema
-- Multi-tenant business customer service platform

-- Businesses (tenants)
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    name_ar TEXT,
    type TEXT NOT NULL DEFAULT 'other', -- restaurant, cafe, salon, clinic, other
    phone TEXT,
    email TEXT,
    address TEXT,
    working_hours TEXT,
    working_hours_ar TEXT,
    timezone TEXT DEFAULT 'Asia/Riyadh',
    language TEXT DEFAULT 'ar', -- ar, en, both
    
    -- WhatsApp Business API
    whatsapp_phone_number_id TEXT,
    whatsapp_business_account_id TEXT,
    whatsapp_access_token TEXT, -- encrypted
    whatsapp_webhook_verify_token TEXT,
    whatsapp_connected BOOLEAN DEFAULT false,
    whatsapp_connected_at TIMESTAMPTZ,
    
    -- Subscription
    subscription_plan TEXT DEFAULT 'starter', -- starter, business, enterprise
    subscription_status TEXT DEFAULT 'trial', -- trial, active, cancelled, expired
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    
    -- Usage
    messages_this_month INTEGER DEFAULT 0,
    messages_limit INTEGER DEFAULT 1000,
    
    -- Settings
    ai_personality TEXT DEFAULT 'friendly', -- friendly, professional, casual
    auto_reply_enabled BOOLEAN DEFAULT true,
    handoff_enabled BOOLEAN DEFAULT true, -- allow transferring to human
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business knowledge base (for AI training)
CREATE TABLE IF NOT EXISTS business_knowledge (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- menu, faq, pricing, info, custom
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_ar TEXT,
    embedding vector(1536), -- for semantic search
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    customer_phone TEXT NOT NULL,
    customer_name TEXT,
    customer_wa_id TEXT, -- WhatsApp ID
    status TEXT DEFAULT 'active', -- active, resolved, handed_off
    handed_off_to UUID REFERENCES "User"(id),
    handed_off_at TIMESTAMPTZ,
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    messages_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    wa_message_id TEXT, -- WhatsApp message ID for deduplication
    role TEXT NOT NULL, -- customer, ai, human
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text', -- text, image, audio, document
    media_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_businesses_user ON businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_business_knowledge_business ON business_knowledge(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business ON conversations(business_id);
CREATE INDEX IF NOT EXISTS idx_conversations_customer ON conversations(customer_phone);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_wa_id ON messages(wa_message_id);

-- RLS Policies
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own businesses
CREATE POLICY "Users can view own businesses" ON businesses
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own businesses" ON businesses
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own businesses" ON businesses
    FOR UPDATE USING (user_id = auth.uid());

-- Knowledge belongs to business
CREATE POLICY "Users can manage own business knowledge" ON business_knowledge
    FOR ALL USING (
        business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
    );

-- Conversations belong to business
CREATE POLICY "Users can view own conversations" ON conversations
    FOR SELECT USING (
        business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
    );

-- Messages belong to conversation
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (
        business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid())
    );

-- Service role can do everything (for webhooks)
CREATE POLICY "Service role full access businesses" ON businesses
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access knowledge" ON business_knowledge
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access conversations" ON conversations
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access messages" ON messages
    FOR ALL USING (auth.role() = 'service_role');
