import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { business, businessKnowledge } from "@/lib/db/schema";

// GET - Fetch knowledge for a business
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId required" },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.id, businessId))
      .limit(1);

    if (!userBusiness || userBusiness.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    const knowledge = await db
      .select()
      .from(businessKnowledge)
      .where(eq(businessKnowledge.businessId, businessId));

    return NextResponse.json({ knowledge });
  } catch (error) {
    console.error("[Knowledge GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge" },
      { status: 500 }
    );
  }
}

// POST - Add knowledge to a business
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { businessId, type, title, content, contentAr } = body;

    if (!businessId || !type || !title || !content) {
      return NextResponse.json(
        { error: "businessId, type, title, and content are required" },
        { status: 400 }
      );
    }

    // Verify user owns this business
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.id, businessId))
      .limit(1);

    if (!userBusiness || userBusiness.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 }
      );
    }

    // Insert knowledge
    const [newKnowledge] = await db
      .insert(businessKnowledge)
      .values({
        businessId,
        type,
        title,
        content,
        contentAr,
      })
      .returning();

    return NextResponse.json({
      success: true,
      knowledge: newKnowledge,
    });
  } catch (error) {
    console.error("[Knowledge POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to add knowledge" },
      { status: 500 }
    );
  }
}

// DELETE - Remove knowledge
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const knowledgeId = searchParams.get("id");

    if (!knowledgeId) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    // Get knowledge item
    const [knowledge] = await db
      .select()
      .from(businessKnowledge)
      .where(eq(businessKnowledge.id, knowledgeId))
      .limit(1);

    if (!knowledge) {
      return NextResponse.json(
        { error: "Knowledge not found" },
        { status: 404 }
      );
    }

    // Verify user owns the business
    const [userBusiness] = await db
      .select()
      .from(business)
      .where(eq(business.id, knowledge.businessId))
      .limit(1);

    if (!userBusiness || userBusiness.userId !== session.user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Delete
    await db
      .delete(businessKnowledge)
      .where(eq(businessKnowledge.id, knowledgeId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Knowledge DELETE] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge" },
      { status: 500 }
    );
  }
}
