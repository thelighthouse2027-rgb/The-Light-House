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

// جلب بيانات البنر والعروض
async function getPromoBanner() {
  const query = `*[_type == "promoBanner"][0]{
    ...,
    "imageUrl": image.asset->url
  }`;
  return await client.fetch(query);
}

// جلب إعدادات الـ SEO الخاصة بالصفحة الرئيسية
async function getHomeSeo(locale: string) {
  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  const query = `*[_type == "homeSeo"][0]{
    "metaTitle": metaTitle[$currentLang],
    "metaDescription": metaDescription[$currentLang]
  }`;
  return await client.fetch(query, { currentLang });
}

// توليد الميتا ديسكربشن والعنوان للرئيسية ديناميكياً لكل لغة
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const seoData = await getHomeSeo(locale);

  const defaultTitles: Record<string, string> = {
    en: "The Light House - Diving & Safari Adventures",
    de: "The Light House - Tauch- & Safari-Abenteuer",
    fr: "The Light House - Plongée & Aventures Safari",
    pl: "The Light House - Nurkowanie i Przygody Safari"
  };

  const defaultDescriptions: Record<string, string> = {
    en: "Explore and book your ultimate diving, snorkeling, and desert safari adventures in Hurghada with The Light House.",
    de: "Entdecken und buchen Sie Ihre ultimativen Tauch-, Schnorchel- und Wüstensafari-Abenteuer in Hurghada mit The Light House.",
    fr: "Explorez et réservez vos aventures ultimes de plongée, de snorkeling et de safari dans le désert à Hurghada avec The Light House.",
    pl: "Odkryj i zarezerwuj swoje niezapomniane przygody nurkowe, snorkelingowe oraz safari w Hurghadzie z The Light House."
  };

  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';

  return {
    title: seoData?.metaTitle || defaultTitles[currentLang],
    description: seoData?.metaDescription || defaultDescriptions[currentLang],
  };
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