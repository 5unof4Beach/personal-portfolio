'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';

// Load MDEditor dynamically
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

// Simplified Article interface
interface Article {
  content: string | undefined;
  _id?: string; // Keep _id if returned by API
}

export default function EditMarkdownPage() { // Renamed component slightly
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const isNewContent = id === 'new'; // Renamed variable
  
  const [isLoading, setIsLoading] = useState(!isNewContent); // Only load if not new
  const [isSaving, setIsSaving] = useState(false);
  // Simplified state
  const [article, setArticle] = useState<Article>({
    content: undefined,
  });
  // Removed: tagInput state
  
  useEffect(() => {
    if (!isNewContent && id) {
      fetchContent(id); // Renamed function
    } else {
      // Initialize content for new entries
      setArticle({ content: '' }); 
      setIsLoading(false); // Set loading false for new entries
    }
  }, [id, isNewContent]);
  
  // Renamed and simplified fetch function
  async function fetchContent(contentId: string) { 
    try {
      setIsLoading(true);
      // Assuming API endpoint remains similar but returns only content
      const response = await fetch(`/api/articles/${contentId}`); 
      
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      
      // Expecting { content: string, _id: string } or similar
      const data = await response.json(); 
      setArticle({ content: data.content || '', _id: data._id }); // Update state
    } catch (error) {
      console.error('Error fetching content:', error);
      setArticle({ content: `# Error loading content\n${error}` }); // Provide error feedback
    } finally {
      setIsLoading(false);
    }
  }
  
  // Simplified save function
  async function saveContent() { 
    if (article.content === undefined) return; // Don't save if content isn't loaded

    try {
      setIsSaving(true);
      
      const method = isNewContent ? 'POST' : 'PATCH';
      // Assuming API endpoints remain structurally similar
      const url = isNewContent ? '/api/articles' : `/api/articles/${id}`; 
      
      // Prepare only the content for saving
      const contentToSave = { 
        content: article.content || '', 
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contentToSave),
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Save error response:', errorData);
        throw new Error(`Failed to save content (status: ${response.status})`);
      }
      
      const savedData = await response.json();
      
      if (isNewContent && savedData._id) {
        // If new content was created, redirect to its edit page
        router.push(`/admin/articles/editor/${savedData._id}`); 
      } else if (!isNewContent) {
        // If editing existing, update state (in case API returns modified data)
        setArticle(prev => ({ ...prev, content: savedData.content ?? prev.content })); 
        // Optional: Add a success message/indicator
      }
      
      return savedData;
    } catch (error) {
      console.error('Error saving content:', error);
      // Optional: Add user-facing error message
      return null;
    } finally {
      setIsSaving(false);
    }
  }
  
  function handleContentChange(value: string | undefined) {
    setArticle(prev => ({ ...prev, content: value })); // Update only content
  }
  
  // Removed: addTag and removeTag functions
  
  if (isLoading) { // Simplified loading state
    return <div className="text-center p-10">Loading Content...</div>;
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Simplified Title */}
      <h1 className="text-3xl font-bold mb-6">
        {isNewContent ? 'Create New Content' : `Edit Content (${id})`}
      </h1>
      
      {/* Removed: Title Input */}
      {/* Removed: Cover Image Input */}
      {/* Removed: Tags Input */}
      
      {/* Markdown Editor Section */}
      <div className="mb-8" data-color-mode="light"> 
        <label className="block mb-2 font-medium">Content (Markdown)</label>
        {article.content !== undefined ? (
            <MDEditor
              value={article.content}
              onChange={handleContentChange}
              height={500} // Increased height slightly
              preview="live" 
            />
          ) : (
            <div className="text-center p-10 border rounded-md h-[500px] flex items-center justify-center">Loading Editor...</div> 
          )}
      </div>
      
      {/* Simplified Action Buttons */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          // TODO: Decide where Cancel should go. Back to a list? Dashboard?
          onClick={() => router.back()} // Go back to previous page for now
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={saveContent} // Use updated save function
          disabled={isSaving || article.content === undefined} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-400"
        >
          {isSaving ? 'Saving...' : 'Save Content'}
        </button>
      </div>
    </div>
  );
} 
