import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('ServicesSection');

  // مصفوفة الخدمات بعد إزالة السفاري مع الإبقاء على نفس الصور والمفاتيح
  const services = [
    { slug: 'courses', img: '/divingcourses.webp', key: 'diving-courses' },
    { slug: 'boat-trips', img: '/cruises.webp', key: 'boat-trips' },
    { slug: 'daily-diving', img: '/diving.webp', key: 'diving-trips' },
  ];

  return (
    <main className="w-full min-h-screen bg-black text-white pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* تقسيم متناسق لـ 3 كروت: عمود واحد في الموبايل، عمودين في التابلت، و 3 أعمدة متساوية تماماً في الشاشات الكبيرة */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => {
            const serviceTitle = t(`items.${service.key}.title`);

            return (
              <Link
                key={service.slug}
                href={`/${locale}/services/${service.slug}`}
                title={serviceTitle}
                aria-label={serviceTitle}
                className="group relative h-[450px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_35px_rgba(220,38,38,0.35)] block"
              >
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={service.img}
                    alt={serviceTitle}
                    title={serviceTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent p-8 flex flex-col justify-end transition-colors group-hover:from-black/95 z-10">
                  
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {serviceTitle}
                  </h3>

                  <p className="text-zinc-300 text-sm font-light mb-4 line-clamp-2">
                    {t(`items.${service.key}.desc`)}
                  </p>

                  <div className="flex items-center gap-2 text-red-400 font-semibold text-sm group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">
                    <span>{t('learnMore')}</span>
                    <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
