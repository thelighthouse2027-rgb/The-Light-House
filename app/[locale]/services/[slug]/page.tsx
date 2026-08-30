import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  
  // جلب الترجمات الخاصة بالخدمات
  const t = await getTranslations('ServicesSection');

  // خريطة الصور الخاصة بكل خدمة
  const imagesMap: Record<string, string> = {
    'diving-courses': '/divingcourses.webp',
    'boat-trips': '/cruises.webp',
    'diving-trips': '/diving.webp',
    'safari': '/safari.webp',
  };

  const currentImage = imagesMap[slug] || '/a.webp';

  // التأكد من وجود مفتاح الترجمة للخدمة لتفادي الأخطاء، أو عرض القيمة الافتراضية
  const serviceTitle = t.has(`items.${slug}.title`) ? t(`items.${slug}.title`) : slug.replace('-', ' ');
  const serviceDesc = t.has(`items.${slug}.desc`) ? t(`items.${slug}.desc`) : "Explore our exclusive service and live an unforgettable experience.";

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto text-white">
      {/* زر العودة */}
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{locale === 'ar' ? 'العودة للرئيسية' : locale === 'de' ? 'Zurück zur Startseite' : locale === 'fr' ? 'Retour à l\'accueil' : 'Back to Home'}</span>
      </Link>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden p-6 md:p-12 shadow-2xl">
        
        {/* صورة الخدمة */}
        <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden mb-8 border border-white/10">
          <img src={currentImage} alt={serviceTitle} className="w-full h-full object-cover" />
        </div>

        {/* عنوان الخدمة مترجم */}
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-red-500 capitalize">
          {serviceTitle}
        </h1>

        {/* وصف الخدمة مترجم */}
        <p className="text-zinc-300 text-lg leading-relaxed mb-8">
          {serviceDesc}
        </p>

        {/* زر الانتقال لصفحة الحجز والبيانات */}
        <Link
          href={`/${locale}/book/${slug}`}
          className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer"
        >
          {locale === 'ar' ? 'احجز هذه الخدمة الآن' : locale === 'de' ? 'Diesen Service jetzt buchen' : locale === 'fr' ? 'Réserver ce service maintenant' : 'Book This Service Now'}
        </Link>
        
      </div>
    </main>
  );
}