"use client";

import { ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: File | null;
  previewUrl?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value,
  previewUrl,
  onChange,
  disabled,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const displayPreview =
    localPreview ?? (value ? URL.createObjectURL(value) : null) ?? previewUrl;

  const handleFile = useCallback(
    (file: File | null) => {
      if (localPreview) URL.revokeObjectURL(localPreview);
      if (file) {
        setLocalPreview(URL.createObjectURL(file));
      } else {
        setLocalPreview(null);
      }
      onChange(file);
    },
    [localPreview, onChange]
  );

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          handleFile(file);
        }}
      />

      {displayPreview ? (
        <div className="group relative overflow-hidden rounded-2xl border border-border/60">
          <div className="relative aspect-[16/9] w-full bg-muted">
            <Image
              src={displayPreview}
              alt="Upload preview"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="rounded-lg"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mr-1.5 size-4" />
              Change
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="size-8 rounded-lg"
              disabled={disabled}
              onClick={() => {
                handleFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/80",
            "bg-muted/30 px-6 py-12 transition-all",
            "hover:border-primary/40 hover:bg-muted/50",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <ImageIcon className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Upload cover image</p>
            <p className="mt-1 text-xs text-muted-foreground">
              JPEG, PNG, WebP or GIF — max 5MB
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
