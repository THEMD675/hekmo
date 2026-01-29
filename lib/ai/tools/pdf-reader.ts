import { tool } from "ai";
import { z } from "zod";

export const pdfReaderTool = tool({
  description:
    "Extract and read text content from a PDF file. Use when users upload a PDF or ask to read/analyze a PDF document.",
  inputSchema: z.object({
    fileUrl: z.string().describe("URL of the PDF file to read"),
    pages: z
      .string()
      .optional()
      .describe("Specific pages to extract (e.g., '1-5' or '1,3,5')"),
  }),
  execute: async ({ fileUrl, pages: _pages }) => {
    try {
      // Dynamically import pdf-parse (Node.js only)
      // Dynamic import with ESM/CJS compatibility
      type PDFData = {
        text: string;
        numpages: number;
        info?: { Title?: string; Author?: string; CreationDate?: string };
      };
      const pdfParseModule = await import("pdf-parse");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfParse =
        ((pdfParseModule as Record<string, unknown>).default as (
          buffer: Buffer
        ) => Promise<PDFData>) || pdfParseModule;

      // Fetch the PDF
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      // Parse PDF
      const data = await pdfParse(buffer);

      // Extract metadata and text
      const result = {
        success: true,
        metadata: {
          title: data.info?.Title || null,
          author: data.info?.Author || null,
          pages: data.numpages,
          creationDate: data.info?.CreationDate || null,
        },
        text: data.text.slice(0, 10_000), // Limit to 10k chars
        textLength: data.text.length,
        truncated: data.text.length > 10_000,
      };

      return result;
    } catch (error) {
      console.error("PDF read error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to read PDF",
        fileUrl,
      };
    }
  },
});
