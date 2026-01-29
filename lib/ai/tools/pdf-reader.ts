import { tool } from "ai";
import { z } from "zod";

export const pdfReaderTool = tool({
  description: "Extract and read text content from a PDF file. Use when users upload a PDF or ask to read/analyze a PDF document.",
  inputSchema: z.object({
    fileUrl: z.string().describe("URL of the PDF file to read"),
    pages: z.string().optional().describe("Specific pages to extract (e.g., '1-5' or '1,3,5')"),
  }),
  execute: async ({ fileUrl, pages }) => {
    try {
      // Dynamically import pdf-parse (Node.js only)
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = (pdfParseModule as any).default || pdfParseModule;
      
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
        text: data.text.slice(0, 10000), // Limit to 10k chars
        textLength: data.text.length,
        truncated: data.text.length > 10000,
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
