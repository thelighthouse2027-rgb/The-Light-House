import { getTranslations, getLocale } from 'next-intl/server';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0; 

// استعلام لجلب كل الصفحات باستثناء الـ 6 صفحات المحددة لضمان خفة وأداء عالي
const COURSES_QUERY = `
  *[_type == "flexiblePage" && defined(slug.current) && !(slug.current in [
    "courses",
    "boat-trips",
    "daily-diving",
    "safari",
    "specialties",
    "diving-courses"
  ])] | order(_createdAt asc) {
    "slug": slug.current,
    "title": pageTitle,
    "desc": seo.metaDescription,
    "img": coalesce(
      sections[_type == "heroSection"][0].image.asset->url,
      sections[_type == "heroSection"][0].bgImage.asset->url,
      sections[_type == "splitSection"][0].image.asset->url,
      "/a.webp" 
    )
  }
`;

export default async function DivingCoursesSection() {
  const t = await getTranslations('Features');
  const locale = await getLocale();
  const lang = locale === 'ar' ? 'ar' : 'en';

  let pages: any[] = [];
  try {
    pages = await client.fetch(COURSES_QUERY);
  } catch (err) {
    console.error('Error fetching courses from Sanity:', err);
  }

  // معالجة البيانات بأمان وحمايتها من قيم الـ null
  const courses = (pages || []).map((page) => ({
    slug: page.slug,
    img: page.img,
    title: page.title && typeof page.title === 'object' 
      ? (page.title[lang] || page.title.en || 'Untitled') 
      : (page.title || 'Untitled'),
    desc: page.desc && typeof page.desc === 'object' 
      ? (page.desc[lang] || page.desc.en || '') 
      : (page.desc || '')
  }));

  // تكرار الكورسات لصنع شريط متحرك مستمر بلا توقف
  const duplicatedCourses = courses.length > 0 
    ? [...courses, ...courses, ...courses, ...courses] 
    : [];

  return (
    <section className="py-24 w-full overflow-hidden bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* عنوان السكشن */}
      <div className="text-center mb-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {t('heading')} <span className="text-blue-500">{t('headingHighlight')}</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* الشريط المتحرك (Ticker Container) */}
      <div className="ticker-container relative w-full overflow-hidden flex whitespace-nowrap py-4">
        {duplicatedCourses.length > 0 ? (
          <div 
            className={`flex gap-6 items-center shrink-0 course-ticker-${lang}`}
            style={{
              display: 'flex',
              width: 'max-content',
              animation: lang === 'ar' ? 'tickerAr 320s linear infinite' : 'tickerEn 320s linear infinite'
            }}
          >
            {duplicatedCourses.map((course, idx) => (
              <Link 
                key={idx}
                href={`/${locale}/services/${course.slug}`}
                className="bg-[#0b0f19]/90 border border-neutral-800/80 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col justify-between relative group hover:border-blue-500/50 transition duration-300 w-[320px] md:w-[380px] h-[420px] whitespace-normal shrink-0 cursor-pointer"
              >
                {/* صورة الكورس بأداء سريع وخفيف */}
                <div className="relative w-full h-[220px] overflow-hidden bg-neutral-900">
                  <Image
                    src={course.img}
                    alt={course.title}
                    title={course.title}
                    fill
                    sizes="400px"
                    quality={80}
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent pointer-events-none" />
                </div>

                {/* تفاصيل الكورس */}
                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition">
                      {course.title}
                    </h3>
                    <p className="text-zinc-400 text-xs line-clamp-2 font-light leading-relaxed">
                      {course.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs text-blue-400 font-medium inline-flex items-center gap-1">
                      {t('exploreMore')}
                    </span>
                    <span className="text-blue-500 text-sm">↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full text-center text-gray-500 py-10">
            {lang === 'ar' ? 'لا توجد كورسات مضافة حالياً في لوحة التحكم.' : 'No courses added in the studio yet.'}
          </div>
        )}

        {/* أنيميشن الحركة مع إيقافها فوراً عند وضع الماوس على الحاوية أو الكروت */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes tickerAr {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          @keyframes tickerEn {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .ticker-container:hover .course-ticker-ar,
          .ticker-container:hover .course-ticker-en,
          .course-ticker-ar:hover, 
          .course-ticker-en:hover {
            animation-play-state: paused !important;
          }
        `}} />
      </div>

    </section>
  );
}