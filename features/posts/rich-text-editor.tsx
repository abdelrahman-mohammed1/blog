"use client";

import {
  useEditor,
  useEditorState,
  EditorContent,
  type Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./rich-text-editor.css";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

function isEmptyHtml(html: string) {
  const trimmed = html.trim();
  return trimmed === "" || trimmed === "<p></p>" || trimmed === "<p><br></p>";
}

function normalizeHtml(html: string) {
  return isEmptyHtml(html) ? "" : html;
}

interface EditorToolbarProps {
  editor: Editor | null;
  disabled?: boolean;
}

function EditorToolbar({ editor, disabled }: EditorToolbarProps) {
  const active = useEditorState({
    editor,
    selector: (ctx) => {
      if (!ctx.editor) return null;
      return {
        isBold: ctx.editor.isActive("bold"),
        isItalic: ctx.editor.isActive("italic"),
        isBulletList: ctx.editor.isActive("bulletList"),
        isOrderedList: ctx.editor.isActive("orderedList"),
      };
    },
  });

  if (!editor) {
    return (
      <div className="flex flex-wrap gap-1 border-b border-border/60 bg-muted/30 p-2">
        <div className="size-8 rounded-lg bg-muted/50" />
        <div className="size-8 rounded-lg bg-muted/50" />
        <div className="size-8 rounded-lg bg-muted/50" />
        <div className="size-8 rounded-lg bg-muted/50" />
      </div>
    );
  }

  const toolBtn = (isActive: boolean) =>
    cn(
      "size-8 rounded-lg",
      isActive && "bg-accent text-accent-foreground"
    );

  return (
    <div className="flex flex-wrap gap-1 border-b border-border/60 bg-muted/30 p-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={toolBtn(active?.isBold ?? false)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-label="Bold"
        aria-pressed={active?.isBold ?? false}
      >
        <Bold className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={toolBtn(active?.isItalic ?? false)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-label="Italic"
        aria-pressed={active?.isItalic ?? false}
      >
        <Italic className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={toolBtn(active?.isBulletList ?? false)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        aria-label="Bullet list"
        aria-pressed={active?.isBulletList ?? false}
      >
        <List className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={toolBtn(active?.isOrderedList ?? false)}
        disabled={disabled}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        aria-label="Numbered list"
        aria-pressed={active?.isOrderedList ?? false}
      >
        <ListOrdered className="size-4" />
      </Button>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  disabled,
  className,
}: RichTextEditorProps) {
  const isSyncingRef = useRef(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
        strike: false,
      }),
      Placeholder.configure({
        placeholder: "Write your post content here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "tiptap-editor max-w-none resize-y",
        "data-placeholder": "Write your post content here...",
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (isSyncingRef.current) return;
      onChange(normalizeHtml(ed.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const next = value || "";
    const current = normalizeHtml(editor.getHTML());
    if (next === current) return;

    isSyncingRef.current = true;
    editor.commands.setContent(next, { emitUpdate: false });
    isSyncingRef.current = false;
  }, [value, editor]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-background/80 shadow-sm",
        disabled && "pointer-events-none opacity-60",
        className
      )}
    >
      <EditorToolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
}
