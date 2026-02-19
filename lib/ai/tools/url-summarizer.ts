import { tool } from "ai";
import { z } from "zod";

export const urlSummarizerTool = tool({
  description:
    "Fetch and summarize content from a URL. Use when the user shares a link and wants to know what it's about, or asks to summarize an article/webpage.",
  inputSchema: z.object({
    url: z.string().url().describe("The URL to fetch and summarize"),
    language: z
      .enum(["ar", "en"])
      .default("ar")
      .describe("Language for the summary"),
  }),
  execute: async ({ url, language }) => {
    try {
      // Using a simple fetch with text extraction
      // In production, use a proper web scraping service
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; HekmoBot/1.0)",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.statusText}`);
      }

      const html = await response.text();

      // Simple text extraction (remove HTML tags)
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 5000); // Limit content

      // Extract title
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : "Untitled";

      // Extract meta description
      const descMatch = html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i
      );
      const description = descMatch ? descMatch[1].trim() : null;

      return {
        success: true,
        url,
        title,
        description,
        contentPreview: `${textContent.slice(0, 500)}...`,
        contentLength: textContent.length,
        fetchedAt: new Date().toISOString(),
        language,
        summaryPrompt:
          language === "ar"
            ? `المحتوى من: ${title}. ${description || ""}`
            : `Content from: ${title}. ${description || ""}`,
      };
    } catch (error) {
      console.error("URL fetch error:", error);
      return {
        success: false,
        url,
        error: error instanceof Error ? error.message : "Failed to fetch URL",
      };
    }
  },
});
