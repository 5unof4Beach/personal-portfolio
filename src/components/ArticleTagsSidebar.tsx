import React from 'react';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  createdAt: string;
  tags: string[];
}

interface ArticlesByTag {
  [key: string]: Article[];
}

interface ArticleTagsSidebarProps {
  articles: Article[];
}

export default function ArticleTagsSidebar({ articles }: ArticleTagsSidebarProps) {
  // Group articles by tag and sort by date within each tag
  const articlesByTag: ArticlesByTag = articles.reduce((acc: ArticlesByTag, article) => {
    article.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = [];
      }
      acc[tag].push(article);
    });
    return acc;
  }, {});

  // Sort articles within each tag by date
  Object.keys(articlesByTag).forEach(tag => {
    articlesByTag[tag].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  // Sort tags by number of articles (most articles first)
  const sortedTags = Object.keys(articlesByTag).sort(
    (a, b) => articlesByTag[b].length - articlesByTag[a].length
  );

  return (
    <aside className="sticky top-20 p-4 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Articles by tag</h2>
      <div className="space-y-6 md:max-h-[70vh] md:overflow-y-auto md:pr-2">
          {sortedTags.map(tag => (
          <div key={tag} className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              #{tag} <span className="text-sm text-gray-500">({articlesByTag[tag].length})</span>
            </h3>
            <ul className="space-y-2">
                {articlesByTag[tag].map(article => (
                  <li key={article._id}>
                    <Link 
                      href={`/articles/${article._id}`}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline block truncate"
                    >
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
          </div>
          ))}
      </div>
    </aside>
  );
}
