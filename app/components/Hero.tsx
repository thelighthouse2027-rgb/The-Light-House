'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Hero() {
  const t = useTranslations('HomePage');
  const locale = useLocale(); // يجيب اللعة الحالية تلقائياً وبأمان تام

  return (
    <section className="relative h-[85vh] w-full flex items-center justify-center text-center overflow-hidden rounded-3xl border border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-black">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-black/70 z-10"></div>

      <div className="absolute z-20 flex flex-col items-center gap-6 px-4 max-w-4xl mx-auto mt-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-red-600/40 text-red-500 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          The Light House Experience
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
          {t('title')}
        </h1>

        <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl font-light leading-relaxed">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <button className="w-full sm:w-auto px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:-translate-y-1 active:translate-y-0 border border-red-500 cursor-pointer">
            Explore Tours
          </button>
          
          {/* رابط Contact Us باللغة الصحيحة تلقائياً */}
          <Link 
            href={`/${locale}/contact`}
            className="w-full sm:w-auto px-10 py-4 bg-zinc-900/80 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all duration-300 border border-zinc-700 hover:border-zinc-500 backdrop-blur-md cursor-pointer inline-flex items-center justify-center"
          >
            Contact Us
          </Link>
        </div>

      </div>

    </section>
  );
}