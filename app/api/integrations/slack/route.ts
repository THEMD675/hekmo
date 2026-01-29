import {
  formatSlackResponse,
  handleSlackMessage,
  handleSlashCommand,
  verifySlackRequest,
} from "@/lib/integrations/slack";

export async function POST(request: Request) {
  const body = await request.text();
  const timestamp = request.headers.get("x-slack-request-timestamp") || "";
  const signature = request.headers.get("x-slack-signature") || "";

  // Verify request
  if (!verifySlackRequest(signature, timestamp, body)) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);

  // URL verification challenge
  if (payload.type === "url_verification") {
    return Response.json({ challenge: payload.challenge });
  }

  // Handle events
  if (payload.type === "event_callback") {
    const event = payload.event;

    // Ignore bot messages
    if (event.bot_id) {
      return Response.json({ ok: true });
    }

    // Handle message
    if (event.type === "message" || event.type === "app_mention") {
      const response = await handleSlackMessage({
        channel: event.channel,
        text: event.text,
        user: event.user,
        thread_ts: event.thread_ts,
      });

      return Response.json(formatSlackResponse(response));
    }
  }

  // Handle slash commands
  if (payload.command) {
    const response = await handleSlashCommand(
      payload.command,
      payload.text,
      payload.user_id
    );

    return Response.json(formatSlackResponse(response));
  }

  return Response.json({ ok: true });
}
