import { handleTelegramUpdate } from "@/lib/integrations/telegram";

export async function POST(request: Request) {
  try {
    const update = await request.json();
    await handleTelegramUpdate(update);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return Response.json({ error: "Failed to process" }, { status: 500 });
  }
}
