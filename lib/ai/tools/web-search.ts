import { tool } from "ai";
import { z } from "zod";

// API response types
interface TavilyResult {
  title: string;
  url: string;
  content: string;
  score?: number;
}

interface SerperResult {
  title: string;
  link: string;
  snippet: string;
}

export const webSearchTool = tool({
  description:
    "Search the web for real-time information. Use this when the user asks about current events, news, recent information, or anything that requires up-to-date data.",
  inputSchema: z.object({
    query: z.string().describe("The search query to look up"),
    language: z
      .enum(["ar", "en"])
      .default("ar")
      .describe("Language for search results"),
  }),
  execute: async ({ query, language }) => {
    try {
      // Try Tavily API first (via fetch, no SDK needed)
      const tavilyKey = process.env.TAVILY_API_KEY;
      if (tavilyKey) {
        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: tavilyKey,
            query,
            search_depth: "basic",
            max_results: 5,
            include_answer: true,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            query,
            answer: data.answer,
            results: (data.results || []).map((r: TavilyResult) => ({
              title: r.title,
              url: r.url,
              snippet: r.content,
              score: r.score,
            })),
          };
        }
      }

      // Fallback to Serper
      const serperKey = process.env.SERPER_API_KEY;
      if (serperKey) {
        const response = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": serperKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            q: query,
            gl: language === "ar" ? "sa" : "us",
            hl: language,
            num: 5,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            query,
            results: (data.organic || []).slice(0, 5).map((r: SerperResult) => ({
              title: r.title,
              url: r.link,
              snippet: r.snippet,
            })),
          };
        }
      }

      return {
        success: false,
        error:
          "Web search not configured. Add TAVILY_API_KEY or SERPER_API_KEY.",
        results: [],
      };
    } catch (error) {
      console.error("Web search error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Search failed",
        results: [],
      };
    }
  },
});
