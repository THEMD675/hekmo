// Collaborative Chat for Hekmo
// Allows multiple users to participate in the same chat

import { generateUUID } from "@/lib/utils";

interface CollaborativeSession {
  id: string;
  chatId: string;
  creatorId: string;
  participants: Array<{
    id: string;
    name: string;
    email?: string;
    role: "owner" | "editor" | "viewer";
    joinedAt: Date;
  }>;
  settings: {
    allowEditing: boolean;
    allowInvites: boolean;
    expiresAt?: Date;
  };
  createdAt: Date;
}

// In-memory storage (use database in production)
const sessions = new Map<string, CollaborativeSession>();
const chatToSession = new Map<string, string>();

// Create a collaborative session
export function createCollaborativeSession(
  chatId: string,
  creatorId: string,
  creatorName: string
): CollaborativeSession {
  // Check if session already exists
  const existingSessionId = chatToSession.get(chatId);
  if (existingSessionId) {
    const existing = sessions.get(existingSessionId);
    if (existing) return existing;
  }

  const session: CollaborativeSession = {
    id: generateUUID(),
    chatId,
    creatorId,
    participants: [
      {
        id: creatorId,
        name: creatorName,
        role: "owner",
        joinedAt: new Date(),
      },
    ],
    settings: {
      allowEditing: true,
      allowInvites: true,
    },
    createdAt: new Date(),
  };

  sessions.set(session.id, session);
  chatToSession.set(chatId, session.id);

  return session;
}

// Get session by ID
export function getSession(sessionId: string): CollaborativeSession | null {
  return sessions.get(sessionId) || null;
}

// Get session by chat ID
export function getSessionByChatId(chatId: string): CollaborativeSession | null {
  const sessionId = chatToSession.get(chatId);
  if (!sessionId) return null;
  return sessions.get(sessionId) || null;
}

// Generate invite link
export function generateInviteLink(
  sessionId: string,
  role: "editor" | "viewer" = "viewer"
): string {
  const token = Buffer.from(`${sessionId}:${role}:${Date.now()}`).toString(
    "base64url"
  );
  return `${process.env.NEXT_PUBLIC_APP_URL}/join/${token}`;
}

// Parse invite link
export function parseInviteLink(
  token: string
): { sessionId: string; role: "editor" | "viewer" } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const [sessionId, role] = decoded.split(":");
    
    if (sessionId && (role === "editor" || role === "viewer")) {
      return { sessionId, role };
    }
    return null;
  } catch {
    return null;
  }
}

// Join session
export function joinSession(
  sessionId: string,
  userId: string,
  userName: string,
  role: "editor" | "viewer"
): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Check if already a participant
  const existing = session.participants.find((p) => p.id === userId);
  if (existing) return true;

  // Check if invites allowed
  if (!session.settings.allowInvites) return false;

  session.participants.push({
    id: userId,
    name: userName,
    role,
    joinedAt: new Date(),
  });

  return true;
}

// Leave session
export function leaveSession(sessionId: string, userId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Owner cannot leave
  if (session.creatorId === userId) return false;

  session.participants = session.participants.filter((p) => p.id !== userId);
  return true;
}

// Update participant role
export function updateParticipantRole(
  sessionId: string,
  requesterId: string,
  targetId: string,
  newRole: "editor" | "viewer"
): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Only owner can change roles
  const requester = session.participants.find((p) => p.id === requesterId);
  if (!requester || requester.role !== "owner") return false;

  const target = session.participants.find((p) => p.id === targetId);
  if (!target || target.role === "owner") return false;

  target.role = newRole;
  return true;
}

// Remove participant
export function removeParticipant(
  sessionId: string,
  requesterId: string,
  targetId: string
): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Only owner can remove
  const requester = session.participants.find((p) => p.id === requesterId);
  if (!requester || requester.role !== "owner") return false;

  // Cannot remove owner
  if (targetId === session.creatorId) return false;

  session.participants = session.participants.filter((p) => p.id !== targetId);
  return true;
}

// Update session settings
export function updateSessionSettings(
  sessionId: string,
  requesterId: string,
  settings: Partial<CollaborativeSession["settings"]>
): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Only owner can update settings
  if (session.creatorId !== requesterId) return false;

  session.settings = { ...session.settings, ...settings };
  return true;
}

// Delete session
export function deleteSession(sessionId: string, requesterId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;

  // Only owner can delete
  if (session.creatorId !== requesterId) return false;

  sessions.delete(sessionId);
  chatToSession.delete(session.chatId);
  return true;
}

// Check if user can edit
export function canEdit(sessionId: string, userId: string): boolean {
  const session = sessions.get(sessionId);
  if (!session) return false;
  if (!session.settings.allowEditing) return false;

  const participant = session.participants.find((p) => p.id === userId);
  return participant?.role === "owner" || participant?.role === "editor";
}

// Get active participants (for presence)
export function getActiveParticipants(
  sessionId: string
): CollaborativeSession["participants"] {
  const session = sessions.get(sessionId);
  return session?.participants || [];
}

// Broadcast update to participants (placeholder)
export async function broadcastUpdate(
  sessionId: string,
  event: {
    type: "message" | "typing" | "join" | "leave";
    userId: string;
    data?: unknown;
  }
): Promise<void> {
  // In production, use WebSocket or Server-Sent Events
  console.log(`[Collab] Broadcast to ${sessionId}:`, event);
}
