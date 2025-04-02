'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { useState, useCallback } from 'react';

type ArticleEditorProps = {
  content: any;
  onChange: (content: any) => void;
};

export default function ArticleEditor({ content, onChange }: ArticleEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Write your article content here...',
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  const uploadImage = useCallback(async (file: File) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const imageUrl = await uploadImage(file);
        
        if (imageUrl && editor) {
          editor.chain().focus().setImage({ src: imageUrl }).run();
        }
      }
    };
    input.click();
  }, [editor, uploadImage]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="border border-gray-300 rounded-md">
      <div className="bg-gray-100 p-2 border-b flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-300' : ''}`}
          aria-label="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-300' : ''}`}
          aria-label="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''}`}
          aria-label="Heading"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0H24V24H0z" />
            <path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18h2.944v2H14v-1.556l4.782-5.782c.085-.096.149-.203.193-.32l.025-.074.026-.104c.013-.058.019-.117.019-.177 0-.674-.51-1.236-1.166-1.313l-.084-.006-.135.008c-.41.045-.794.212-1.084.499-.279.277-.444.652-.489 1.05L16.074 12H14.04c.058-1.112.477-2.15 1.176-2.95.745-.853 1.764-1.338 2.818-1.35l.176-.005.29.005z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-300' : ''}`}
          aria-label="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleImageUpload}
          className="p-2 rounded"
          disabled={isUploading}
          aria-label="Insert Image"
        >
          {isUploading ? (
            <span>Uploading...</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="none" d="M0 0h24v24H0z" />
              <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          )}
        </button>
      </div>
      
      <EditorContent editor={editor} className="prose max-w-none p-4 min-h-[300px]" />
    </div>
  );
} 
