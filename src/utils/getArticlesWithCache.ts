import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import { unstable_cache } from "next/cache";

interface Article {
  _id: string;
  title: string;
  description: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  slug: string;
  productUrl?: string;
}

async function fetchArticles(): Promise<Article[]> {
  try {
    await connectToDatabase();
    const articles = await Article.find({
      archived: { $ne: true },
      tags: { $in: ["product"] },
    })
      .sort({ createdAt: -1 })
      .select("_id title description coverImage tags createdAt updatedAt slug productUrl")
      .lean();

    return articles.map((article) => ({
      _id: article._id as string,
      title: article.title,
      description: article.description,
      coverImage: article.coverImage,
      tags: article.tags || [],
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      slug: article.slug,
      productUrl: article.productUrl || null,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

const getArticles = unstable_cache(
  async () => fetchArticles(),
  ["articles-list"],
  { tags: ["articles-list"], revalidate: false }
);

export default getArticles;
