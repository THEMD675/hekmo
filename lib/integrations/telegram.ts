// Telegram Integration for Hekmo
// Uses Telegram Bot API

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      first_name: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    data: string;
    message: {
      chat: { id: number };
    };
  };
}

// Send Telegram message
export async function sendTelegramMessage(
  chatId: number,
  text: string,
  options?: {
    parseMode?: "HTML" | "Markdown";
    replyMarkup?: object;
  }
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("Telegram bot token not configured");
    return false;
  }

  try {
    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parseMode || "HTML",
        reply_markup: options?.replyMarkup,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Telegram message error:", error);
    return false;
  }
}

// Send typing indicator
export async function sendTelegramTyping(chatId: number): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN) return;

  await fetch(`${TELEGRAM_API}/sendChatAction`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      action: "typing",
    }),
  });
}

// Handle Telegram update
export async function handleTelegramUpdate(
  update: TelegramUpdate
): Promise<void> {
  // Handle text message
  if (update.message?.text) {
    const chatId = update.message.chat.id;
    const text = update.message.text;
    const username = update.message.from.first_name;

    // Handle commands
    if (text.startsWith("/")) {
      await handleTelegramCommand(chatId, text, username);
      return;
    }

    // Process with AI
    await sendTelegramTyping(chatId);
    const response = await getHekmoResponse(text);
    await sendTelegramMessage(chatId, response);
  }

  // Handle callback query
  if (update.callback_query) {
    const chatId = update.callback_query.message.chat.id;
    const data = update.callback_query.data;

    await handleCallbackQuery(chatId, data);

    // Acknowledge callback
    await fetch(`${TELEGRAM_API}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: update.callback_query.id }),
    });
  }
}

// Handle Telegram commands
async function handleTelegramCommand(
  chatId: number,
  command: string,
  username: string
): Promise<void> {
  const cmd = command.split(" ")[0].toLowerCase();
  const args = command.slice(cmd.length).trim();

  switch (cmd) {
    case "/start":
      await sendTelegramMessage(
        chatId,
        `مرحباً ${username}! 👋\n\nأنا <b>حكمو</b>، مساعدك الصحي الذكي.\n\nيمكنك سؤالي أي شيء عن الصحة والعافية.`,
        {
          replyMarkup: {
            inline_keyboard: [
              [{ text: "💡 أمثلة", callback_data: "examples" }],
              [{ text: "❓ مساعدة", callback_data: "help" }],
            ],
          },
        }
      );
      break;

    case "/help":
      await sendTelegramMessage(
        chatId,
        "<b>🤖 أوامر حكمو</b>\n\n/start - بدء المحادثة\n/help - عرض المساعدة\n/business - نصيحة صحية\n\nأو اكتب سؤالك مباشرة!"
      );
      break;

    case "/business": {
      const tips = [
        "💧 اشرب 8 أكواب ماء يومياً",
        "🏃 مارس الرياضة 30 دقيقة يومياً",
        "😴 نم 7-8 ساعات كل ليلة",
        "🥗 تناول الخضروات والفواكه",
        "🧘 خصص وقتاً للاسترخاء",
      ];
      const tip = tips[Math.floor(Math.random() * tips.length)];
      await sendTelegramMessage(chatId, `<b>نصيحة اليوم:</b>\n\n${tip}`);
      break;
    }

    default:
      if (args) {
        await sendTelegramTyping(chatId);
        const response = await getHekmoResponse(args);
        await sendTelegramMessage(chatId, response);
      } else {
        await sendTelegramMessage(
          chatId,
          "أمر غير معروف. اكتب /help للمساعدة."
        );
      }
  }
}

// Handle callback query
async function handleCallbackQuery(
  chatId: number,
  data: string
): Promise<void> {
  switch (data) {
    case "examples":
      await sendTelegramMessage(
        chatId,
        "<b>أمثلة على الأسئلة:</b>\n\n• ما هو أفضل وقت للنوم؟\n• كيف أحسن تركيزي؟\n• ما هي فوائد الصيام المتقطع؟\n• كيف أتخلص من التوتر?"
      );
      break;

    case "help":
      await sendTelegramMessage(
        chatId,
        "<b>كيف تستخدم حكمو؟</b>\n\n1. اكتب سؤالك مباشرة\n2. انتظر الرد\n3. يمكنك المتابعة بأسئلة إضافية\n\n<i>حكمو يتذكر سياق محادثتك!</i>"
      );
      break;
  }
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
      return "عذراً، حدث خطأ. يرجى المحاولة لاحقاً.";
    }

    const data = await response.json();
    return data.content || "لم أتمكن من فهم سؤالك.";
  } catch {
    return "عذراً، الخدمة غير متاحة حالياً.";
  }
}

// Set webhook for Telegram bot
export async function setTelegramWebhook(webhookUrl: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) return false;

  try {
    const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    });

    return response.ok;
  } catch {
    return false;
  }
}
