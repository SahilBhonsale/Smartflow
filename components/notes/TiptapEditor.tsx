"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Heading1,
  Heading2,
  List,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiptapEditorProps {
  content: string;
  onUpdate: (content: string) => void;
  editable?: boolean;
}

export function TiptapEditor({
  content,
  onUpdate,
  editable = true,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "Start writing your note...",
      }),
    ],
    content: content || "",
    editable,
    onUpdate: ({ editor }) => {
      onUpdate(JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3",
      },
    },
  });

  // Update editor content when the content prop changes (e.g., selecting a different note)
  useEffect(() => {
    if (editor && content) {
      try {
        const parsed = JSON.parse(content);
        // Only update if content actually changed
        const currentJSON = JSON.stringify(editor.getJSON());
        if (currentJSON !== content) {
          editor.commands.setContent(parsed);
        }
      } catch {
        // If not JSON, set as text
        if (editor.getText() !== content) {
          editor.commands.setContent(content);
        }
      }
    }
  }, [content, editor]);

  const ToolbarButton = useCallback(
    ({
      onClick,
      active,
      children,
      title,
    }: {
      onClick: () => void;
      active?: boolean;
      children: React.ReactNode;
      title: string;
    }) => (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 rounded-lg",
          active && "bg-muted text-foreground"
        )}
        onClick={onClick}
        title={title}
      >
        {children}
      </Button>
    ),
    []
  );

  if (!editor) return null;

  return (
    <div className="border border-border/60 rounded-xl overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-border/40 bg-muted/30 flex-wrap">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </ToolbarButton>

        <Separator orientation="vertical" className="h-5 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
