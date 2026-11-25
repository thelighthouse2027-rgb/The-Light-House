'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface ServiceItem {
  slug: string;
  img: string;
  key: string;
}

const SERVICES_LIST: readonly ServiceItem[] = [
  { slug: 'courses', img: '/divingcourses.webp', key: 'diving-courses' },
  { slug: 'boat-trips', img: '/cruises.webp', key: 'boat-trips' },
  { slug: 'daily-diving', img: '/diving.webp', key: 'diving-trips' },
];

export default function Services({ locale }: { locale: string }) {
  const t = useTranslations('ServicesSection');

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto bg-black">
      <header className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {t('title')}
        </h2>
        <p className="text-zinc-100 text-lg max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {SERVICES_LIST.map((item) => {
          const itemTitle = t(`items.${item.key}.title`);
          const itemDesc = t(`items.${item.key}.desc`);

          return (
            <Link
              key={item.slug}
              href={`/${locale}/services/${item.slug}`}
              title={itemTitle}
              aria-label={itemTitle}
              className="group relative h-[440px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition duration-500 hover:-translate-y-3 hover:shadow-[0_0_35px_rgba(37,99,235,0.35)] block"
            >
              <div className="absolute inset-0">
                <Image 
                  src={item.img} 
                  alt={itemTitle} 
                  title={itemTitle}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end group-hover:from-black/95 z-10">
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {itemTitle}
                </h3>

                <p className="text-zinc-100 text-sm font-light mb-4 line-clamp-2">
                  {itemDesc}
                </p>

                <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>{t('learnMore')}</span>
                  <span className="rtl:rotate-180 transition-transform">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
