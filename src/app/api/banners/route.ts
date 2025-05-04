import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/helpers/auth";
import { revalidateTag } from "next/cache";

export async function GET() {
  try {
    await connectToDatabase();
    const banners = await Banner.find()
      .sort({ updatedAt: -1 })
      .select("title bannerImage createdAt archived");

    return NextResponse.json(banners);
  } catch (error) {
    console.error("Error fetching banners:", error);
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const data = await request.json();

    await connectToDatabase();

    const banner = await Banner.create({
      ...data,
    });

    revalidateTag("banner-list");

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error in POST /api/banners:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}
