import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { user, chat, message, document, vote, suggestion, business, businessKnowledge, conversation, conversationMessage } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { confirmation } = await request.json();

    // Require explicit confirmation
    if (confirmation !== "DELETE") {
      return Response.json(
        { error: "التأكيد غير صحيح" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    console.log("[Account Delete] Deleting user:", userId);

    // Get user's chat IDs for cascade deletion
    const userChats = await db
      .select({ id: chat.id })
      .from(chat)
      .where(eq(chat.userId, userId));
    
    const chatIds = userChats.map(c => c.id);

    // Get user's business IDs
    const userBusinesses = await db
      .select({ id: business.id })
      .from(business)
      .where(eq(business.userId, userId));
    
    const businessIds = userBusinesses.map(b => b.id);

    // Delete in order (respecting foreign keys)
    
    // 1. Delete votes on user's messages
    if (chatIds.length > 0) {
      await db.delete(vote).where(inArray(vote.chatId, chatIds));
    }

    // 2. Delete messages in user's chats
    if (chatIds.length > 0) {
      await db.delete(message).where(inArray(message.chatId, chatIds));
    }

    // 3. Delete user's chats
    await db.delete(chat).where(eq(chat.userId, userId));

    // 4. Delete suggestions on user's documents
    await db.delete(suggestion).where(eq(suggestion.userId, userId));

    // 5. Delete user's documents
    await db.delete(document).where(eq(document.userId, userId));

    // 6. Delete business-related data
    if (businessIds.length > 0) {
      // Delete conversation messages
      await db.delete(conversationMessage).where(inArray(conversationMessage.businessId, businessIds));
      
      // Delete conversations
      await db.delete(conversation).where(inArray(conversation.businessId, businessIds));
      
      // Delete business knowledge
      await db.delete(businessKnowledge).where(inArray(businessKnowledge.businessId, businessIds));
    }

    // 7. Delete user's businesses
    await db.delete(business).where(eq(business.userId, userId));

    // 8. Delete user account
    await db.delete(user).where(eq(user.id, userId));

    console.log("[Account Delete] Successfully deleted user:", userId);

    return Response.json({
      success: true,
      message: "تم حذف الحساب بنجاح",
    });
  } catch (error) {
    console.error("[Account Delete] Error:", error);
    return Response.json(
      { error: "فشل حذف الحساب" },
      { status: 500 }
    );
  }
}

// Export user data (GDPR)
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // Get user's chats
    const userChats = await db
      .select()
      .from(chat)
      .where(eq(chat.userId, userId));

    // Get messages from user's chats
    const chatIds = userChats.map(c => c.id);
    let userMessages: typeof message.$inferSelect[] = [];
    if (chatIds.length > 0) {
      userMessages = await db
        .select()
        .from(message)
        .where(inArray(message.chatId, chatIds));
    }

    // Get user's documents
    const userDocuments = await db
      .select()
      .from(document)
      .where(eq(document.userId, userId));

    // Get user's businesses
    const userBusinesses = await db
      .select()
      .from(business)
      .where(eq(business.userId, userId));

    // Get business knowledge
    const businessIds = userBusinesses.map(b => b.id);
    let userKnowledge: typeof businessKnowledge.$inferSelect[] = [];
    if (businessIds.length > 0) {
      userKnowledge = await db
        .select()
        .from(businessKnowledge)
        .where(inArray(businessKnowledge.businessId, businessIds));
    }

    // Collect all user data
    const userData = {
      account: {
        id: userId,
        email: session.user.email,
        name: session.user.name,
      },
      chats: userChats.map(c => ({
        id: c.id,
        title: c.title,
        createdAt: c.createdAt,
        visibility: c.visibility,
      })),
      messages: userMessages.map(m => ({
        id: m.id,
        chatId: m.chatId,
        role: m.role,
        parts: m.parts,
        createdAt: m.createdAt,
      })),
      documents: userDocuments.map(d => ({
        id: d.id,
        title: d.title,
        content: d.content,
        kind: d.kind,
        createdAt: d.createdAt,
      })),
      businesses: userBusinesses.map(b => ({
        id: b.id,
        name: b.name,
        type: b.type,
        createdAt: b.createdAt,
      })),
      businessKnowledge: userKnowledge.map(k => ({
        id: k.id,
        type: k.type,
        title: k.title,
        content: k.content,
      })),
      exportedAt: new Date().toISOString(),
    };

    // Return as downloadable JSON
    return new Response(JSON.stringify(userData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="hekmo-data-export-${userId}.json"`,
      },
    });
  } catch (error) {
    console.error("[Data Export] Error:", error);
    return Response.json(
      { error: "فشل تصدير البيانات" },
      { status: 500 }
    );
  }
}
