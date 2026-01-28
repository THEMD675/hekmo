import { auth, signOut } from "@/app/(auth)/auth";

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

    // Delete all user data (GDPR compliance)
    console.log("[Account Delete] Deleting user:", userId);

    // TODO: Delete from database
    // 1. Delete user's messages
    // await db.delete(messages).where(eq(messages.userId, userId));

    // 2. Delete user's chats
    // await db.delete(chats).where(eq(chats.userId, userId));

    // 3. Delete user's documents
    // await db.delete(documents).where(eq(documents.userId, userId));

    // 4. Delete user's memories
    // await db.delete(memories).where(eq(memories.userId, userId));

    // 5. Delete user account
    // await db.delete(users).where(eq(users.id, userId));

    // 6. Cancel any subscriptions
    // if (user.stripeCustomerId) {
    //   await stripe.subscriptions.cancel(user.stripeSubscriptionId);
    // }

    // Sign out the user
    // Note: This will be handled client-side after successful deletion

    return Response.json({
      success: true,
      message: "تم حذف الحساب بنجاح",
    });
  } catch (error) {
    console.error("Account deletion error:", error);
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

    // Collect all user data
    const userData = {
      account: {
        id: userId,
        email: session.user.email,
        name: session.user.name,
        createdAt: new Date().toISOString(),
      },
      chats: [], // TODO: Fetch from database
      messages: [], // TODO: Fetch from database
      documents: [], // TODO: Fetch from database
      preferences: {}, // TODO: Fetch from database
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
    console.error("Data export error:", error);
    return Response.json(
      { error: "فشل تصدير البيانات" },
      { status: 500 }
    );
  }
}
