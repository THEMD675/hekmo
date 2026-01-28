"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, File, Image, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatFileSize } from "@/lib/utils/format";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (files: UploadedFile[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

const FILE_ICONS: Record<string, React.ReactNode> = {
  image: <Image className="h-5 w-5" />,
  pdf: <FileText className="h-5 w-5" />,
  default: <File className="h-5 w-5" />,
};

export function FileUpload({
  onUpload,
  accept = "*",
  maxSize = 10,
  maxFiles = 5,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return FILE_ICONS.image;
    if (type === "application/pdf") return FILE_ICONS.pdf;
    return FILE_ICONS.default;
  };

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const newFiles = Array.from(fileList);

      // Validate
      if (files.length + newFiles.length > maxFiles) {
        toast.error(`يمكن رفع ${maxFiles} ملفات كحد أقصى`);
        return;
      }

      for (const file of newFiles) {
        if (file.size > maxSize * 1024 * 1024) {
          toast.error(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجا`);
          return;
        }
      }

      setUploading(true);

      try {
        const uploaded: UploadedFile[] = [];

        for (const file of newFiles) {
          const formData = new FormData();
          formData.append("file", file);

          const response = await fetch("/api/files/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error();

          const data = await response.json();
          uploaded.push({
            id: data.id || crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type,
            url: data.url,
          });
        }

        setFiles((prev) => [...prev, ...uploaded]);
        onUpload(uploaded);
        toast.success("تم رفع الملف بنجاح");
      } catch {
        toast.error("فشل رفع الملف");
      } finally {
        setUploading(false);
      }
    },
    [files.length, maxFiles, maxSize, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          uploading && "opacity-50 pointer-events-none"
        )}
        onClick={() => inputRef.current?.click()}
        onDragLeave={() => setDragOver(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDrop={handleDrop}
      >
        <input
          accept={accept}
          className="hidden"
          multiple={maxFiles > 1}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          ref={inputRef}
          type="file"
        />

        {uploading ? (
          <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
        ) : (
          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
        )}

        <p className="mt-2 text-sm text-muted-foreground">
          اسحب الملفات هنا أو اضغط للاختيار
        </p>
        <p className="text-xs text-muted-foreground/75">
          الحد الأقصى: {maxSize} ميجا، {maxFiles} ملفات
        </p>
      </div>

      {/* Uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div
              className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50"
              key={file.id}
            >
              <div className="text-muted-foreground">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Button
                onClick={() => removeFile(file.id)}
                size="icon"
                variant="ghost"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
