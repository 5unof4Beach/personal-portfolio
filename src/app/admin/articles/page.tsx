"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Updated interface to include fields returned by API
interface Article {
  _id: string;
  title: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  archived?: boolean;
}

export default function ArticlesListPage() {
  const router = useRouter();
  // Use the updated interface
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  // Fetch function expects array of Article objects now
  async function fetchArticles() {
    try {
      setIsLoading(true);
      const response = await fetch("/api/articles");
      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Delete function remains the same
  async function deleteArticle(id: string) {
    try {
      setIsDeleting(true);
      setSelectedArticle(id);
      const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }
      setArticles(articles.filter((article) => article._id !== id));
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setIsDeleting(false);
      setSelectedArticle(null);
    }
  }

  // Simplified formatDate back if hour/minute not needed here
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (isLoading) {
    return <div className="text-center p-10">Loading articles...</div>; // Updated text
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Articles</h1> {/* Reverted Title */}
        <Link
          href="/admin/articles/editor/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Create New Article {/* Reverted Button Text */}
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <p>No articles yet. Create your first article!</p>{" "}
          {/* Reverted Text */}
        </div>
      ) : (
        // Restore Table View
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Add Cover Image column header (implicitly with Title) */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Archived
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article._id} className="hover:bg-gray-50">
                  {/* Title and Cover Image Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {article.coverImage && (
                        <div className="flex-shrink-0 h-10 w-10 mr-4 relative">
                          <Image
                            src={article.coverImage}
                            alt=""
                            sizes="40px"
                            fill
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}
                      <div className="max-w-xs">
                        <div
                          className="text-sm font-medium text-gray-900 truncate"
                          title={article.title}
                        >
                          {article.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Archived status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      <span
                        className={`px-2 py-1 text-xs ${article.archived ? "bg-red-200":"bg-green-200"} rounded-full text-gray-800`}
                      >
                        {article.archived ? 'true' : 'false'}
                      </span>
                    </div>
                  </td>
                  {/* Tags Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  {/* Date Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.createdAt)}
                  </td>
                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/articles/${article._id}`}
                      className="text-gray-800 hover:text-gray-900 mr-4"
                      target="_blank"
                    >
                      View
                    </Link>
                    <button
                      onClick={() =>
                        router.push(`/admin/articles/editor/${article._id}`)
                      }
                      className="text-gray-600 hover:text-gray-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteArticle(article._id)}
                      disabled={isDeleting && selectedArticle === article._id}
                      className="text-red-600 hover:text-red-900"
                    >
                      {isDeleting && selectedArticle === article._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
