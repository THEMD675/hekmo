import { tool } from "ai";
import { z } from "zod";

export const imageGenerationTool = tool({
  description: "Generate an image from a text description. Use when users ask to create, generate, or draw an image.",
  inputSchema: z.object({
    prompt: z.string().describe("Detailed description of the image to generate"),
    style: z.enum(["realistic", "artistic", "cartoon", "sketch", "3d"]).default("realistic").describe("Image style"),
    size: z.enum(["square", "portrait", "landscape"]).default("square").describe("Image dimensions"),
  }),
  execute: async ({ prompt, style, size }) => {
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      
      if (!apiKey) {
        return {
          success: false,
          error: "Image generation is not configured",
          prompt,
        };
      }

      // Map size to DALL-E dimensions
      const sizeMap = {
        square: "1024x1024",
        portrait: "1024x1792",
        landscape: "1792x1024",
      };

      // Enhance prompt with style
      const stylePrompts = {
        realistic: "photorealistic, high quality, detailed",
        artistic: "artistic, painterly, creative",
        cartoon: "cartoon style, animated, colorful",
        sketch: "pencil sketch, line art, hand-drawn",
        "3d": "3D render, CGI, volumetric lighting",
      };

      const enhancedPrompt = `${prompt}, ${stylePrompts[style]}`;

      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: enhancedPrompt,
          n: 1,
          size: sizeMap[size],
          quality: "standard",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Image generation failed");
      }

      const data = await response.json();
      const imageUrl = data.data[0]?.url;

      if (!imageUrl) {
        throw new Error("No image URL returned");
      }

      return {
        success: true,
        imageUrl,
        revisedPrompt: data.data[0]?.revised_prompt,
        originalPrompt: prompt,
        style,
        size: sizeMap[size],
      };
    } catch (error) {
      console.error("Image generation error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Image generation failed",
        prompt,
      };
    }
  },
});
