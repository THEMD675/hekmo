// Slack Integration for Hekmo
// Allows users to interact with Hekmo via Slack

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET;

interface SlackMessage {
  channel: string;
  text: string;
  user?: string;
  thread_ts?: string;
}

interface SlackUser {
  id: string;
  name: string;
  real_name?: string;
}

// Verify Slack request signature
export function verifySlackRequest(
  signature: string,
  timestamp: string,
  body: string
): boolean {
  if (!SLACK_SIGNING_SECRET) {
    return false;
  }

  const crypto = require("node:crypto");
  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature = `v0=${crypto
    .createHmac("sha256", SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest("hex")}`;

  return crypto.timingSafeEqual(
    Buffer.from(mySignature),
    Buffer.from(signature)
  );
}

// Send message to Slack channel
export async function sendSlackMessage(
  channel: string,
  text: string,
  threadTs?: string
): Promise<boolean> {
  if (!SLACK_BOT_TOKEN) {
    console.error("Slack bot token not configured");
    return false;
  }

  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
      },
      body: JSON.stringify({
        channel,
        text,
        thread_ts: threadTs,
      }),
    });

    const data = await response.json();
    return data.ok === true;
  } catch (error) {
    console.error("Slack message error:", error);
    return false;
  }
}

// Handle incoming Slack message
export async function handleSlackMessage(
  message: SlackMessage
): Promise<string> {
  // Process message with Hekmo AI
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: message.text }],
      model: "hekmo",
    }),
  });

  if (!response.ok) {
    return "عذراً، حدث خطأ أثناء معالجة رسالتك.";
  }

  const data = await response.json();
  return data.content || "لم أتمكن من فهم رسالتك.";
}

// Handle Slack slash command
export async function handleSlashCommand(
  command: string,
  text: string,
  userId: string
): Promise<string> {
  switch (command) {
    case "/hekmo":
      return handleSlackMessage({ channel: "", text, user: userId });
    case "/hekmo-help":
      return `
🤖 *أوامر حكمو*

\`/hekmo [سؤالك]\` - اسأل حكمو أي سؤال
\`/hekmo-help\` - عرض هذه المساعدة
\`/hekmo-business\` - نصائح أعمال سريعة

*أمثلة:*
• \`/hekmo ما هو أفضل وقت للنوم؟\`
• \`/hekmo كيف أحسن تركيزي؟\`
      `.trim();
    default:
      return "أمر غير معروف";
  }
}

// Format response for Slack blocks
export function formatSlackResponse(text: string): object {
  return {
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "🤖 _Powered by Hekmo AI_",
          },
        ],
      },
    ],
  };
}
