import { createOpenAI } from "@ai-sdk/openai";
import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

const THINKING_SUFFIX_REGEX = /-thinking$/;

// Hekmo: fine-tuned 72B model via OpenAI-compatible API
const hekmo = createOpenAI({
  baseURL: process.env.HEKMO_API_URL || "http://localhost:8800/v1",
  apiKey: "hekmo", // not used but required by SDK
});

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : null;

export function getLanguageModel(modelId: string) {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel(modelId);
  }

  // Always use the trained Hekmo model
  return hekmo("hekmo");
}

export function getTitleModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("title-model");
  }
  // Use gateway for title generation (lightweight task)
  return gateway.languageModel("google/gemini-2.5-flash-lite");
}

export function getArtifactModel() {
  if (isTestEnvironment && myProvider) {
    return myProvider.languageModel("artifact-model");
  }
  return gateway.languageModel("anthropic/claude-haiku-4.5");
}
