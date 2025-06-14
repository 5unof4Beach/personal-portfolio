import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/auth";
import {deleteCachedData} from "@/lib/redis";
import { REDIS_CACHE_CONSTANTS } from "@/constants/redis-cache";
import { revalidatePath } from "next/cache";

// GET - Get all articles (Return necessary fields for preview)
export async function GET() {
  try {
    await connectToDatabase();
    const articles = await Article.find()
      .sort({ updatedAt: -1 })
      .select("title description tags coverImage createdAt archived slug");

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// POST - Create new article (handle all fields)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    const article = await Article.create({
      ...data,
    });

    deleteCachedData(REDIS_CACHE_CONSTANTS.ARTICLES_LIST_KEY);
    revalidatePath("/");
    revalidatePath("/articles");

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error in POST /api/articles:", error);
    return NextResponse.json(
      { error: "Failed to create article" },
      { status: 500 }
    );
  }
}
