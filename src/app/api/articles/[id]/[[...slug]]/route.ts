import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Article from "@/models/Article";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/auth";
import { Types } from "mongoose";
import { deleteCachedData } from "@/lib/redis";
import { REDIS_CACHE_CONSTANTS } from "@/constants/redis-cache";
import { revalidatePath } from "next/cache";

// GET - Get a single article by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();
    const article = await Article.findOne({
      $or: [{ slug: id }, { _id: Types.ObjectId.isValid(id) ? id : null }],
    });

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...article.toObject(),
      _id: article._id.toString(),
    });
  } catch (error) {
    console.error("Error in GET /api/articles/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

// PATCH - Update article (handle all fields)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, slug } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid article ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Extract all fields from the body
    const data = await request.json();
    const {
      title,
      content,
      coverImage,
      tags,
      description,
      productUrl,
      archived,
    } = data;

    // Optional: Add validation here if needed (e.g., ensure title is not empty if provided)
    if (title !== undefined && !title) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }
    if (content !== undefined && (content === null || content === "")) {
      return NextResponse.json(
        { error: "Content cannot be empty" },
        { status: 400 }
      );
    }

    // Prepare update object, only including fields that were actually sent
    const updateData: Partial<typeof data> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (tags !== undefined) updateData.tags = tags;
    if (description !== undefined) updateData.description = description;
    if (productUrl !== undefined) updateData.productUrl = productUrl || null;
    if (archived !== undefined) updateData.archived = archived || false;

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    // Update only the provided fields
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    deleteCachedData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${id}`);
    deleteCachedData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${slug}`);
    deleteCachedData(REDIS_CACHE_CONSTANTS.ARTICLES_LIST_KEY);
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${id}`);
    revalidatePath(`/articles/${slug}`);

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a single article
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  try {
    const { id, slug } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectToDatabase();

    // Validate ID format before attempting delete
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid article ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Archive the article by setting the `archived` field to true
    const article = await Article.findByIdAndUpdate(
      id,
      { $set: { archived: true } },
      { new: true } // Return the updated document
    );

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    deleteCachedData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${id}`);
    deleteCachedData(`${REDIS_CACHE_CONSTANTS.ARTICLES_DETAIL_KEY}:${slug}`);
    deleteCachedData(REDIS_CACHE_CONSTANTS.ARTICLES_LIST_KEY);
    revalidatePath("/");
    revalidatePath("/articles");
    revalidatePath(`/articles/${id}`);
    revalidatePath(`/articles/${slug}`);

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error in DELETE /api/articles/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
