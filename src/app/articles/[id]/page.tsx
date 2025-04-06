import connectToDatabase from '@/lib/mongodb';
import Article from '@/models/Article';
import { notFound } from 'next/navigation';
import ArticleContentViewer from '@/components/ArticleContentViewer';

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

interface ArticleData {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

async function getContent(id: string): Promise<ArticleData | null> {
  try {
    await connectToDatabase();
    const article = await Article.findById(id).select('content createdAt updatedAt');

    if (!article) {
      return null;
    }

    const contentString = typeof article.content === 'string' ? article.content : '';

    return {
      _id: article._id.toString(),
      content: contentString,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}

export default async function ArticlePage(props: ArticlePageProps) {
  const params = await props.params;
  const id = params.id;
  const article = await getContent(id);

  if (!article) {
    notFound();
  }

  return (
    <>
      <main className="bg-stone-100 min-h-screen py-12 px-4">
        <div className="container mx-auto bg-white p-6 md:p-10 rounded-lg shadow-sm">

          <article>
            <ArticleContentViewer source={article.content} />

            <footer className="mt-12 pt-4 border-t border-gray-200 text-sm text-gray-500">
              Last updated on {new Date(article.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </footer>
          </article>
        </div>
      </main>
    </>
  );
} 
