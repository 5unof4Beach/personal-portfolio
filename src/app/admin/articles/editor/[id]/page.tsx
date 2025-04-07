'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { getArticleTemplate } from '@/utils/articleTemplate';
import defaultTagsData from '@/data/defaultTags.json';

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

// Updated Article interface to include previous fields
interface Article {
  _id?: string; 
  title: string;
  description: string;
  content: string | undefined;
  coverImage?: string;
  tags: string[];
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNewArticle = id === 'new';
  
  const [isLoading, setIsLoading] = useState(!isNewArticle);
  const [isSaving, setIsSaving] = useState(false);
  const [article, setArticle] = useState<Article>({
    title: '',
    description: '',
    content: undefined,
    coverImage: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  
  useEffect(() => {
    if (!isNewArticle && id) {
      fetchArticle(id);
    } else {
      const template = getArticleTemplate();
      setArticle(prev => ({ ...prev, content: template }));
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
      setArticle({
        _id: data._id,
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        coverImage: data.coverImage || '',
        tags: data.tags || [],
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      setArticle(prev => ({ 
        ...prev, 
        title: 'Error Loading',
        content: `# Error loading content\n${error}` 
      })); 
    } finally {
      setIsLoading(false);
    }
  }
  
  async function saveArticle() { 
    if (article.content === undefined) return;

    try {
      setIsSaving(true);
      
      const method = isNewArticle ? 'POST' : 'PATCH';
      const url = isNewArticle ? '/api/articles' : `/api/articles/${id}`;
      
      const articleToSave = { 
        title: article.title,
        description: article.description,
        content: article.content || '', 
        coverImage: article.coverImage || null,
        tags: article.tags,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleToSave),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Save error response:', errorData);
        throw new Error(`Failed to save article (status: ${response.status})`);
      }
      
      const savedData = await response.json();
      
      if (isNewArticle && savedData._id) {
        router.push(`/admin/articles/editor/${savedData._id}`); 
      } else if (!isNewArticle) {
        setArticle(prev => ({ 
          ...prev, 
          _id: savedData._id ?? prev._id, 
          title: savedData.title ?? prev.title,
          description: savedData.description ?? prev.description,
          content: savedData.content ?? prev.content,
          coverImage: savedData.coverImage ?? prev.coverImage,
          tags: savedData.tags ?? prev.tags,
        })); 
        alert('Article saved successfully!');
      }

      return savedData;
    } catch (error) {
      console.error('Error saving article:', error);
      alert(`Error saving article: ${error}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }
  
  function handleContentChange(value: string | undefined) {
    setArticle(prev => ({ ...prev, content: value }));
  }

  function addTag() {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !article.tags.includes(trimmedTag)) {
      setArticle({
        ...article,
        tags: [...article.tags, trimmedTag],
      });
      setTagInput('');
    }
  }
  
  function removeTag(tagToRemove: string) {
    setArticle({
      ...article,
      tags: article.tags.filter((tag) => tag !== tagToRemove),
    });
  }
  
  if (isLoading) { 
    return <div className="text-center p-10">Loading Article...</div>;
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6"> 
      <h1 className="text-3xl font-bold mb-6"> 
        {isNewArticle ? 'Create New Article' : `Edit Article`}
      </h1>
      
      <div className="mb-6">
        <label htmlFor="title" className="block mb-2 font-medium">Title</label>
        <input
          id="title"
          type="text"
          value={article.title}
          onChange={(e) => setArticle({ ...article, title: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Article title"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="description" className="block mb-2 font-medium">Description</label>
        <textarea
          id="description"
          value={article.description}
          onChange={(e) => setArticle({ ...article, description: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="Brief description of the article (max 300 characters)"
          maxLength={300}
          rows={3}
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="coverImage" className="block mb-2 font-medium">Cover Image URL</label>
        <input
          id="coverImage"
          type="text"
          value={article.coverImage || ''}
          onChange={(e) => setArticle(prev => ({ ...prev, coverImage: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-md"
          placeholder="https://example.com/image.jpg"
        />
        {article.coverImage && (
          <div className="mt-2 relative h-40 border rounded-md overflow-hidden">
            <Image
              src={article.coverImage}
              alt="Cover preview"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-medium">Tags</label>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 p-2 border border-gray-300 rounded-md"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Add Tag
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-sm text-gray-600">Or select:</span>
            <select 
              className="p-2 border border-gray-300 rounded-md bg-white text-gray-700"
              onChange={(e) => {
                if (e.target.value) {
                  setTagInput(e.target.value);
                  // Add a slight delay before adding the tag to allow the user to see what was selected
                  setTimeout(() => {
                    addTag();
                    e.target.value = '';
                  }, 100);
                }
              }}
              value=""
            >
              <option value="">-- Select a tag --</option>
              {defaultTagsData.tags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[2.5rem] items-center">
          {article.tags.length > 0 ? (
            article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1.5 text-gray-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-gray-800 text-xs font-bold"
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </span>
            ))
            ) : (
              <p className="text-sm text-gray-500">No tags added yet.</p>
            )
          }
        </div>
      </div>
      
      <div className="mb-8" data-color-mode="light"> 
        <label htmlFor="content-editor" className="block mb-2 font-medium">Content (Markdown)</label>
        {article.content !== undefined ? (
            <MDEditor
              id="content-editor"
              value={article.content}
              onChange={handleContentChange}
              height={500}
              preview="live" 
            />
          ) : (
            <div className="text-center p-10 border rounded-md h-[500px] flex items-center justify-center">Loading Editor...</div> 
          )}
      </div>
      
      <div className="flex justify-end gap-4"> 
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveArticle}
          disabled={isSaving || article.content === undefined} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
        >
          {isSaving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </div>
  );
} 
