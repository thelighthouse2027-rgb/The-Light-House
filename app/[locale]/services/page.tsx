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

  const services = [
    { slug: 'diving-courses', img: '/divingcourses.webp', key: 'diving-courses' },
    { slug: 'boat-trips', img: '/cruises.webp', key: 'boat-trips' },
    { slug: 'daily-diving', img: '/diving.webp', key: 'diving-trips' },
    { slug: 'safari', img: '/safari.webp', key: 'safari' },
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/${locale}/services/${service.slug}`}
              className="group relative h-[420px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] block"
            >
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={service.img}
                  alt={t(`items.${service.key}.title`)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end transition-colors group-hover:from-black/95 z-10">
                
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                  {t(`items.${service.key}.title`)}
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
          ))}
        </div>

      </div>
    </main>
  );
}