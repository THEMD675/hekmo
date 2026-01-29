import { eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { db } from "@/lib/db/queries";
import { business } from "@/lib/db/schema";

// WhatsApp Business API connection
// See: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started

const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;

// Step 1: Redirect to Meta OAuth
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId");

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 });
  }

  if (!META_APP_ID) {
    return NextResponse.json(
      {
        error: "WhatsApp Business API not configured",
        message: "Set META_APP_ID and META_APP_SECRET in environment variables",
        configUrl: "https://developers.facebook.com/apps/",
      },
      { status: 503 }
    );
  }

  // Build OAuth URL
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://hekmo.ai"}/api/whatsapp/callback`;
  const state = Buffer.from(
    JSON.stringify({ businessId, userId: session.user.id })
  ).toString("base64");

  const oauthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
  oauthUrl.searchParams.set("client_id", META_APP_ID);
  oauthUrl.searchParams.set("redirect_uri", redirectUri);
  oauthUrl.searchParams.set("state", state);
  oauthUrl.searchParams.set(
    "scope",
    "whatsapp_business_management,whatsapp_business_messaging"
  );
  oauthUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(oauthUrl.toString());
}

// Step 2: Handle OAuth callback
export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing code or state" },
        { status: 400 }
      );
    }

    // Decode state
    const stateData = JSON.parse(Buffer.from(state, "base64").toString());
    const { businessId, userId } = stateData;

    // Verify user owns the business
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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

    if (!META_APP_ID || !META_APP_SECRET) {
      return NextResponse.json(
        { error: "WhatsApp not configured" },
        { status: 503 }
      );
    }

    // Exchange code for access token
    const tokenUrl = new URL(
      "https://graph.facebook.com/v18.0/oauth/access_token"
    );
    tokenUrl.searchParams.set("client_id", META_APP_ID);
    tokenUrl.searchParams.set("client_secret", META_APP_SECRET);
    tokenUrl.searchParams.set("code", code);
    tokenUrl.searchParams.set(
      "redirect_uri",
      `${process.env.NEXT_PUBLIC_APP_URL || "https://hekmo.ai"}/api/whatsapp/callback`
    );

    const tokenResponse = await fetch(tokenUrl.toString());
    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("[WhatsApp Connect] Token error:", tokenData.error);
      return NextResponse.json(
        { error: "Failed to get access token" },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token;

    // Get WhatsApp Business Account ID
    const wabaidResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/businesses?access_token=${accessToken}`
    );
    const wabaidData = await wabaidResponse.json();

    if (!wabaidData.data?.[0]) {
      return NextResponse.json(
        { error: "No WhatsApp Business Account found" },
        { status: 400 }
      );
    }

    const waBusinessAccountId = wabaidData.data[0].id;

    // Get phone number ID
    const phoneResponse = await fetch(
      `https://graph.facebook.com/v18.0/${waBusinessAccountId}/phone_numbers?access_token=${accessToken}`
    );
    const phoneData = await phoneResponse.json();

    const phoneNumberId = phoneData.data?.[0]?.id;

    // Update business with WhatsApp credentials
    await db
      .update(business)
      .set({
        whatsappAccessToken: accessToken,
        whatsappBusinessAccountId: waBusinessAccountId,
        whatsappPhoneNumberId: phoneNumberId || null,
        whatsappConnected: true,
        whatsappConnectedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(business.id, businessId));

    return NextResponse.json({
      success: true,
      message: "WhatsApp connected successfully",
      waBusinessAccountId,
      phoneNumberId,
    });
  } catch (error) {
    console.error("[WhatsApp Connect] Error:", error);
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}

// Disconnect WhatsApp
export async function DELETE(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return NextResponse.json(
        { error: "businessId required" },
        { status: 400 }
      );
    }

    // Verify ownership
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

    // Clear WhatsApp credentials
    await db
      .update(business)
      .set({
        whatsappAccessToken: null,
        whatsappBusinessAccountId: null,
        whatsappPhoneNumberId: null,
        whatsappConnected: false,
        whatsappConnectedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(business.id, businessId));

    return NextResponse.json({
      success: true,
      message: "WhatsApp disconnected",
    });
  } catch (error) {
    console.error("[WhatsApp Disconnect] Error:", error);
    return NextResponse.json({ error: "Disconnect failed" }, { status: 500 });
  }
}
