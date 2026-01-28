import { verifyDiscordRequest, handleDiscordInteraction } from "@/lib/integrations/discord";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-signature-ed25519") || "";
  const timestamp = request.headers.get("x-signature-timestamp") || "";

  // Verify request
  if (!verifyDiscordRequest(signature, timestamp, body)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  try {
    const interaction = JSON.parse(body);
    const response = await handleDiscordInteraction(interaction);
    return Response.json(response);
  } catch (error) {
    console.error("Discord interaction error:", error);
    return Response.json(
      { type: 4, data: { content: "حدث خطأ" } },
      { status: 500 }
    );
  }
}
