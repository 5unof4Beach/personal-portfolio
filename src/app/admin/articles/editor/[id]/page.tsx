'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import ArticleEditor from '@/components/ArticleEditor';

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

interface Article {
  title: string;
  content: TipTapContent | null;
  coverImage: string;
  tags: string[];
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNewArticle = id === 'new';
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [article, setArticle] = useState<Article>({
    title: '',
    content: null,
    coverImage: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (!isNewArticle && id) {
      fetchArticle(id);
    } else {
      setIsLoading(false);
    }
  }, [id, isNewArticle]);
  
  async function fetchArticle(articleId: string) {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/articles/${articleId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  async function saveArticle() {
    try {
      setIsSaving(true);
      
      const method = isNewArticle ? 'POST' : 'PATCH';
      const url = isNewArticle ? '/api/articles' : `/api/articles/${id}`;
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save article');
      }
      
      const savedArticle = await response.json();
      
      if (isNewArticle) {
        router.push(`/admin/articles/editor/${savedArticle._id}`);
      }
      
      return savedArticle;
    } catch (error) {
      console.error('Error saving article:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  }
  
  function handleContentChange(content: TipTapContent) {
    setArticle({ ...article, content });
  }
  
  function addTag() {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle({
        ...article,
        tags: [...article.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  }
  
  function removeTag(tag: string) {
    setArticle({
      ...article,
      tags: article.tags.filter((t) => t !== tag),
    });
  }
  
  if (isLoading) {
    return <div className="text-center p-10">Loading...</div>;
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isNewArticle ? 'Create New Article' : 'Edit Article'}
      </h1>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Article title"
          required
        />
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Cover Image URL</label>
        <input
          type="text"
          value={article.coverImage || ''}
          onChange={(e) => setArticle({ ...article, coverImage: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="https://example.com/image.jpg"
        />
        {article.coverImage && (
          <div className="mt-2 relative h-40 w-full">
            <Image
              src={article.coverImage}
              alt="Cover preview"
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-md"
            />
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTag()}
            className="flex-1 p-2 border border-gray-300 rounded-md"
            placeholder="Add a tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 rounded-full flex items-center"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block mb-2 font-medium">Content</label>
        <ArticleEditor
          content={article.content}
          onChange={handleContentChange}
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveArticle}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
        >
          {isSaving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </div>
  );
} 
