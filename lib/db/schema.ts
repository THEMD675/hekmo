import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  json,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const chat = pgTable("Chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messageDeprecated = pgTable("Message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type MessageDeprecated = InferSelectModel<typeof messageDeprecated>;

export const message = pgTable("Message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatId: uuid("chatId")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdAt: timestamp("createdAt").notNull(),
});

export type DBMessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const voteDeprecated = pgTable(
  "Vote",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => messageDeprecated.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type VoteDeprecated = InferSelectModel<typeof voteDeprecated>;

export const vote = pgTable(
  "Vote_v2",
  {
    chatId: uuid("chatId")
      .notNull()
      .references(() => chat.id),
    messageId: uuid("messageId")
      .notNull()
      .references(() => message.id),
    isUpvoted: boolean("isUpvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatId, table.messageId] }),
    };
  }
);

export type Vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "Document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdAt: timestamp("createdAt").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdAt] }),
    };
  }
);

export type Document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "Suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentId: uuid("documentId").notNull(),
    documentCreatedAt: timestamp("documentCreatedAt").notNull(),
    originalText: text("originalText").notNull(),
    suggestedText: text("suggestedText").notNull(),
    description: text("description"),
    isResolved: boolean("isResolved").notNull().default(false),
    userId: uuid("userId")
      .notNull()
      .references(() => user.id),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentRef: foreignKey({
      columns: [table.documentId, table.documentCreatedAt],
      foreignColumns: [document.id, document.createdAt],
    }),
  })
);

export type Suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  "Stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatId: uuid("chatId").notNull(),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatRef: foreignKey({
      columns: [table.chatId],
      foreignColumns: [chat.id],
    }),
  })
);

export type Stream = InferSelectModel<typeof stream>;

// =============================================================================
// HEKMO BUSINESS PLATFORM SCHEMA
// =============================================================================

export const business = pgTable("Business", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  name: text("name").notNull(),
  nameAr: text("nameAr"),
  type: varchar("type", { length: 50 }).notNull().default("other"), // restaurant, cafe, salon, clinic, other
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  workingHours: text("workingHours"),
  workingHoursAr: text("workingHoursAr"),
  timezone: varchar("timezone", { length: 50 }).default("Asia/Riyadh"),
  language: varchar("language", { length: 10 }).default("ar"), // ar, en, both
  
  // WhatsApp Business API
  whatsappPhoneNumberId: text("whatsappPhoneNumberId"),
  whatsappBusinessAccountId: text("whatsappBusinessAccountId"),
  whatsappAccessToken: text("whatsappAccessToken"), // should be encrypted
  whatsappWebhookVerifyToken: text("whatsappWebhookVerifyToken"),
  whatsappConnected: boolean("whatsappConnected").default(false),
  whatsappConnectedAt: timestamp("whatsappConnectedAt"),
  
  // Subscription
  subscriptionPlan: varchar("subscriptionPlan", { length: 20 }).default("starter"), // starter, business, enterprise
  subscriptionStatus: varchar("subscriptionStatus", { length: 20 }).default("trial"), // trial, active, cancelled, expired
  trialEndsAt: timestamp("trialEndsAt"),
  stripeCustomerId: text("stripeCustomerId"),
  stripeSubscriptionId: text("stripeSubscriptionId"),
  
  // Usage
  messagesThisMonth: json("messagesThisMonth").default(0),
  messagesLimit: json("messagesLimit").default(1000),
  
  // Settings
  aiPersonality: varchar("aiPersonality", { length: 20 }).default("friendly"), // friendly, professional, casual
  autoReplyEnabled: boolean("autoReplyEnabled").default(true),
  handoffEnabled: boolean("handoffEnabled").default(true), // allow transferring to human
  
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Business = InferSelectModel<typeof business>;

export const businessKnowledge = pgTable("BusinessKnowledge", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  businessId: uuid("businessId")
    .notNull()
    .references(() => business.id),
  type: varchar("type", { length: 20 }).notNull(), // menu, faq, pricing, info, custom
  title: text("title").notNull(),
  content: text("content").notNull(),
  contentAr: text("contentAr"),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type BusinessKnowledge = InferSelectModel<typeof businessKnowledge>;

export const conversation = pgTable("Conversation", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  businessId: uuid("businessId")
    .notNull()
    .references(() => business.id),
  customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
  customerName: text("customerName"),
  customerWaId: text("customerWaId"), // WhatsApp ID
  status: varchar("status", { length: 20 }).default("active"), // active, resolved, handed_off
  handedOffTo: uuid("handedOffTo").references(() => user.id),
  handedOffAt: timestamp("handedOffAt"),
  lastMessageAt: timestamp("lastMessageAt").defaultNow(),
  messagesCount: json("messagesCount").default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export type Conversation = InferSelectModel<typeof conversation>;

export const conversationMessage = pgTable("ConversationMessage", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  conversationId: uuid("conversationId")
    .notNull()
    .references(() => conversation.id),
  businessId: uuid("businessId")
    .notNull()
    .references(() => business.id),
  waMessageId: text("waMessageId"), // WhatsApp message ID for deduplication
  role: varchar("role", { length: 20 }).notNull(), // customer, ai, human
  content: text("content").notNull(),
  contentType: varchar("contentType", { length: 20 }).default("text"), // text, image, audio, document
  mediaUrl: text("mediaUrl"),
  metadata: json("metadata").default({}),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

export type ConversationMessage = InferSelectModel<typeof conversationMessage>;
