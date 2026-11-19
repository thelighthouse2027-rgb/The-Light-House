import { getTranslations, getLocale } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DivingCoursesSection() {
  const t = await getTranslations('Features');
  const locale = await getLocale();
  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  const isRtl = locale === 'ar';

  // استعلام متوافق مع سكيما سانتي الخاصة بك
  const COURSES_QUERY = `
    *[_type == "flexiblePage" && defined(slug.current) && isActive != false && (
      pageCategory == "courses" || 
      (lower(slug.current) match "*course*" || lower(slug.current) match "*padi*" || lower(slug.current) match "*cmas*")
    )] | order(_createdAt asc) {
      "slug": slug.current,
      "title": pageTitle,
      
      // استخراج النص من Portable Text المترجم
      "desc": coalesce(
        pt::text(shortDescription[$currentLang]),
        pt::text(shortDescription.en),
        seo.metaDescription[$currentLang],
        seo.metaDescription.en,
        ""
      ),
      
      // السعر من حقل basePriceEur
      "price": coalesce(
        basePriceEur,
        sections[_type == "gridCardsSection"][0].cards[0].servicePrice,
        null
      ),

      // الصورة الرئيسية
      "img": coalesce(
        mainCoverImage.asset->url,
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
    title: page.title && typeof page.title === 'object'
      ? (page.title[currentLang] || page.title.en || 'Untitled')
      : (page.title || 'Untitled'),
    desc: page.desc || ''
  }));

  return (
    <section className="py-20 w-full overflow-hidden bg-black animate-fadeIn" dir={isRtl ? 'rtl' : 'ltr'}>
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

        {/* مسار السلايدر */}
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
                className="snap-start shrink-0 w-[280px] md:w-[335px] bg-[#0b0f19]/90 border border-neutral-800/80 rounded-[1.75rem] overflow-hidden shadow-xl flex flex-col justify-between relative group hover:border-blue-500/50 transition duration-300 cursor-pointer"
              >
                {/* الصورة والتدرج الداكن */}
                <div className="relative w-full h-[185px] overflow-hidden bg-neutral-900">
                  <Image
                    src={course.img}
                    alt={course.title}
                    title={course.title}
                    fill
                    sizes="(max-width: 768px) 290px, 335px"
                    quality={80}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* البيانات */}
                <div className="p-5 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-1 group-hover:text-blue-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 font-light leading-relaxed">
                      {course.desc}
                    </p>
                  </div>

                  {/* الجزء السفلي: السعر وزر Details & Book */}
                  <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-zinc-400 font-medium">
                        Diving Course
                      </span>
                      <div className="flex items-baseline gap-1">
                        {course.price ? (
                          <>
                            <span className="text-2xl font-black text-white tracking-tight">
                              €{course.price}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-normal">
                              / person
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-zinc-400">
                            Check Details
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="px-4 py-2 bg-[#081225] hover:bg-blue-600 text-white rounded-2xl border border-neutral-700/80 hover:border-blue-500 transition-all duration-300 flex items-center gap-2.5 shadow-md group/btn shrink-0">
                      <div className="flex flex-col text-left leading-tight">
                        <span className="text-[11px] font-bold tracking-tight">Details &</span>
                        <span className="text-[11px] font-bold tracking-tight">Book</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white group-hover/btn:translate-x-0.5 transition-transform" />
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

      {/* سكريبت التمرير السلس مع تفادي أي تعارض بالـ Build */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function() {
          const track = document.getElementById('courses-slider-track');
          const prev = document.getElementById('courses-prev-btn');
          const next = document.getElementById('courses-next-btn');
          if (!track || !prev || !next) return;

          const scrollStep = 330;
          const isRtl = document.documentElement.dir === 'rtl' || ${isRtl ? 'true' : 'false'};

          prev.onclick = function() {
            track.scrollBy({ left: (isRtl ? scrollStep : -scrollStep), behavior: 'smooth' });
          };
          next.onclick = function() {
            track.scrollBy({ left: (isRtl ? -scrollStep : scrollStep), behavior: 'smooth' });
          };
        })();
      ` }} />
    </section>
  );
}
