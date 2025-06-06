import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import { notFound } from "next/navigation";
import ArticleContentViewer from "@/components/ArticleContentViewer";
import { Types } from "mongoose";
import { redirect } from 'next/navigation'
import { getCachedData, cacheData } from "@/lib/redis";
import { REDIS_CACHE_CONSTANTS } from "@/constants/redis-cache";

interface ArticlePageProps {
  params: Promise<{ id: string; slug: string }>;
}

interface ArticleData {
  _id: string;
  content: string;
  title: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

async function fetchArticleFromDb(id: string): Promise<ArticleData | null> {
  try {
    const cachedArticle = await getCachedData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${id}`);
    if (cachedArticle) {
      return cachedArticle;
    }

    await connectToDatabase();
    const article = await Article.findOne({ 
      $or: [
        { _id: Types.ObjectId.isValid(id) ? id : null },
        { slug: id }
      ]
    });

    if (!article) {
      return null;
    }

    const contentString =
      typeof article.content === "string" ? article.content : "";

    const articleData = {
      _id: article._id.toString(),
      content: contentString,
      title: article.title,
      coverImage: article.coverImage,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      slug: article.slug
    };

    await cacheData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${article._id}`, articleData, REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY_EXPIRATION);
    await cacheData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${article.slug}`, articleData, REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY_EXPIRATION);
    return articleData;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

export default async function ArticlePage(props: ArticlePageProps) {
  const params = await props.params;
  const slug = params.slug;
  const article = await fetchArticleFromDb(slug);

  if (!article) {
    notFound();
  }

  // Redirect to the canonical URL if needed
  if (params.slug !== article.slug) {
    return redirect(`/articles/${article.slug}`);
  }

  return (
    <>
      <main className="min-h-screen px-4 bg-white">
        <div className="container mx-auto bg-white p-6 md:p-10 rounded-lg max-w-3xl lg:max-w-4xl">
          <article>
            <h1 className="text-4xl font-bold text-gray-900">
              {article.title}
            </h1>
            <header className="mb-6 mt-2 border-gray-200 text-sm text-gray-500">
              Posted on{" "}
              {new Date(article.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </header>
            <ArticleContentViewer source={article.content} />

            <footer className="mt-12 pt-4 border-t border-gray-200 text-sm text-gray-500">
              Last updated on{" "}
              {new Date(article.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}
