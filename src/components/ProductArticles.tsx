'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Article {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
}

export default function ProductArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/articles');
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }
      const data = await response.json();
      // Filter articles with "product" tag
      const productArticles = data.filter((article: Article) =>
        article.tags.includes('product')
      );
      setArticles(productArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <section id="projects" className="py-16 md:py-20 scroll-mt-16">
        <div className="container mx-auto px-6">
          <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">
            Products
          </h2>
          <div className="text-center">Loading products...</div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="py-16 md:py-20 scroll-mt-16">
      <div className="container mx-auto px-6">
        <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">
          Products
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article._id}
              className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              {article.coverImage && (
                <div className="relative h-48 w-full bg-stone-200">
                  <Image
                    src={article.coverImage}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">
                  {article.title}
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  {article.description}
                </p>
                <div className="mb-4 flex flex-wrap gap-2 justify-start">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="rounded bg-stone-100 px-2 py-1 text-xs font-medium font-semibold text-gray-700 "
                    >
                      # {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={`/articles/${article._id}`}
                  className="mt-2 inline-block rounded bg-stone-800 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-stone-900"
                >
                  View Product
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
