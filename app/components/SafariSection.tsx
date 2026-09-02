'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function SafariSection({ locale }: { locale: string }) {
  const t = useTranslations('SafariSection');

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center text-center overflow-hidden rounded-3xl border border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-black group">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0 scale-105 transition-transform duration-1000 group-hover:scale-110"
      >
        <source src="/videos/safari.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/70 z-10"></div>

      <div className="relative z-20 flex flex-col items-center gap-6 px-4 max-w-4xl mx-auto">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-blue-600/40 text-blue-400 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(37,99,235,0.2)]">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          {t('badge')}
        </div>

        <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          {t('title')}
        </h2>

        <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl font-light leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="mt-6">
          <Link
            href={`/${locale}/services/safari`}
            className="inline-flex px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)] hover:-translate-y-1 active:translate-y-0 border border-blue-500 items-center gap-3 text-lg cursor-pointer"
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