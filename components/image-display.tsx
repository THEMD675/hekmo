"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, Maximize2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GeneratedImageProps {
  imageUrl: string;
  prompt: string;
  revisedPrompt?: string;
  className?: string;
}

export function GeneratedImage({
  imageUrl,
  prompt,
  revisedPrompt,
  className,
}: GeneratedImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hekmo-image-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  if (error) {
    return (
      <div className={cn("rounded-lg border bg-muted/50 p-4", className)}>
        <p className="text-sm text-muted-foreground text-center">
          فشل تحميل الصورة
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative group rounded-lg overflow-hidden", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <Image
              alt={prompt}
              className={cn(
                "w-full max-w-md rounded-lg transition-opacity",
                loading ? "opacity-0" : "opacity-100"
              )}
              height={512}
              onError={() => setError(true)}
              onLoad={() => setLoading(false)}
              src={imageUrl}
              width={512}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Maximize2 className="h-8 w-8 text-white" />
            </div>
          </div>
        </DialogTrigger>

        <DialogContent className="max-w-4xl p-0">
          <div className="relative">
            <Image
              alt={prompt}
              className="w-full rounded-lg"
              height={1024}
              src={imageUrl}
              width={1024}
            />
            <Button
              className="absolute top-2 left-2"
              onClick={handleDownload}
              size="icon"
              variant="secondary"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
          {revisedPrompt && (
            <div className="p-4 border-t text-sm text-muted-foreground">
              <strong>الوصف المحسّن:</strong> {revisedPrompt}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Quick download button */}
      <Button
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDownload}
        size="icon"
        variant="secondary"
      >
        <Download className="h-4 w-4" />
      </Button>

      {/* Caption */}
      <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{prompt}</p>
    </div>
  );
}

// Grid for multiple images
export function ImageGrid({
  images,
  className,
}: {
  images: Array<{ url: string; prompt: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        images.length === 1
          ? "grid-cols-1"
          : images.length === 2
            ? "grid-cols-2"
            : "grid-cols-2 md:grid-cols-3",
        className
      )}
    >
      {images.map((img, i) => (
        <GeneratedImage
          imageUrl={img.url}
          key={i}
          prompt={img.prompt}
        />
      ))}
    </div>
  );
}
