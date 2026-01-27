export const DEFAULT_CHAT_MODEL = "deepseek/deepseek-chat";

export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "deepseek/deepseek-chat",
    name: "Hekmo",
    provider: "deepseek",
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
