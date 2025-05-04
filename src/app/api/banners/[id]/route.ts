import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/auth";
import { revalidateTag } from "next/cache";
import Banner from "@/models/Banner";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();
    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json({ error: "banner not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...banner.toObject(),
      _id: banner._id.toString(),
    });
  } catch (error) {
    console.error("Error in GET /api/banners/[id]:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectToDatabase();

    // Extract all fields from the body
    const data = await request.json();
    const {
      title,
      bannerImage,
      archived,
    } = data;

    // Optional: Add validation here if needed (e.g., ensure title is not empty if provided)
    if (title !== undefined && !title) {
      return NextResponse.json(
        { error: "Title cannot be empty" },
        { status: 400 }
      );
    }

    if (bannerImage !== undefined && !bannerImage) {
      return NextResponse.json(
        { error: "Banner image cannot be empty" },
        { status: 400 }
      );
    }

    const updateData: Partial<typeof data> = {};
    if (title !== undefined) updateData.title = title;
    if (bannerImage !== undefined) updateData.bannerImage = bannerImage || null;
    if (archived !== undefined) updateData.archived = archived || false;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    revalidateTag(`banner-detail-${id}`);
    revalidateTag("banner-list");

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner:", error);
    if (error instanceof Error && error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectToDatabase();

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: { archived: true } },
      { new: true } // Return the updated document
    );

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 });
    }

    revalidateTag("banner-list");
    revalidateTag(`banner-detail-${id}`);

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error in DELETE /api/banners/[id]:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
