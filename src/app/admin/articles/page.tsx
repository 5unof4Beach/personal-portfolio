"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ArticleTableRow from "@/components/ArticleTableRow";

// Updated interface to include fields returned by API
interface Article {
  _id: string;
  title: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  archived?: boolean;
  slug: string;
}

export default function ArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
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

      const deletedArticle = await response.json();
      setArticles((prevArticles) => {
        const filteredArticles = prevArticles.filter((article) => article._id !== id);
        const updatedArticles = [deletedArticle, ...filteredArticles];
        return updatedArticles;
      });
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setIsDeleting(false);
      setSelectedArticle(null);
    }
  }

  async function restoreArticle(id: string) {
    try {
      setIsRestoring(true);
      setSelectedArticle(id);
      const response = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ archived: false }),
      });
      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      const restoredArticle = await response.json();
      setArticles((prevArticles) => {
        const filteredArticles = prevArticles.filter((article) => article._id !== id);
        const updatedArticles = [restoredArticle,...filteredArticles];
        return updatedArticles;
      });
    } catch (error) {
      console.error("Error deleting article:", error);
    } finally {
      setIsRestoring(false);
      setSelectedArticle(null);
    }
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
              {articles
                .filter((article) => !article.archived)
                .map((article) => (
                  <ArticleTableRow
                    key={article._id}
                    article={article}
                    action={{
                      name: "Delete",
                      function: () => deleteArticle(article._id),
                    }}
                    isLoading={isDeleting && selectedArticle === article._id}
                    selectedArticle={selectedArticle}
                  />
                ))}
            </tbody>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles
                .filter((article) => article.archived)
                .map((article) => (
                  <ArticleTableRow
                    key={article._id}
                    article={article}
                    action={{
                      name: "Restore",
                      function: () => restoreArticle(article._id),
                    }}
                    isLoading={isRestoring && selectedArticle === article._id}
                    selectedArticle={selectedArticle}
                  />
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
