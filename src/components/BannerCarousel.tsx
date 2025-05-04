import getBanners from "@/utils/getBannersWithCache";
import EmblaCarousel from "@/components/CampaignCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true }

export default async function BannerCarousel() {
  const banners = await getBanners();

  if(banners.length === 0) {
    return null;
  }

  return <EmblaCarousel  slides={banners} options={OPTIONS}/>
}
