import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import { getCachedData, cacheData } from "@/lib/redis";
import { REDIS_CACHE_CONSTANTS } from "@/constants/redis-cache";

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
    const cachedArticles = await getCachedData(
      REDIS_CACHE_CONSTANTS.ARTICLES_LIST_KEY
    );

    if (cachedArticles) {
      return cachedArticles;
    }

    await connectToDatabase();
    const articles = await Article.find({
      archived: { $ne: true },
      tags: { $in: ["product"] },
    })
      .sort({ createdAt: -1 })
      .select(
        "_id title description coverImage tags createdAt updatedAt slug productUrl"
      )
      .lean();

    await cacheData(
      REDIS_CACHE_CONSTANTS.ARTICLES_LIST_KEY,
      articles,
      REDIS_CACHE_CONSTANTS.ARTICLES_LIST_KEY_EXPIRATION
    );

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

export default fetchArticles;
