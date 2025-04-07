import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import Link from "next/link";
import Image from "next/image";
import ArticleTagsSidebar from "@/components/ArticleTagsSidebar";

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
      .select("title tags coverImage createdAt");

    return articles.map((article) => ({
      _id: article._id.toString(),
      title: article.title,
      coverImage: article.coverImage,
      tags: article.tags,
      createdAt: article.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function ArticlesPage() {
  const articles = await getArticles();

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8 flex flex-row gap-8 bg-white">
        <ArticleTagsSidebar articles={articles} />
        <section className="flex-1 max-w-3xl">
          {articles.length === 0 ? (
            <div className="text-center p-10">
              <p className="text-gray-600">No articles published yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {articles.map((article) => (
                <article key={article._id} className="group">
                  <Link href={`/articles/${article._id}`}>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
                        {article.tags && article.tags.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-2">
                              {article.tags.map((tag: string) => (
                                <span
                                  key={tag}
                                  className="text-gray-600"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors duration-200">
                        {article.title}
                      </h2>

                      {article.coverImage && (
                        <div className="relative aspect-[2/1] overflow-hidden rounded-lg">
                          <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            style={{ objectFit: "cover" }}
                            className="transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
