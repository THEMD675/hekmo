import { randomBytes } from "node:crypto";
import { auth } from "@/app/(auth)/auth";

// API Key management for developers
// In production, store in database with proper encryption

interface ApiKey {
  id: string;
  name: string;
  key: string; // Only shown once on creation
  keyHash: string; // Stored hash
  createdAt: Date;
  lastUsed: Date | null;
  scopes: string[];
}

// In-memory store (use database in production)
const apiKeys = new Map<string, ApiKey[]>();

function generateApiKey(): string {
  const prefix = "hk_live_";
  const key = randomBytes(24).toString("base64url");
  return `${prefix}${key}`;
}

function hashKey(key: string): string {
  const crypto = require("node:crypto");
  return crypto.createHash("sha256").update(key).digest("hex");
}

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userKeys = apiKeys.get(session.user.id) || [];

  // Return keys without the actual key value (only show on creation)
  return Response.json({
    keys: userKeys.map((k) => ({
      id: k.id,
      name: k.name,
      keyPrefix: k.key.slice(0, 12) + "...",
      createdAt: k.createdAt,
      lastUsed: k.lastUsed,
      scopes: k.scopes,
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, scopes = ["read", "write"] } = await request.json();

    if (!name || typeof name !== "string") {
      return Response.json({ error: "اسم المفتاح مطلوب" }, { status: 400 });
    }

    const userKeys = apiKeys.get(session.user.id) || [];

    // Limit number of keys
    if (userKeys.length >= 5) {
      return Response.json(
        { error: "تم الوصول للحد الأقصى من المفاتيح (5)" },
        { status: 400 }
      );
    }

    const key = generateApiKey();
    const newKey: ApiKey = {
      id: crypto.randomUUID(),
      name,
      key, // Will be returned only once
      keyHash: hashKey(key),
      createdAt: new Date(),
      lastUsed: null,
      scopes,
    };

    userKeys.push(newKey);
    apiKeys.set(session.user.id, userKeys);

    return Response.json({
      id: newKey.id,
      name: newKey.name,
      key, // Only returned on creation!
      scopes: newKey.scopes,
      message: "احفظ هذا المفتاح في مكان آمن. لن يظهر مرة أخرى.",
    });
  } catch (error) {
    console.error("API key creation error:", error);
    return Response.json({ error: "فشل إنشاء المفتاح" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { keyId } = await request.json();

    if (!keyId) {
      return Response.json({ error: "معرف المفتاح مطلوب" }, { status: 400 });
    }

    const userKeys = apiKeys.get(session.user.id) || [];
    const filtered = userKeys.filter((k) => k.id !== keyId);

    if (filtered.length === userKeys.length) {
      return Response.json({ error: "المفتاح غير موجود" }, { status: 404 });
    }

    apiKeys.set(session.user.id, filtered);

    return Response.json({ success: true, message: "تم حذف المفتاح" });
  } catch (error) {
    console.error("API key deletion error:", error);
    return Response.json({ error: "فشل حذف المفتاح" }, { status: 500 });
  }
}

// Verify API key (for middleware use)
export function verifyApiKey(key: string): { userId: string; scopes: string[] } | null {
  const keyHash = hashKey(key);

  for (const [userId, userKeys] of apiKeys.entries()) {
    const found = userKeys.find((k) => k.keyHash === keyHash);
    if (found) {
      // Update last used
      found.lastUsed = new Date();
      return { userId, scopes: found.scopes };
    }
  }

  return null;
}
