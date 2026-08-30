'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AboutSection({ locale }: { locale: string }) {
  const t = useTranslations('AboutSection');

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* قسم الصورة ببرواز 3D وتأثيرات الإضاءة */}
        <div className="w-full lg:w-1/2 relative group perspective-1000">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(220,38,38,0.15)] transition-all duration-700 group-hover:shadow-[0_40px_80px_rgba(220,38,38,0.3)] group-hover:-translate-y-2">
            
            {/* استخدام مكون Image المحسن من Next.js */}
            <Image 
              src="/aboutus.webp" 
              alt="About The Light House" 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
              className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-110"
              priority={false}
            />
            
            <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-[2.5rem] pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-60 pointer-events-none"></div>
          </div>

          <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-red-600/20 blur-3xl rounded-full pointer-events-none"></div>
          <div className="absolute -top-8 -left-8 w-40 h-40 bg-zinc-600/20 blur-3xl rounded-full pointer-events-none"></div>
        </div>

        {/* قسم النصوص */}
        <div className="w-full lg:w-1/2 flex flex-col items-start text-start z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-700 backdrop-blur-md mb-6 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-zinc-300 text-xs md:text-sm font-bold uppercase tracking-wider">
              {t('badge')}
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
            {t('title')}
          </h2>
          
          <h3 className="text-xl md:text-2xl text-red-500 font-semibold mb-6">
            {t('subtitle')}
          </h3>

          <p className="text-zinc-300 text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl">
            {t('description')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 w-full max-w-xl">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl">🌊</span>
              <span className="text-white font-medium text-sm">{t('stats.experience')}</span>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="text-2xl">🤿</span>
              <span className="text-white font-medium text-sm">{t('stats.team')}</span>
            </div>
          </div>

          <Link
            href={`/${locale}/aboutus`}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.7)] hover:-translate-y-1 flex items-center gap-3 cursor-pointer"
          >
            <span>{t('exploreBtn')}</span>
            <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

        </div>
      </div>
    </section>
  );
}