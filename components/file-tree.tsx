"use client";

import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface FileTreeNode {
  name: string;
  type: "file" | "folder";
  children?: FileTreeNode[];
  path?: string;
  language?: string;
}

interface FileTreeProps {
  data: FileTreeNode[];
  onSelect?: (node: FileTreeNode) => void;
  className?: string;
}

export function FileTree({ data, onSelect, className }: FileTreeProps) {
  return (
    <div className={cn("text-sm font-mono", className)} dir="ltr">
      {data.map((node, index) => (
        <TreeNode
          depth={0}
          key={`${node.name}-${index}`}
          node={node}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function TreeNode({
  node,
  onSelect,
  depth,
}: {
  node: FileTreeNode;
  onSelect?: (node: FileTreeNode) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  const isFolder = node.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      setExpanded(!expanded);
    }
    onSelect?.(node);
  };

  const getFileIcon = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const colors: Record<string, string> = {
      ts: "text-blue-400",
      tsx: "text-blue-400",
      js: "text-yellow-400",
      jsx: "text-yellow-400",
      json: "text-yellow-300",
      css: "text-pink-400",
      html: "text-orange-400",
      md: "text-gray-400",
      py: "text-green-400",
      sql: "text-purple-400",
    };
    return colors[ext || ""] || "text-gray-400";
  };

  return (
    <div>
      <button
        className={cn(
          "flex w-full items-center gap-1 py-1 px-2 rounded hover:bg-muted/50 transition-colors text-right",
          "focus:outline-none focus:ring-1 focus:ring-primary"
        )}
        onClick={handleClick}
        style={{ paddingRight: `${depth * 16 + 8}px` }}
        type="button"
      >
        {isFolder ? (
          <>
            {expanded ? (
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            {expanded ? (
              <FolderOpen className="h-4 w-4 shrink-0 text-yellow-500" />
            ) : (
              <Folder className="h-4 w-4 shrink-0 text-yellow-500" />
            )}
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className={cn("h-4 w-4 shrink-0", getFileIcon(node.name))} />
          </>
        )}
        <span className="truncate">{node.name}</span>
      </button>

      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <TreeNode
              depth={depth + 1}
              key={`${child.name}-${index}`}
              node={child}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Parse file list string to tree structure
export function parseFileListToTree(fileList: string): FileTreeNode[] {
  const lines = fileList.trim().split("\n").filter(Boolean);
  const root: FileTreeNode[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }

    const parts = trimmed.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const isFolder = !isLast || trimmed.endsWith("/");

      let existing = current.find((n) => n.name === part);

      if (!existing) {
        existing = {
          name: part,
          type: isFolder ? "folder" : "file",
          children: isFolder ? [] : undefined,
          path: parts.slice(0, i + 1).join("/"),
        };
        current.push(existing);
      }

      if (existing.children) {
        current = existing.children;
      }
    }
  }

  // Sort: folders first, then files, alphabetically
  const sortNodes = (nodes: FileTreeNode[]): FileTreeNode[] => {
    return nodes
      .sort((a, b) => {
        if (a.type === "folder" && b.type === "file") {
          return -1;
        }
        if (a.type === "file" && b.type === "folder") {
          return 1;
        }
        return a.name.localeCompare(b.name);
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortNodes(node.children) : undefined,
      }));
  };

  return sortNodes(root);
}
