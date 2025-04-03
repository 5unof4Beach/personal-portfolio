'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

// Define TipTap editor content type
interface TipTapContent {
  type: string;
  content?: TipTapContent[];
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
}

type ArticleDisplayProps = {
  content: TipTapContent | null;
};

export default function ArticleDisplay({ content }: ArticleDisplayProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    editable: false,
    immediatelyRender: false,
  });

  return (
    <div className="article-content prose prose-lg max-w-none">
      {editor && <EditorContent editor={editor} />}
    </div>
  );
} 
