import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import Link from 'next/link';
import Image from 'next/image';

interface ArticlePreview {
  _id: string;
  title: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
}

async function getArticles(): Promise<ArticlePreview[]> {
  try {
    await connectToDatabase();
    const articles = await Article.find({})
      .sort({ createdAt: -1 })
      .select('title tags coverImage createdAt');
    
    return articles.map((article) => ({
      _id: article._id.toString(),
      title: article.title,
      coverImage: article.coverImage,
      tags: article.tags,
      createdAt: article.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Articles</h1>
      
      {articles.length === 0 ? (
        <div className="text-center p-10">
          <p className="text-gray-600">No articles published yet.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link key={article._id} href={`/articles/${article._id}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                {article.coverImage && (
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h2>
                  <p className="text-gray-600 mb-4">{formatDate(article.createdAt)}</p>
                  
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
} 
