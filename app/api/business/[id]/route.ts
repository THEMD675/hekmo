import { desc, eq, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { business, businessKnowledge, conversation } from "@/lib/db/schema";

// GET - Fetch business details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get business
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.id, id))
      .limit(1);

    if (!userBusiness) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    if (userBusiness.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get stats
    const [stats] = await db
      .select({
        totalConversations: sql<number>`count(*)`,
      })
      .from(conversation)
      .where(eq(conversation.businessId, id));

    // Get recent conversations
    const recentConversations = await db
      .select()
      .from(conversation)
      .where(eq(conversation.businessId, id))
      .orderBy(desc(conversation.lastMessageAt))
      .limit(10);

    // Get knowledge count
    const [knowledgeStats] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(businessKnowledge)
      .where(eq(businessKnowledge.businessId, id));

    return NextResponse.json({
      business: userBusiness,
      stats: {
        totalConversations: stats?.totalConversations || 0,
        knowledgeItems: knowledgeStats?.count || 0,
      },
      recentConversations,
    });
  } catch (error) {
    console.error("[Business GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }
}

// PATCH - Update business
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Verify ownership
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.id, id))
      .limit(1);

    if (!userBusiness || userBusiness.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Update allowed fields
    const allowedFields = [
      "name",
      "nameAr",
      "type",
      "phone",
      "email",
      "address",
      "workingHours",
      "workingHoursAr",
      "timezone",
      "language",
      "aiPersonality",
      "autoReplyEnabled",
      "handoffEnabled",
    ];

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    const [updated] = await db
      .update(business)
      .set(updates)
      .where(eq(business.id, id))
      .returning();

    return NextResponse.json({ success: true, business: updated });
  } catch (error) {
    console.error("[Business PATCH] Error:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }
}
