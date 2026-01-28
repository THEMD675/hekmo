import { tool } from "ai";
import { z } from "zod";

export const youtubeSummarizerTool = tool({
  description: "Get information about a YouTube video including title, channel, and description. Use when users share a YouTube link or ask about a video.",
  parameters: z.object({
    url: z.string().describe("YouTube video URL (youtube.com or youtu.be)"),
    language: z.enum(["ar", "en"]).default("ar").describe("Language for response"),
  }),
  execute: async ({ url, language }) => {
    try {
      // Extract video ID from various YouTube URL formats
      let videoId: string | null = null;
      
      const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
        /youtube\.com\/shorts\/([^&\n?#]+)/,
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          videoId = match[1];
          break;
        }
      }

      if (!videoId) {
        return {
          success: false,
          error: "Invalid YouTube URL",
          url,
        };
      }

      // Use YouTube's oEmbed API (no API key required)
      const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
      
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        throw new Error("Failed to fetch video info");
      }

      const data = await response.json();

      return {
        success: true,
        videoId,
        title: data.title,
        author: data.author_name,
        authorUrl: data.author_url,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
        provider: "YouTube",
        language,
        // Note: For actual transcript/summary, would need YouTube Data API + transcript service
        note: language === "ar" 
          ? "للحصول على ملخص المحتوى، يرجى وصف ما تريد معرفته عن الفيديو"
          : "For content summary, please describe what you want to know about the video",
      };
    } catch (error) {
      console.error("YouTube error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch video",
        url,
      };
    }
  },
});
