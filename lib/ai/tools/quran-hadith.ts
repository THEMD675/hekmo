import { tool } from "ai";
import { z } from "zod";

export const quranHadithTool = tool({
  description: "Search the Quran and Hadith for Islamic guidance. Use when users ask about Quranic verses, Hadith, or Islamic rulings related to health, fasting, etc.",
  inputSchema: z.object({
    query: z.string().describe("Search query (can be in Arabic or English)"),
    source: z.enum(["quran", "hadith", "both"]).default("both").describe("Which source to search"),
    limit: z.number().default(5).describe("Number of results to return"),
  }),
  execute: async ({ query, source, limit }) => {
    const results: {
      quran?: Array<{ surah: string; ayah: number; text: string; translation: string }>;
      hadith?: Array<{ book: string; narrator: string; text: string }>;
    } = {};

    try {
      // Search Quran using Alquran.cloud API
      if (source === "quran" || source === "both") {
        const quranResponse = await fetch(
          `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/ar`
        );
        
        if (quranResponse.ok) {
          const quranData = await quranResponse.json();
          if (quranData.data?.matches) {
            results.quran = quranData.data.matches.slice(0, limit).map((match: {
              surah: { englishName: string; name: string };
              numberInSurah: number;
              text: string;
            }) => ({
              surah: `${match.surah.name} (${match.surah.englishName})`,
              ayah: match.numberInSurah,
              text: match.text,
              translation: "", // Would need additional API call for translation
            }));
          }
        }
      }

      // Search Hadith using sunnah.com API (or fallback)
      if (source === "hadith" || source === "both") {
        // Note: Sunnah.com API requires authentication
        // This is a simplified implementation
        results.hadith = [
          {
            book: "البحث في الحديث",
            narrator: "",
            text: `للبحث عن "${query}" في الأحاديث، يرجى استخدام موقع sunnah.com أو dorar.net`,
          },
        ];
      }

      return {
        success: true,
        query,
        source,
        results,
        suggestion: results.quran && results.quran.length > 0 
          ? null 
          : "لم يتم العثور على نتائج مباشرة. جرب كلمات مفتاحية مختلفة.",
      };
    } catch (error) {
      console.error("Quran/Hadith search error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
        query,
        suggestion: "يمكنك البحث في quran.com أو sunnah.com للحصول على نتائج دقيقة.",
      };
    }
  },
});
