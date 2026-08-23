import Hero from '../components/Hero';
import Services from '../components/Services';
import Features from '../components/Features';
import SafariSection from '../components/SafariSection';
import InfoSection from '../components/InfoSection'; // تم استيراد سكشن من نحن هنا بسلام

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="w-full">
      
      {/* 1. السكشن الأول: الهيرو */}
      <div className="pt-2 md:pt-4 pb-10 px-2 md:px-6">
        <Hero />
      </div>
      
      {/* 2. السكشن الثاني: الخدمات */}
      <div className="w-full pb-10">
        <Services locale={locale} />
      </div>

      {/* 3. السكشن الثالث: المميزات */}
      <div className="w-full pb-10">
        <Features />
      </div>

      {/* 4. السكشن الرابع: السفاري */}
      <div className="w-full pb-20 px-2 md:px-6">
        <SafariSection locale={locale} />
      </div>

      {/* 5. السكشن الخامس: من نحن */}
      <div className="w-full pb-20 px-2 md:px-6">
        <InfoSection locale={locale} />
      </div>

    </main>
  );
}