import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import SafariSection from '../components/SafariSection';
import InfoSection from '../components/InfoSection';
import LocationSection from '../components/LocationSection';
import VideoGallery from '../components/VideoGallery';
import PromoBanner from '../components/PromoBanner';
import PromoPopup from '../components/PromoPopup';
import { client } from '@/sanity/lib/client';

export const revalidate = 0;

async function getPromoBanner() {
  const query = `*[_type == "promoBanner"][0]{
    ...,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const bannerData = await getPromoBanner();

  return (
    <main className="w-full">
      
      <PromoPopup data={bannerData} locale={locale} />
      
      <div className="w-full">
        <PromoBanner data={bannerData} locale={locale} />
      </div>
      
      <div className="pb-10 px-2 md:px-6">
        <Hero />
      </div>
      
      <div className="w-full pb-10">
        <Services locale={locale} />
      </div>

      <div className="w-full pb-10">
        <Features />
      </div>

      <div className="w-full pb-20 px-2 md:px-6">
        <SafariSection locale={locale} />
      </div>

      <div className="w-full py-10">
        <VideoGallery locale={locale} />
      </div>

      <div className="w-full pb-20 px-2 md:px-6">
        <InfoSection locale={locale} />
      </div>

      <div className="w-full pb-20 px-2 md:px-6 relative z-10">
        <LocationSection />
      </div>

    </main>
  );
}