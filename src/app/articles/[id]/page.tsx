import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import { notFound } from "next/navigation";
import ArticleContentViewer from "@/components/ArticleContentViewer";
import { unstable_cache } from "next/cache";

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

interface ArticleData {
  _id: string;
  content: string;
  title: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchArticleFromDb(id: string): Promise<ArticleData | null> {
  try {
    await connectToDatabase();
    const article = await Article.findById(id);

    if (!article) {
      return null;
    }

    const contentString =
      typeof article.content === "string" ? article.content : "";

    return {
      _id: article._id.toString(),
      content: contentString,
      title: article.title,
      coverImage: article.coverImage,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}

async function getContent(articleId: string): Promise<ArticleData | null> {
  const cachedFetch = unstable_cache(
    async () => fetchArticleFromDb(articleId),
    [`article-detail-${articleId}`],
    { tags: [`article-detail-${articleId}`], revalidate: false }
  );
  
  return cachedFetch();
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
      <main className="bg-stone-100 min-h-screen px-4 bg-white">
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
