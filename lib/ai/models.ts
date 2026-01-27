export const DEFAULT_CHAT_MODEL = "anthropic/claude-sonnet-4.5";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "anthropic/claude-sonnet-4.5",
    name: "Hekmo",
    provider: "anthropic",
    description: "Wellness AI powered by Hekmo",
  },
];

export const modelsByProvider = chatModels.reduce(
  (acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = [];
    }
    acc[model.provider].push(model);
    return acc;
  },
  {} as Record<string, ChatModel[]>
);
