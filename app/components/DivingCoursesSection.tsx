import { getTranslations, getLocale } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DivingCoursesSection() {
  const t = await getTranslations('Features');
  const locale = await getLocale();
  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  const isRtl = locale === 'ar';

  // استعلام سانتي لجلب البيانات والسعر التلقائي مباشرة
  const COURSES_QUERY = `
    *[_type == "flexiblePage" && defined(slug.current) && !(slug.current in [
      "courses",
      "boat-trips",
      "daily-diving",
      "safari",
      "specialties",
      "diving-courses",
      "desert-safari",
      "quad-safari"
    ]) && !(lower(slug.current) match "*safari*")
       && !(lower(coalesce(pageTitle[$currentLang], pageTitle.en, pageTitle, "")) match "*safari*")
    ] | order(_createdAt asc) {
      "slug": slug.current,
      "title": pageTitle,
      "desc": coalesce(seo.metaDescription[$currentLang], shortDescription[$currentLang], ""),
      
      // مسارات السعر التلقائية من سانتي
      "price": coalesce(
        price,
        servicePrice,
        coursePrice,
        pricing.price,
        sections[_type == "pricingSection"][0].plans[0].price,
        sections[_type == "pricingSection"][0].tiers[0].price,
        sections[_type == "gridCardsSection"][0].cards[0].price,
        sections[_type == "gridCardsSection"][0].cards[0].servicePrice,
        sections[_type == "featuresSection"][0].price,
        null
      ),
      "priceUnit": coalesce(priceUnit, "/ person"),

      // مسار استخراج الصور الأصلي
      "img": coalesce(
        mainCoverImage.asset->url,
        sections[_type == "heroSection"][0].image.asset->url,
        sections[_type == "heroSection"][0].bgImage.asset->url,
        sections[_type == "splitSection"][0].image.asset->url,
        "/a.webp" 
      )
    }
  `;

  let pages: any[] = [];
  try {
    pages = await client.fetch(
      COURSES_QUERY,
      { currentLang },
      { cache: 'no-store', next: { revalidate: 0 } }
    );
  } catch (err) {
    console.error('Error fetching courses from Sanity:', err);
  }

  const courses = (pages || []).map((page) => ({
    slug: page.slug,
    img: page.img,
    price: page.price,
    priceUnit: page.priceUnit,
    title: page.title && typeof page.title === 'object'
      ? (page.title[currentLang] || page.title.en || 'Untitled')
      : (page.title || 'Untitled'),
    desc: page.desc && typeof page.desc === 'object'
      ? (page.desc[currentLang] || page.desc.en || '')
      : (page.desc || '')
  }));

  return (
    <section className="py-20 w-full overflow-hidden bg-black" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* رأس القسم مع أسهم التنقل */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight">
              {t('heading')} <span className="text-blue-500">{t('headingHighlight')}</span>
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-xl">
              {t('subtitle')}
            </p>
          </div>

          {courses.length > 0 && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                id="courses-prev-btn"
                aria-label="Previous"
                className="w-10 h-10 rounded-full border border-neutral-800 bg-[#0b0f19]/90 hover:border-blue-500/50 text-white flex items-center justify-center transition-all duration-300 shadow cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4 pointer-events-none text-zinc-300" />
              </button>
              <button
                type="button"
                id="courses-next-btn"
                aria-label="Next"
                className="w-10 h-10 rounded-full border border-neutral-800 bg-[#0b0f19]/90 hover:border-blue-500/50 text-white flex items-center justify-center transition-all duration-300 shadow cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4 pointer-events-none text-zinc-300" />
              </button>
            </div>
          )}
        </div>

        {/* مسار السلايدر: كروت أصغر، تدعم السحب بالأصابع على الموبايل */}
        {courses.length > 0 ? (
          <div
            id="courses-slider-track"
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {courses.map((course, idx) => (
              <Link
                key={idx}
                href={`/${locale}/services/${course.slug}`}
                className="snap-start shrink-0 w-[280px] md:w-[320px] bg-[#0b0f19]/90 border border-neutral-800/80 rounded-[1.75rem] overflow-hidden shadow-xl flex flex-col justify-between relative group hover:border-blue-500/50 transition duration-300 cursor-pointer"
              >
                {/* الصورة مع نفس التدرج الداكن المندمج مع جسم الكارت */}
                <div className="relative w-full h-[185px] overflow-hidden bg-neutral-900">
                  <Image
                    src={course.img}
                    alt={course.title}
                    title={course.title}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    quality={80}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* تفاصيل الكارت */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1 group-hover:text-blue-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 font-light leading-relaxed">
                      {course.desc}
                    </p>
                  </div>

                  {/* الجزء السفلي: السعر من سانتي وزر الاستكشاف الأصلي */}
                  <div className="pt-3.5 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <div>
                      {course.price ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-extrabold text-white tracking-tight">
                            €{course.price}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-light">
                            {course.priceUnit}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-zinc-400 font-medium">
                          {t('exploreMore')}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-blue-400 group-hover:text-blue-300 font-medium inline-flex items-center gap-1 transition">
                      <span>{t('exploreMore')}</span>
                      <span className="text-blue-500 group-hover:translate-x-0.5 transition-transform">↗</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full text-center text-gray-500 py-12">
            {isRtl ? 'لا توجد كورسات مضافة حالياً في لوحة التحكم.' : 'No courses found in studio.'}
          </div>
        )}

      </div>

      {/* تحكم الأسهم يمين ويسار مع دعم اتجاه اللغة */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const track = document.getElementById('courses-slider-track');
          const prev = document.getElementById('courses-prev-btn');
          const next = document.getElementById('courses-next-btn');
          if (!track || !prev || !next) return;

          const scrollStep = 320;
          const isRtl = document.documentElement.dir === 'rtl' || ${isRtl};

          prev.onclick = function() {
            track.scrollBy({ left: (isRtl ? scrollStep : -scrollStep), behavior: 'smooth' });
          };
          next.onclick = function() {
            track.scrollBy({ left: (isRtl ? -scrollStep : scrollStep), behavior: 'smooth' });
          };
        })();
      `}} />
    </section>
  );
}
