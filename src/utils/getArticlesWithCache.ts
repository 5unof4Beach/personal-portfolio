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
}

async function fetchArticlesFromDb(): Promise<Article[]> {
  try {
    await connectToDatabase();
    const articles = await Article.find({
      archived: false,
      tags: { $in: ["product"] },
    }).sort({ createdAt: -1 });

    return articles.map((article) => ({
      _id: article._id.toString(),
      title: article.title,
      coverImage: article.coverImage,
      description: article.description,
      tags: article.tags,
      createdAt: article.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

const getArticles = unstable_cache(
  async () => fetchArticlesFromDb(),
  ["articles-list"],
  { tags: ["articles-list"], revalidate: false }
);

export default getArticles;
