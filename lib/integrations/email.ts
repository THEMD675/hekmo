// Email Integration for Hekmo
// Uses Gmail API for reading/sending emails

const GMAIL_API = "https://gmail.googleapis.com/gmail/v1";

interface EmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
    body?: { data?: string };
    parts?: Array<{
      mimeType: string;
      body: { data?: string };
    }>;
  };
}

interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  html?: boolean;
}

// Get Gmail access token
async function getGmailAccessToken(userId: string): Promise<string | null> {
  // In production, fetch from database
  return process.env.GMAIL_ACCESS_TOKEN || null;
}

// List recent emails
export async function listEmails(
  userId: string,
  options: {
    query?: string;
    maxResults?: number;
    labelIds?: string[];
  } = {}
): Promise<EmailMessage[]> {
  const accessToken = await getGmailAccessToken(userId);
  if (!accessToken) {
    throw new Error("Email not connected");
  }

  const params = new URLSearchParams({
    maxResults: String(options.maxResults || 10),
  });

  if (options.query) {
    params.set("q", options.query);
  }

  if (options.labelIds) {
    options.labelIds.forEach((id) => params.append("labelIds", id));
  }

  const response = await fetch(
    `${GMAIL_API}/users/me/messages?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch emails");
  }

  const data = await response.json();
  const messages = data.messages || [];

  // Fetch full message details
  const fullMessages = await Promise.all(
    messages.slice(0, 10).map((m: { id: string }) => getEmail(userId, m.id))
  );

  return fullMessages.filter(Boolean) as EmailMessage[];
}

// Get single email
export async function getEmail(
  userId: string,
  messageId: string
): Promise<EmailMessage | null> {
  const accessToken = await getGmailAccessToken(userId);
  if (!accessToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${GMAIL_API}/users/me/messages/${messageId}?format=full`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch {
    return null;
  }
}

// Send email
export async function sendEmail(
  userId: string,
  options: SendEmailOptions
): Promise<boolean> {
  const accessToken = await getGmailAccessToken(userId);
  if (!accessToken) {
    throw new Error("Email not connected");
  }

  const mimeType = options.html ? "text/html" : "text/plain";
  const message = [
    `To: ${options.to}`,
    `Subject: =?UTF-8?B?${Buffer.from(options.subject).toString("base64")}?=`,
    `Content-Type: ${mimeType}; charset=utf-8`,
    "",
    options.body,
  ].join("\r\n");

  const encodedMessage = Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const response = await fetch(`${GMAIL_API}/users/me/messages/send`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: encodedMessage }),
  });

  return response.ok;
}

// Parse email headers
export function parseEmailHeaders(
  headers: Array<{ name: string; value: string }>
): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const header of headers) {
    result[header.name.toLowerCase()] = header.value;
  }

  return result;
}

// Decode base64 email body
export function decodeEmailBody(data: string | undefined): string {
  if (!data) return "";
  
  const decoded = Buffer.from(
    data.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf-8");

  return decoded;
}

// Extract email body from message
export function extractEmailBody(message: EmailMessage): string {
  // Try to get text/plain body first
  if (message.payload.body?.data) {
    return decodeEmailBody(message.payload.body.data);
  }

  // Check parts for text content
  if (message.payload.parts) {
    const textPart = message.payload.parts.find(
      (p) => p.mimeType === "text/plain"
    );
    if (textPart?.body?.data) {
      return decodeEmailBody(textPart.body.data);
    }

    const htmlPart = message.payload.parts.find(
      (p) => p.mimeType === "text/html"
    );
    if (htmlPart?.body?.data) {
      // Strip HTML for plain text
      const html = decodeEmailBody(htmlPart.body.data);
      return html.replace(/<[^>]*>/g, "");
    }
  }

  return message.snippet || "";
}

// Search for health-related emails
export async function searchHealthEmails(userId: string): Promise<EmailMessage[]> {
  const healthKeywords = [
    "تقرير طبي",
    "موعد طبيب",
    "نتائج تحاليل",
    "وصفة طبية",
    "تأمين صحي",
    "medical report",
    "doctor appointment",
    "lab results",
  ];

  const query = healthKeywords.map((k) => `"${k}"`).join(" OR ");
  
  return listEmails(userId, { query, maxResults: 20 });
}

// Send health reminder email
export async function sendHealthReminderEmail(
  userId: string,
  to: string,
  reminder: { title: string; time: Date; notes?: string }
): Promise<boolean> {
  const formattedTime = reminder.time.toLocaleString("ar-SA", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const body = `
مرحباً،

هذا تذكير بموعدك الصحي:

📅 ${reminder.title}
🕐 ${formattedTime}
${reminder.notes ? `📝 ملاحظات: ${reminder.notes}` : ""}

مع تحيات حكمو
  `.trim();

  return sendEmail(userId, {
    to,
    subject: `تذكير: ${reminder.title}`,
    body,
  });
}
