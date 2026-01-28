import { notFound } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { getChatById, getMessagesByChatId } from "@/lib/db/queries";
import { Chat } from "@/components/chat";

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return notFound();
  }

  const chat = await getChatById({ id });

  if (!chat) {
    return notFound();
  }

  // Verify ownership
  if (chat.userId !== session.user.id) {
    return notFound();
  }

  const messages = await getMessagesByChatId({ id });

  return (
    <Chat
      id={id}
      initialMessages={messages as Parameters<typeof Chat>[0]["initialMessages"]}
      initialChatModel={chat.model || "gpt-4o-mini"}
      initialVisibilityType={(chat.visibility || "private") as "public" | "private"}
      isReadonly={false}
      autoResume={true}
    />
  );
}

export async function generateMetadata({ params }: ChatPageProps) {
  const { id } = await params;
  const chat = await getChatById({ id });

  return {
    title: chat?.title || "محادثة - حكمو",
    description: "محادثة ذكية مع حكمو",
  };
}
