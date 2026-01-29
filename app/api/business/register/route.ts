import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/queries";
import { business } from "@/lib/db/schema";
import { auth } from "@/app/(auth)/auth";

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
    const { name, nameAr, type, phone, workingHours, workingHoursAr, address } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "name and type are required" },
        { status: 400 }
      );
    }

    // Calculate trial end date (14 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Create business
    const [newBusiness] = await db
      .insert(business)
      .values({
        userId: session.user.id,
        name,
        nameAr,
        type,
        phone,
        workingHours,
        workingHoursAr,
        address,
        trialEndsAt,
        subscriptionStatus: "trial",
        subscriptionPlan: "starter",
      })
      .returning();

    return NextResponse.json({
      success: true,
      business: newBusiness,
    });

  } catch (error) {
    console.error("[Business Register] Error:", error);
    return NextResponse.json(
      { error: "Failed to register business" },
      { status: 500 }
    );
  }
}
