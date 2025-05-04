import Image from "next/image";
import Link from "next/link";
import fetchArticles from "@/utils/getArticlesWithCache";

export default async function ProductArticles() {
  const articles = await fetchArticles();

  if (articles.length === 0) {
    return null;
  }

  return (
    <section id="products" className="py-16 md:py-20">
      <div className="container mx-auto px-6">
        <h2 className="mb-10 text-center text-3xl font-semibold text-gray-800">
          Products
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div
              key={article._id}
              className="flex flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
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
              <div className="p-6 flex flex-col grow-1 justify-between">
                <div>
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
                        className="rounded bg-stone-100 px-2 py-1 text-xs font-semibold text-gray-700"
                      >
                        # {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex w-full flex-col xl:flex-row justify-between">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="mt-2 rounded bg-stone-800 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-stone-900 w-fit"
                    prefetch={true}
                  >
                    Read
                  </Link>
                  {article.productUrl && (
                    <Link
                      href={article.productUrl}
                      className="mt-2 rounded bg-stone-800 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:bg-stone-900 w-fit"
                      target="_blank"
                    >
                      Product page
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
