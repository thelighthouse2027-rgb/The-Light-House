'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SafariSection({ locale }: { locale: string }) {
  const t = useTranslations('SafariSection');

  return (
    // نفس الكلاسات الرئيسية بتاعت الهيرو بالظبط (الارتفاع، البرواز، الشادو، التوسيط)
    <section className="relative h-[85vh] w-full flex items-center justify-center text-center overflow-hidden rounded-3xl border border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-black group">
      
      {/* الفيديو بنفس ستايل الهيرو مع الحفاظ على تأثير الـ Hover للزوم */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0 scale-105 filter brightness-90 transition-transform duration-1000 group-hover:scale-110"
      >
        <source src="/videos/safari.mp4" type="video/mp4" />
      </video>

      {/* نفس طبقة التعتيم بتاعة الهيرو بالظبط */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40 z-10"></div>

      {/* محتوى السفاري متسنتر بنفس طريقة الهيرو */}
      <div className="relative z-20 flex flex-col items-center gap-6 px-4 max-w-4xl mx-auto">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-red-600/40 text-red-500 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          {t('badge')}
        </div>

        {/* نفس حجم خطوط الهيرو */}
        <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
          {t('title')}
        </h2>

        <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl font-light leading-relaxed drop-shadow-md">
          {t('subtitle')}
        </p>

        {/* زر الانتقال لصفحة السفاري */}
        <div className="mt-6">
          <Link
            href={`/${locale}/services/safari`}
            className="inline-flex px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:-translate-y-1 active:translate-y-0 border border-red-500 items-center gap-3 text-lg"
          >
            <span>{t('exploreBtn')}</span>
            <svg className="w-6 h-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

      </div>

    </section>
  );
}