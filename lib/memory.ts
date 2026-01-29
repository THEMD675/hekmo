// Long-term Memory for Hekmo using Mem0 pattern
// Stores user preferences, facts, and context across conversations

import { MemoryClient } from "mem0ai";

const MEM0_API_KEY = process.env.MEM0_API_KEY;

// Initialize Mem0 client
function getMemoryClient() {
  if (!MEM0_API_KEY) {
    return null;
  }
  return new MemoryClient({ apiKey: MEM0_API_KEY });
}

export interface Memory {
  id: string;
  content: string;
  category: string;
  createdAt: Date;
}

// Add a memory for a user
export async function addMemory({
  userId,
  content,
  category = "general",
}: {
  userId: string;
  content: string;
  category?: string;
}): Promise<Memory | null> {
  const client = getMemoryClient();

  if (!client) {
    // Fallback: Store in local memory map (for demo)
    console.log(`[Memory] Would store for ${userId}: ${content}`);
    return null;
  }

  try {
    const result = await client.add([{ role: "user", content }], {
      user_id: userId,
      metadata: { category },
    });

    // Handle both array and object response types
    const resultId = Array.isArray(result)
      ? result[0]?.id || crypto.randomUUID()
      : (result as any).id || crypto.randomUUID();

    return {
      id: resultId,
      content,
      category,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Memory add error:", error);
    return null;
  }
}

// Search memories for a user
export async function searchMemories({
  userId,
  query,
  limit = 10,
}: {
  userId: string;
  query: string;
  limit?: number;
}): Promise<Memory[]> {
  const client = getMemoryClient();

  if (!client) {
    return [];
  }

  try {
    const results = await client.search(query, {
      user_id: userId,
      limit,
    });

    return (results as any[]).map((r) => ({
      id: r.id || crypto.randomUUID(),
      content: r.memory || r.content || "",
      category: r.metadata?.category || "general",
      createdAt: new Date(r.created_at || Date.now()),
    }));
  } catch (error) {
    console.error("Memory search error:", error);
    return [];
  }
}

// Get all memories for a user
export async function getAllMemories({
  userId,
}: {
  userId: string;
}): Promise<Memory[]> {
  const client = getMemoryClient();

  if (!client) {
    return [];
  }

  try {
    const results = await client.getAll({ user_id: userId });

    return (results as any[]).map((r) => ({
      id: r.id || crypto.randomUUID(),
      content: r.memory || r.content || "",
      category: r.metadata?.category || "general",
      createdAt: new Date(r.created_at || Date.now()),
    }));
  } catch (error) {
    console.error("Memory get all error:", error);
    return [];
  }
}

// Delete a specific memory
export async function deleteMemory({
  memoryId,
}: {
  memoryId: string;
}): Promise<boolean> {
  const client = getMemoryClient();

  if (!client) {
    return false;
  }

  try {
    await client.delete(memoryId);
    return true;
  } catch (error) {
    console.error("Memory delete error:", error);
    return false;
  }
}

// Extract facts from conversation to store
export function extractMemorableInfo(message: string): string[] {
  const patterns = [
    // Personal info patterns
    /(?:اسمي|انا|أنا)\s+(.+?)(?:\.|$)/gi,
    /(?:my name is|i am|i'm)\s+(.+?)(?:\.|$)/gi,
    // Preferences
    /(?:أفضل|احب|أحب)\s+(.+?)(?:\.|$)/gi,
    /(?:i prefer|i like|i love)\s+(.+?)(?:\.|$)/gi,
    // Health info
    /(?:عندي|لدي)\s+(.+?)(?:\.|$)/gi,
    /(?:i have|i suffer from)\s+(.+?)(?:\.|$)/gi,
    // Goals
    /(?:هدفي|أريد|اريد)\s+(.+?)(?:\.|$)/gi,
    /(?:my goal is|i want to)\s+(.+?)(?:\.|$)/gi,
  ];

  const facts: string[] = [];

  for (const pattern of patterns) {
    const matches = message.matchAll(pattern);
    for (const match of matches) {
      if (match[1] && match[1].length > 3 && match[1].length < 200) {
        facts.push(match[0].trim());
      }
    }
  }

  return facts;
}

// Format memories as context for the AI
export function formatMemoriesAsContext(memories: Memory[]): string {
  if (memories.length === 0) return "";

  const grouped = memories.reduce(
    (acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m.content);
      return acc;
    },
    {} as Record<string, string[]>
  );

  let context = "## ذاكرة المستخدم\n\n";

  for (const [category, items] of Object.entries(grouped)) {
    context += `### ${category}\n`;
    for (const item of items) {
      context += `- ${item}\n`;
    }
    context += "\n";
  }

  return context;
}
