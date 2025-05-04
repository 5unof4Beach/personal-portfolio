import connectToDatabase from "@/lib/mongodb";
import Banner from "@/models/Banner";
import { getCachedData, cacheData } from "@/lib/redis";
import { REDIS_CACHE_CONSTANTS } from "@/constants/redis-cache";
import { ObjectId } from "mongodb";

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
    const cachedData = await getCachedData(REDIS_CACHE_CONSTANTS.BANNERS_LIST_KEY);
    if (cachedData) {
      return cachedData;
    }

    await connectToDatabase();
    const banners = await Banner.find({
      archived: { $ne: true },
    })
      .sort({ createdAt: -1 })
      .select("_id title bannerImage action")
      .lean();

    const bannersData = banners.map((banner) => ({
      _id: (banner._id as ObjectId).toString(),
      title: banner.title,
      bannerImage: banner.bannerImage,
      action: banner.action || {},
    }));

    await cacheData(REDIS_CACHE_CONSTANTS.BANNERS_LIST_KEY, bannersData, REDIS_CACHE_CONSTANTS.BANNERS_LIST_KEY_EXPIRATION);

    return bannersData;
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default fetchBanners;
