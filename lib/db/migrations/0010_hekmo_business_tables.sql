-- Hekmo Business Platform - Manual Migration
-- Run this in your Postgres database

-- Business table
CREATE TABLE IF NOT EXISTS "Business" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "userId" uuid NOT NULL REFERENCES "User"("id"),
    "name" text NOT NULL,
    "nameAr" text,
    "type" varchar(50) NOT NULL DEFAULT 'other',
    "phone" varchar(20),
    "email" varchar(100),
    "address" text,
    "workingHours" text,
    "workingHoursAr" text,
    "timezone" varchar(50) DEFAULT 'Asia/Riyadh',
    "language" varchar(10) DEFAULT 'ar',
    "whatsappPhoneNumberId" text,
    "whatsappBusinessAccountId" text,
    "whatsappAccessToken" text,
    "whatsappWebhookVerifyToken" text,
    "whatsappConnected" boolean DEFAULT false,
    "whatsappConnectedAt" timestamp,
    "subscriptionPlan" varchar(20) DEFAULT 'starter',
    "subscriptionStatus" varchar(20) DEFAULT 'trial',
    "trialEndsAt" timestamp,
    "stripeCustomerId" text,
    "stripeSubscriptionId" text,
    "messagesThisMonth" jsonb DEFAULT '0',
    "messagesLimit" jsonb DEFAULT '1000',
    "aiPersonality" varchar(20) DEFAULT 'friendly',
    "autoReplyEnabled" boolean DEFAULT true,
    "handoffEnabled" boolean DEFAULT true,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Business Knowledge table
CREATE TABLE IF NOT EXISTS "BusinessKnowledge" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "businessId" uuid NOT NULL REFERENCES "Business"("id"),
    "type" varchar(20) NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "contentAr" text,
    "isActive" boolean DEFAULT true,
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Conversation table
CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "businessId" uuid NOT NULL REFERENCES "Business"("id"),
    "customerPhone" varchar(20) NOT NULL,
    "customerName" text,
    "customerWaId" text,
    "status" varchar(20) DEFAULT 'active',
    "handedOffTo" uuid REFERENCES "User"("id"),
    "handedOffAt" timestamp,
    "lastMessageAt" timestamp DEFAULT now(),
    "messagesCount" jsonb DEFAULT '0',
    "createdAt" timestamp DEFAULT now() NOT NULL,
    "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- Conversation Message table
CREATE TABLE IF NOT EXISTS "ConversationMessage" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "conversationId" uuid NOT NULL REFERENCES "Conversation"("id"),
    "businessId" uuid NOT NULL REFERENCES "Business"("id"),
    "waMessageId" text,
    "role" varchar(20) NOT NULL,
    "content" text NOT NULL,
    "contentType" varchar(20) DEFAULT 'text',
    "mediaUrl" text,
    "metadata" jsonb DEFAULT '{}',
    "createdAt" timestamp DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_business_user" ON "Business"("userId");
CREATE INDEX IF NOT EXISTS "idx_knowledge_business" ON "BusinessKnowledge"("businessId");
CREATE INDEX IF NOT EXISTS "idx_conversation_business" ON "Conversation"("businessId");
CREATE INDEX IF NOT EXISTS "idx_conversation_phone" ON "Conversation"("customerPhone");
CREATE INDEX IF NOT EXISTS "idx_message_conversation" ON "ConversationMessage"("conversationId");
CREATE INDEX IF NOT EXISTS "idx_message_wa_id" ON "ConversationMessage"("waMessageId");
