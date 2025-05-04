import connectToDatabase from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { unstable_cache } from "next/cache";

export interface Banner {
  _id: string;
  title: string;
  bannerImage: string;
  action: {
    actionText: string;
    actionUrl: string;
    isExternal: boolean;
  };
}

async function fetchBanners(): Promise<Banner[]> {
  try {
    await connectToDatabase();
    const banners = await Banner.find({
      archived: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .select("_id title bannerImage action")
      .lean();

    return banners.map((banner) => ({
      _id: banner._id as string,
      title: banner.title,
      bannerImage: banner.bannerImage,
      action: banner.action || {},
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

const getBanners = unstable_cache(async () => fetchBanners(), ["banner-list"], {
  tags: ["banner-list"],
  revalidate: false,
});

export default getBanners;
