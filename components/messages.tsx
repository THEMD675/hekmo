import type { UseChatHelpers } from "@ai-sdk/react";
import { ArrowDownIcon, Zap } from "lucide-react";
import { useMemo } from "react";
import { useMessages } from "@/hooks/use-messages";
import { useResponseTime } from "@/hooks/use-response-time";
import type { Vote } from "@/lib/db/schema";
import type { ChatMessage } from "@/lib/types";
import { useDataStream } from "./data-stream-provider";
import { Greeting } from "./greeting";
import { PreviewMessage, ThinkingMessage } from "./message";

// Claude-style message grouping - reduces visual clutter
type MessageGroup = {
  role: ChatMessage["role"];
  messages: ChatMessage[];
};

function groupConsecutiveMessages(messages: ChatMessage[]): MessageGroup[] {
  if (messages.length === 0) return [];
  
  const groups: MessageGroup[] = [];
  let currentGroup: MessageGroup = {
    role: messages[0].role,
    messages: [messages[0]],
  };
  
  for (let i = 1; i < messages.length; i++) {
    const message = messages[i];
    if (message.role === currentGroup.role) {
      currentGroup.messages.push(message);
    } else {
      groups.push(currentGroup);
      currentGroup = {
        role: message.role,
        messages: [message],
      };
    }
  }
  
  groups.push(currentGroup);
  return groups;
}

type MessagesProps = {
  addToolApprovalResponse: UseChatHelpers<ChatMessage>["addToolApprovalResponse"];
  chatId: string;
  status: UseChatHelpers<ChatMessage>["status"];
  votes: Vote[] | undefined;
  messages: ChatMessage[];
  setMessages: UseChatHelpers<ChatMessage>["setMessages"];
  regenerate: UseChatHelpers<ChatMessage>["regenerate"];
  isReadonly: boolean;
  isArtifactVisible: boolean;
  selectedModelId: string;
};

function PureMessages({
  addToolApprovalResponse,
  chatId,
  status,
  votes,
  messages,
  setMessages,
  regenerate,
  isReadonly,
  selectedModelId: _selectedModelId,
}: MessagesProps) {
  const {
    containerRef: messagesContainerRef,
    endRef: messagesEndRef,
    isAtBottom,
    scrollToBottom,
    hasSentMessage,
  } = useMessages({
    status,
  });

  useDataStream();

  // Track response time for speed indicator
  const responseTime = useResponseTime(status);

  // Claude-style message grouping for cleaner UI
  const messageGroups = useMemo(
    () => groupConsecutiveMessages(messages),
    [messages]
  );

  return (
    <div className="relative flex-1">
      <div
        className="absolute inset-0 touch-pan-y overflow-y-auto"
        ref={messagesContainerRef}
      >
        <div className="mx-auto flex min-w-0 max-w-4xl flex-col gap-4 px-2 py-4 md:gap-6 md:px-4">
          {messages.length === 0 && <Greeting />}

          {messageGroups.map((group, groupIndex) => (
            <div
              className="flex flex-col gap-1"
              key={`group-${groupIndex}-${group.role}`}
            >
              {group.messages.map((message, messageIndex) => {
                const globalIndex = messages.findIndex((m) => m.id === message.id);
                const isFirstInGroup = messageIndex === 0;
                const isLastInGroup = messageIndex === group.messages.length - 1;
                
                return (
                  <PreviewMessage
                    addToolApprovalResponse={addToolApprovalResponse}
                    chatId={chatId}
                    isFirstInGroup={isFirstInGroup}
                    isLastInGroup={isLastInGroup}
                    isLoading={
                      status === "streaming" && messages.length - 1 === globalIndex
                    }
                    isReadonly={isReadonly}
                    key={message.id}
                    message={message}
                    regenerate={regenerate}
                    requiresScrollPadding={
                      hasSentMessage && globalIndex === messages.length - 1
                    }
                    setMessages={setMessages}
                    vote={
                      votes
                        ? votes.find((vote) => vote.messageId === message.id)
                        : undefined
                    }
                  />
                );
              })}
            </div>
          ))}

          {status === "submitted" &&
            !messages.some((msg) =>
              msg.parts?.some(
                (part) => "state" in part && part.state === "approval-responded"
              )
            ) && <ThinkingMessage />}

          {/* Speed Indicator - shows after response completes */}
          {responseTime !== null && messages.length > 0 && status === "ready" && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground animate-in fade-in duration-300">
              <Zap className="h-3 w-3 text-primary" />
              <span>
                أجاب في {responseTime.toFixed(1)} ثانية
              </span>
            </div>
          )}

          <div
            className="min-h-[24px] min-w-[24px] shrink-0"
            ref={messagesEndRef}
          />
        </div>
      </div>

      <button
        aria-label="Scroll to bottom"
        className={`absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full border bg-background p-2 shadow-lg transition-all hover:bg-muted ${
          isAtBottom
            ? "pointer-events-none scale-0 opacity-0"
            : "pointer-events-auto scale-100 opacity-100"
        }`}
        onClick={() => scrollToBottom("smooth")}
        type="button"
      >
        <ArrowDownIcon className="size-4" />
      </button>
    </div>
  );
}

export const Messages = PureMessages;
