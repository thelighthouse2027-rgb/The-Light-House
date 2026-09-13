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

// ترجمة الـ Meta Description للغات الأربع
const metaDescriptions: Record<string, string> = {
  en: "Explore and book your diving, snorkeling, and safari adventures with The Light House.",
  de: "Entdecken und buchen Sie Ihre Tauch-, Schnorchel- und Safari-Abenteuer mit The Light House.",
  fr: "Explorez et réservez vos aventures de plongée, de snorkeling et de safari avec The Light House.",
  pl: "Odkryj i zarezerwuj swoje przygody nurkowe, snorkelingowe i safari z The Light House."
};

const metaTitles: Record<string, string> = {
  en: "The Light House - Diving & Safari Adventures",
  de: "The Light House - Tauch- & Safari-Abenteuer",
  fr: "The Light House - Plongée & Aventures Safari",
  pl: "The Light House - Nurkowanie i Przygody Safari"
};

// توليد العنوان والوصف تلقائياً حسب لغة المستخدم
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';

  return {
    title: metaTitles[lang] || metaTitles.en,
    description: metaDescriptions[lang] || metaDescriptions.en,
  };
}

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