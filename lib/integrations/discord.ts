// Discord Integration for Hekmo
// Allows users to interact with Hekmo via Discord

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;

interface DiscordInteraction {
  type: number;
  data?: {
    name: string;
    options?: Array<{ name: string; value: string }>;
  };
  member?: {
    user: { id: string; username: string };
  };
  channel_id: string;
}

// Verify Discord request
export function verifyDiscordRequest(
  signature: string,
  timestamp: string,
  body: string
): boolean {
  if (!DISCORD_PUBLIC_KEY) {
    return false;
  }

  try {
    const crypto = require("node:crypto");
    const message = Buffer.from(timestamp + body);
    const sig = Buffer.from(signature, "hex");
    const key = Buffer.from(DISCORD_PUBLIC_KEY, "hex");

    return crypto.verify(null, message, key, sig);
  } catch {
    return false;
  }
}

// Send message to Discord channel
export async function sendDiscordMessage(
  channelId: string,
  content: string
): Promise<boolean> {
  if (!DISCORD_BOT_TOKEN) {
    console.error("Discord bot token not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${channelId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        },
        body: JSON.stringify({ content }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("Discord message error:", error);
    return false;
  }
}

// Handle Discord interaction
export async function handleDiscordInteraction(
  interaction: DiscordInteraction
): Promise<object> {
  // Ping response
  if (interaction.type === 1) {
    return { type: 1 };
  }

  // Command response
  if (interaction.type === 2 && interaction.data) {
    const { name, options } = interaction.data;

    if (name === "hekmo") {
      const question = options?.find((o) => o.name === "question")?.value;

      if (!question) {
        return {
          type: 4,
          data: { content: "يرجى كتابة سؤالك بعد الأمر" },
        };
      }

      // Get AI response
      const aiResponse = await getHekmoResponse(question);

      return {
        type: 4,
        data: {
          content: aiResponse,
          embeds: [
            {
              color: 0x10_b9_81, // Green
              footer: { text: "🤖 Powered by Hekmo AI" },
            },
          ],
        },
      };
    }

    if (name === "help") {
      return {
        type: 4,
        data: {
          embeds: [
            {
              title: "🤖 أوامر حكمو",
              description: "مساعدك الصحي الذكي",
              color: 0x10_b9_81,
              fields: [
                {
                  name: "/hekmo [سؤال]",
                  value: "اسأل حكمو أي سؤال صحي",
                },
                {
                  name: "/help",
                  value: "عرض هذه المساعدة",
                },
              ],
            },
          ],
        },
      };
    }
  }

  return { type: 4, data: { content: "أمر غير معروف" } };
}

// Get response from Hekmo AI
async function getHekmoResponse(question: string): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/chat`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: question }],
          model: "hekmo",
        }),
      }
    );

    if (!response.ok) {
      return "عذراً، حدث خطأ أثناء معالجة سؤالك.";
    }

    const data = await response.json();
    return data.content || "لم أتمكن من الإجابة على سؤالك.";
  } catch {
    return "عذراً، الخدمة غير متاحة حالياً.";
  }
}

// Register Discord slash commands
export async function registerDiscordCommands(
  applicationId: string
): Promise<void> {
  if (!DISCORD_BOT_TOKEN) {
    return;
  }

  const commands = [
    {
      name: "hekmo",
      description: "اسأل حكمو سؤالاً",
      options: [
        {
          name: "question",
          description: "سؤالك",
          type: 3, // STRING
          required: true,
        },
      ],
    },
    {
      name: "help",
      description: "عرض المساعدة",
    },
  ];

  await fetch(
    `https://discord.com/api/v10/applications/${applicationId}/commands`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
      },
      body: JSON.stringify(commands),
    }
  );
}
