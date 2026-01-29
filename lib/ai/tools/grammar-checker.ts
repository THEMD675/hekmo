import { tool } from "ai";
import { z } from "zod";

export const grammarCheckerTool = tool({
  description: "Check and correct grammar and spelling in Arabic or English text. Use when users ask to proofread, check grammar, or fix spelling.",
  inputSchema: z.object({
    text: z.string().describe("The text to check for grammar and spelling errors"),
    language: z.enum(["ar", "en", "auto"]).default("auto").describe("Language of the text"),
  }),
  execute: async ({ text, language }) => {
    try {
      // Detect language if auto
      const detectedLanguage = language === "auto" 
        ? (text.match(/[\u0600-\u06FF]/) ? "ar" : "en")
        : language;

      // Common grammar/spelling patterns to check
      const corrections: Array<{
        original: string;
        correction: string;
        type: "spelling" | "grammar" | "style";
        explanation: string;
      }> = [];

      if (detectedLanguage === "ar") {
        // Arabic common corrections
        const arabicPatterns: Array<[RegExp, string, string]> = [
          [/انشاء الله/g, "إن شاء الله", "التهجئة الصحيحة"],
          [/ان شاء الله/g, "إن شاء الله", "إضافة الهمزة"],
          [/الى/g, "إلى", "إضافة الهمزة"],
          [/على الأقل/g, "على الأقلّ", "تشديد اللام"],
          [/لاكن/g, "لكن", "تصحيح الإملاء"],
          [/هاذا/g, "هذا", "تصحيح الإملاء"],
          [/ذالك/g, "ذلك", "تصحيح الإملاء"],
        ];

        for (const [pattern, correction, explanation] of arabicPatterns) {
          const matches = text.match(pattern);
          if (matches) {
            for (const match of matches) {
              corrections.push({
                original: match,
                correction,
                type: "spelling",
                explanation,
              });
            }
          }
        }
      } else {
        // English common corrections
        const englishPatterns: Array<[RegExp, string, string]> = [
          [/\bi\b/g, "I", "Capitalize first person pronoun"],
          [/\bteh\b/gi, "the", "Common typo"],
          [/\brecieve\b/gi, "receive", "Spelling: i before e except after c"],
          [/\boccured\b/gi, "occurred", "Double consonant"],
          [/\bseperate\b/gi, "separate", "Common misspelling"],
          [/\bdefinately\b/gi, "definitely", "Common misspelling"],
          [/\bthier\b/gi, "their", "Common typo"],
          [/\byour welcome\b/gi, "you're welcome", "your vs you're"],
          [/\bits a\b/g, "it's a", "its vs it's"],
          [/\bcould of\b/gi, "could have", "of vs have"],
          [/\bshould of\b/gi, "should have", "of vs have"],
          [/\bwould of\b/gi, "would have", "of vs have"],
        ];

        for (const [pattern, correction, explanation] of englishPatterns) {
          const matches = text.match(pattern);
          if (matches) {
            for (const match of matches) {
              corrections.push({
                original: match,
                correction,
                type: "spelling",
                explanation,
              });
            }
          }
        }
      }

      // Apply corrections to create corrected text
      let correctedText = text;
      for (const c of corrections) {
        correctedText = correctedText.replace(c.original, c.correction);
      }

      return {
        success: true,
        originalText: text,
        correctedText,
        language: detectedLanguage,
        corrections,
        hasErrors: corrections.length > 0,
        summary: detectedLanguage === "ar"
          ? corrections.length > 0
            ? `تم العثور على ${corrections.length} خطأ`
            : "لم يتم العثور على أخطاء"
          : corrections.length > 0
            ? `Found ${corrections.length} issue(s)`
            : "No issues found",
      };
    } catch (error) {
      console.error("Grammar check error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Grammar check failed",
        originalText: text,
      };
    }
  },
});
