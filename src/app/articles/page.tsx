import Link from "next/link";
import Image from "next/image";
import ArticleTagsSidebar from "@/components/ArticleTagsSidebar";
import fetchArticles from "@/utils/getArticlesWithCache";

export default async function ArticlesPage() {
  const articles = await fetchArticles();

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
      <main className="container mx-auto px-4 py-8 bg-white">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 lg:w-72 order-2 md:order-1">
            <ArticleTagsSidebar articles={articles} />
          </div>
          <section className="flex-1 max-w-full md:max-w-3xl order-1 md:order-2">
          {articles.length === 0 ? (
            <div className="text-center p-10">
              <p className="text-gray-600">No articles published yet.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {articles.map((article) => (
                <article key={article._id} className="group">
                  <Link href={`/articles/${article.slug}`}>
                    <div className="flex flex-col space-y-2">
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
                      
                      <h1 className="text-4xl font-bold text-gray-900">
                        {article.title}
                      </h1>

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
        </div>
      </main>
    </>
  );
}
