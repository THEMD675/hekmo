import { tool } from "ai";
import { z } from "zod";
import { tavily } from "tavily";

export const webSearchTool = tool({
  description: "Search the web for real-time information. Use this when the user asks about current events, news, recent information, or anything that requires up-to-date data.",
  parameters: z.object({
    query: z.string().describe("The search query to look up"),
    language: z.enum(["ar", "en"]).default("ar").describe("Language for search results"),
  }),
  execute: async ({ query, language }) => {
    try {
      const apiKey = process.env.TAVILY_API_KEY;
      
      if (!apiKey) {
        // Fallback to Serper if Tavily not configured
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
              results: (data.organic || []).slice(0, 5).map((r: { title: string; link: string; snippet: string }) => ({
                title: r.title,
                url: r.link,
                snippet: r.snippet,
              })),
            };
          }
        }
        
        return {
          success: false,
          error: "Web search is not configured. Add TAVILY_API_KEY or SERPER_API_KEY.",
          results: [],
        };
      }

      // Use Tavily for search
      const client = tavily({ apiKey });
      const response = await client.search(query, {
        searchDepth: "basic",
        maxResults: 5,
        includeAnswer: true,
      });

      return {
        success: true,
        query,
        answer: response.answer,
        results: response.results.map((r) => ({
          title: r.title,
          url: r.url,
          snippet: r.content,
          score: r.score,
        })),
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
