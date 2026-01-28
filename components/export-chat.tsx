"use client";

import { useState } from "react";
import { Download, FileJson, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

interface ExportChatProps {
  chatId: string;
  chatTitle?: string;
  messages: Message[];
}

export function ExportChat({ chatId, chatTitle, messages }: ExportChatProps) {
  const [loading, setLoading] = useState(false);

  const exportAsJSON = () => {
    try {
      const data = {
        id: chatId,
        title: chatTitle || "محادثة حكمو",
        exportedAt: new Date().toISOString(),
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          timestamp: m.createdAt?.toISOString(),
        })),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      downloadBlob(blob, `hekmo-chat-${chatId}.json`);
      toast.success("تم تصدير المحادثة بنجاح");
    } catch {
      toast.error("فشل تصدير المحادثة");
    }
  };

  const exportAsMarkdown = () => {
    try {
      let markdown = `# ${chatTitle || "محادثة حكمو"}\n\n`;
      markdown += `> تم التصدير في: ${new Date().toLocaleString("ar-SA")}\n\n`;
      markdown += `---\n\n`;

      for (const message of messages) {
        const role = message.role === "user" ? "👤 أنت" : "🤖 حكمو";
        markdown += `### ${role}\n\n`;
        markdown += `${message.content}\n\n`;
        markdown += `---\n\n`;
      }

      const blob = new Blob([markdown], { type: "text/markdown" });
      downloadBlob(blob, `hekmo-chat-${chatId}.md`);
      toast.success("تم تصدير المحادثة بنجاح");
    } catch {
      toast.error("فشل تصدير المحادثة");
    }
  };

  const exportAsText = () => {
    try {
      let text = `${chatTitle || "محادثة حكمو"}\n`;
      text += `${"=".repeat(50)}\n\n`;
      text += `تم التصدير في: ${new Date().toLocaleString("ar-SA")}\n\n`;
      text += `${"=".repeat(50)}\n\n`;

      for (const message of messages) {
        const role = message.role === "user" ? "أنت" : "حكمو";
        text += `[${role}]\n`;
        text += `${message.content}\n\n`;
        text += `${"-".repeat(30)}\n\n`;
      }

      const blob = new Blob([text], { type: "text/plain" });
      downloadBlob(blob, `hekmo-chat-${chatId}.txt`);
      toast.success("تم تصدير المحادثة بنجاح");
    } catch {
      toast.error("فشل تصدير المحادثة");
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={loading || messages.length === 0} size="sm" variant="outline">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4 ml-2" />
          )}
          تصدير
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportAsJSON}>
          <FileJson className="h-4 w-4 ml-2" />
          JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsMarkdown}>
          <FileText className="h-4 w-4 ml-2" />
          Markdown
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsText}>
          <FileText className="h-4 w-4 ml-2" />
          نص عادي
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
