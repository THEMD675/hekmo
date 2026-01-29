export const DEFAULT_CHAT_MODEL = "deepseek/deepseek-chat";

export type ChatModel = {
  id: string;
  name: string;
  nameAr: string;
  provider: string;
  description: string;
  descriptionAr: string;
  capabilities: string[];
  speed: "fast" | "medium" | "slow";
  isPro?: boolean;
};

export const chatModels: ChatModel[] = [
  {
    id: "deepseek/deepseek-chat",
    name: "Hekmo",
    nameAr: "حكمو",
    provider: "deepseek",
    description: "Business AI powered by Hekmo - Fast and intelligent",
    descriptionAr: "ذكاء اصطناعي للأعمال — سريع وذكي",
    capabilities: ["chat", "tools", "arabic"],
    speed: "fast",
  },
  {
    id: "deepseek/deepseek-reasoner",
    name: "Hekmo Reasoner",
    nameAr: "حكمو المتعمق",
    provider: "deepseek",
    description: "Deep reasoning for complex business decisions",
    descriptionAr: "تفكير عميق لقرارات الأعمال المعقدة",
    capabilities: ["chat", "reasoning", "arabic"],
    speed: "slow",
    isPro: true,
  },
  {
    id: "anthropic/claude-sonnet",
    name: "Hekmo Pro",
    nameAr: "حكمو برو",
    provider: "anthropic",
    description: "Advanced capabilities for complex business queries",
    descriptionAr: "قدرات متقدمة للاستفسارات التجارية المعقدة",
    capabilities: ["chat", "tools", "reasoning", "arabic"],
    speed: "medium",
    isPro: true,
  },
  {
    id: "openai/gpt-4o",
    name: "Hekmo Vision",
    nameAr: "حكمو الرؤية",
    provider: "openai",
    description: "Best for image analysis and document processing",
    descriptionAr: "الأفضل لتحليل الصور ومعالجة المستندات",
    capabilities: ["chat", "tools", "vision", "arabic"],
    speed: "medium",
    isPro: true,
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
