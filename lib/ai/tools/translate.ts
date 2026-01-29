import { tool } from "ai";
import { z } from "zod";

export const translateTool = tool({
  description: "Translate text between languages. Supports Arabic, English, and many other languages. Use when the user asks for translation or to convert text to another language.",
  inputSchema: z.object({
    text: z.string().describe("The text to translate"),
    from: z.string().describe("Source language code (e.g., 'ar' for Arabic, 'en' for English, 'auto' for auto-detect)"),
    to: z.string().describe("Target language code (e.g., 'ar' for Arabic, 'en' for English)"),
  }),
  execute: async ({ text, from, to }) => {
    try {
      // Using LibreTranslate API (free and open source)
      // Can be replaced with Google Translate API, DeepL, etc.
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: from === "auto" ? "auto" : from,
          target: to,
          format: "text",
        }),
      });

      if (!response.ok) {
        // Fallback: Return a message indicating translation service unavailable
        // In production, implement with proper API
        return {
          success: false,
          error: "Translation service temporarily unavailable",
          originalText: text,
          from,
          to,
          suggestion: `To translate "${text}" from ${from} to ${to}, please use a translation service.`,
        };
      }

      const data = await response.json();

      return {
        success: true,
        originalText: text,
        translatedText: data.translatedText,
        from: data.detectedLanguage?.language || from,
        to,
      };
    } catch (error) {
      console.error("Translation error:", error);
      
      // Simple fallback translations for common phrases
      const commonTranslations: Record<string, Record<string, string>> = {
        "hello": { ar: "مرحبا", en: "Hello" },
        "مرحبا": { en: "Hello", ar: "مرحبا" },
        "thank you": { ar: "شكراً", en: "Thank you" },
        "شكراً": { en: "Thank you", ar: "شكراً" },
        "good morning": { ar: "صباح الخير", en: "Good morning" },
        "صباح الخير": { en: "Good morning", ar: "صباح الخير" },
      };

      const lowerText = text.toLowerCase();
      if (commonTranslations[lowerText]?.[to]) {
        return {
          success: true,
          originalText: text,
          translatedText: commonTranslations[lowerText][to],
          from,
          to,
          note: "Basic translation provided",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Translation failed",
        originalText: text,
        from,
        to,
      };
    }
  },
});
