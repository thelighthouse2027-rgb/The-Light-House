import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import SafariSection from '../components/SafariSection';
import InfoSection from '../components/InfoSection';
import PromoBanner from '../components/PromoBanner';
import PromoPopup from '../components/PromoPopup'; // مكون النافذة المنبثقة للصورة
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
      
      {/* 1. النافذة المنبثقة (تظهر أول ما يفتح الموقع وتتضمن الصورة وزر الإغلاق) */}
      <PromoPopup data={bannerData} locale={locale} />
      
      {/* 2. شريط العرض الأزرق (المستطيل الذي يوجد تحت الهيدر مباشرة) */}
      <div className="w-full">
        <PromoBanner data={bannerData} locale={locale} />
      </div>
      
      {/* 3. السكشن الأول: الهيرو */}
      <div className="pb-10 px-2 md:px-6">
        <Hero />
      </div>
      
      {/* 4. السكشن الثاني: الخدمات */}
      <div className="w-full pb-10">
        <Services locale={locale} />
      </div>

      {/* 5. السكشن الثالث: المميزات */}
      <div className="w-full pb-10">
        <Features />
      </div>

      {/* 6. السكشن الرابع: السفاري */}
      <div className="w-full pb-20 px-2 md:px-6">
        <SafariSection locale={locale} />
      </div>

      {/* 7. السكشن الخامس: من نحن */}
      <div className="w-full pb-20 px-2 md:px-6">
        <InfoSection locale={locale} />
      </div>

    </main>
  );
}