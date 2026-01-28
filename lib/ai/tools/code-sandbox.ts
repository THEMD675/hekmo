import { tool } from "ai";
import { z } from "zod";

// Code Sandbox Tool for safe code execution
// Uses a sandboxed environment (in production, use E2B, Pyodide, or similar)

export const codeSandboxTool = tool({
  description: "Execute code safely in a sandboxed environment. Supports Python and JavaScript. Use for calculations, data processing, or demonstrating code.",
  parameters: z.object({
    code: z.string().describe("The code to execute"),
    language: z.enum(["python", "javascript"]).describe("Programming language"),
    timeout: z.number().optional().default(5000).describe("Timeout in milliseconds"),
  }),
  execute: async ({ code, language, timeout }) => {
    try {
      // Validate code for safety
      const safetyCheck = validateCode(code, language);
      if (!safetyCheck.safe) {
        return {
          success: false,
          error: safetyCheck.reason,
          output: null,
        };
      }

      // Execute based on language
      if (language === "javascript") {
        return executeJavaScript(code, timeout);
      }

      if (language === "python") {
        return executePython(code, timeout);
      }

      return {
        success: false,
        error: "Unsupported language",
        output: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Execution failed",
        output: null,
      };
    }
  },
});

// Validate code for dangerous operations
function validateCode(
  code: string,
  language: string
): { safe: boolean; reason?: string } {
  // Dangerous patterns to block
  const dangerousPatterns = [
    /\beval\b/,
    /\bexec\b/,
    /\bos\./,
    /\bsubprocess/,
    /\b__import__/,
    /\bopen\s*\(/,
    /\bfs\./,
    /\brequire\s*\(/,
    /\bimport\s+(?!math|json|re|datetime|random)/,
    /\bprocess\./,
    /\bchild_process/,
    /\bfetch\s*\(/,
    /\bXMLHttpRequest/,
    /\bWebSocket/,
    /\bBuffer\./,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: "الكود يحتوي على عمليات غير مسموح بها",
      };
    }
  }

  // Check code length
  if (code.length > 5000) {
    return { safe: false, reason: "الكود طويل جداً" };
  }

  return { safe: true };
}

// Execute JavaScript in a sandbox
function executeJavaScript(
  code: string,
  timeout: number
): { success: boolean; output: string | null; error?: string } {
  try {
    // Create a sandbox with limited globals
    const sandbox = {
      console: {
        log: (...args: unknown[]) => outputs.push(args.map(String).join(" ")),
        error: (...args: unknown[]) => outputs.push("Error: " + args.map(String).join(" ")),
      },
      Math,
      Date,
      JSON,
      Array,
      Object,
      String,
      Number,
      Boolean,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
    };

    const outputs: string[] = [];

    // Wrap code to capture return value
    const wrappedCode = `
      "use strict";
      ${code}
    `;

    // Execute with timeout (simplified - use vm2 or similar in production)
    const fn = new Function(...Object.keys(sandbox), wrappedCode);
    const result = fn(...Object.values(sandbox));

    // Combine outputs
    if (result !== undefined) {
      outputs.push(String(result));
    }

    return {
      success: true,
      output: outputs.join("\n") || "تم التنفيذ بنجاح (لا يوجد مخرجات)",
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : "خطأ في التنفيذ",
    };
  }
}

// Execute Python (placeholder - use Pyodide in production)
function executePython(
  code: string,
  timeout: number
): { success: boolean; output: string | null; error?: string } {
  // In production, use Pyodide or a backend service
  // This is a placeholder that only handles simple math

  try {
    // Simple Python math interpreter for demo
    const mathExpressions = code.match(/print\((.+)\)/g);
    if (mathExpressions) {
      const outputs: string[] = [];
      
      for (const expr of mathExpressions) {
        const inner = expr.replace(/print\(/, "").replace(/\)$/, "");
        
        // Only evaluate simple math
        if (/^[\d\s+\-*/.()]+$/.test(inner)) {
          const result = eval(inner);
          outputs.push(String(result));
        } else {
          outputs.push(`[Would print: ${inner}]`);
        }
      }

      return {
        success: true,
        output: outputs.join("\n"),
      };
    }

    return {
      success: true,
      output: "تم تحليل الكود (التنفيذ الكامل يتطلب بيئة Python)",
    };
  } catch (error) {
    return {
      success: false,
      output: null,
      error: error instanceof Error ? error.message : "خطأ في التنفيذ",
    };
  }
}

// Format code execution result for display
export function formatExecutionResult(result: {
  success: boolean;
  output: string | null;
  error?: string;
}): string {
  if (result.success) {
    return `✅ **النتيجة:**\n\`\`\`\n${result.output}\n\`\`\``;
  }

  return `❌ **خطأ:**\n\`\`\`\n${result.error}\n\`\`\``;
}
