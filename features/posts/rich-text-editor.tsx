"use client";

import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
  className,
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (prefix: string, suffix = prefix) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    const next =
      value.slice(0, start) + prefix + selected + suffix + value.slice(end);
    onChange(next);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  };

  const insertLinePrefix = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(next);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-sm",
        className
      )}
    >
      <div className="flex flex-wrap gap-1 border-b border-border/60 bg-muted/30 p-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          disabled={disabled}
          onClick={() => wrapSelection("**")}
          aria-label="Bold"
        >
          <Bold className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          disabled={disabled}
          onClick={() => wrapSelection("_")}
          aria-label="Italic"
        >
          <Italic className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          disabled={disabled}
          onClick={() => insertLinePrefix("- ")}
          aria-label="Bullet list"
        >
          <List className="size-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg"
          disabled={disabled}
          onClick={() => insertLinePrefix("1. ")}
          aria-label="Numbered list"
        >
          <ListOrdered className="size-4" />
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={14}
        placeholder="Write your post content here..."
        className="min-h-[280px] resize-y rounded-none border-0 bg-transparent font-mono text-sm leading-relaxed shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
