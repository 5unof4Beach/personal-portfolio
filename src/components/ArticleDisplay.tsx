'use client';

import { useMemo } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';

type ArticleDisplayProps = {
  content: any;
};

export default function ArticleDisplay({ content }: ArticleDisplayProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
    ],
    content,
    editable: false,
  });

  return (
    <div className="article-content prose prose-lg max-w-none">
      {editor && <EditorContent editor={editor} />}
    </div>
  );
} 
