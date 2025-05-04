import fetchBanners from "@/utils/getBannersWithCache";
import EmblaCarousel from "@/components/CampaignCarousel/EmblaCarousel";
import { EmblaOptionsType } from "embla-carousel";

const OPTIONS: EmblaOptionsType = { dragFree: true, loop: true };

export default async function BannerCarousel() {
  const banners = await fetchBanners();

  if (banners.length === 0) {
    return null;
  }

  return (
    <div className="py-8 lg:py-16">
      <EmblaCarousel slides={banners} options={OPTIONS} />
    </div>
  );
}
