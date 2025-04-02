import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleDisplay from '@/components/ArticleDisplay';

interface ArticlePageProps {
  params: {
    id: string;
  };
}

async function getArticle(id: string) {
  try {
    await connectToDatabase();
    const article = await Article.findById(id);
    
    if (!article) {
      return null;
    }
    
    return {
      ...article.toObject(),
      _id: article._id.toString(),
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticle(params.id);
  
  if (!article) {
    notFound();
  }
  
  const formattedDate = new Date(article.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        href="/articles"
        className="inline-block mb-8 text-indigo-600 hover:text-indigo-800"
      >
        ← Back to all articles
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <div className="mb-4 text-gray-600">
            Published on {formattedDate}
          </div>
          
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {article.coverImage && (
            <div className="mb-8">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-auto max-h-[400px] object-cover rounded-lg"
              />
            </div>
          )}
        </header>
        
        <div className="article-content">
          <ArticleDisplay content={article.content} />
        </div>
      </article>
    </main>
  );
} 
