import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('AboutPage');

  return (
    <main className="w-full min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-24">
      
      {/* 1. الهيدر العلوي مع مسافة أمان (pt-36) لضمان ظهور الوجوه بوضوح تحت الهيدر الثابت */}
      <section className="relative h-[65vh] md:h-[75vh] w-full flex items-center justify-center overflow-hidden pt-36 md:pt-40">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/about.webp"
            alt="About The Light House"
            title="About The Light House"
            fill
            priority
            className="object-cover object-center filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <span className="px-4 py-1.5 rounded-full bg-red-600/20 border border-red-600/40 text-red-400 text-xs md:text-sm font-semibold tracking-widest uppercase inline-block mb-4 backdrop-blur-md">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-2xl">
            {t('titlePart1')} <span className="text-red-600">{t('titleHighlight')}</span>
          </h1>
          <p className="text-zinc-200 text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto drop-shadow-md">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 2. المحتوى الرئيسي والأقسام */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-20">
        
        {/* قسم التعريف والاحترافية */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white border-l-4 border-red-600 pl-4">
            {t('heading1')}
          </h2>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed mb-6 font-light">
            {t('p1')}
          </p>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
            {t('p2')}
          </p>
        </div>

        {/* شبكة الكروت مع دمج أول صورة جديدة (pp.webp) بشكل إبداعي */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:border-red-600/50 transition-all duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-6 font-bold text-xl">
                01
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('card1Title')}</h3>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light">
                {t('card1Desc')}
              </p>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 hover:border-red-600/50 transition-all duration-300 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-6 font-bold text-xl">
                02
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('card2Title')}</h3>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light">
                {t('card2Desc')}
              </p>
            </div>
          </div>

          {/* صورة pp.webp الفخمة بجانب الكروت */}
          <div className="lg:col-span-5 relative h-[450px] lg:h-[580px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl group">
            <Image
              src="/pp.webp"
              alt="The Light House Experience"
              title="The Light House Experience"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </div>

        </div>

        {/* قسم السلامة والأمان */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-black border border-red-600/30 p-8 md:p-14 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">{t('safetyTitle')}</h3>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
              {t('safetyDesc')}
            </p>
          </div>
        </div>

        {/* جاليري الصور الثنائية (ppp.webp و pppp.webp) مع المحتوى */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('discoverTitle')}</h3>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light mb-6">
                {t('discoverDesc')}
              </p>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10">
              <Image 
                src="/ppp.webp" 
                alt="Red Sea Diving" 
                title="Red Sea Diving" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('levelTitle')}</h3>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-light mb-6">
                {t('levelDesc')}
              </p>
            </div>
            <div className="relative h-64 rounded-2xl overflow-hidden border border-white/10">
              <Image 
                src="/pppp.webp" 
                alt="Diving Experience" 
                title="Diving Experience" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-500" 
              />
            </div>
          </div>

        </div>

        {/* الخاتمة وزر اتصل بنا */}
        <div className="text-center max-w-3xl mx-auto space-y-8 pt-10">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white">
            {t('passionTitle')}
          </h3>
          <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
            {t('passionDesc')}
          </p>

          <div className="pt-6">
            <Link
              href={`/${locale}/contact`}
              title={t('ctaBtn')}
              aria-label={t('ctaBtn')}
              className="inline-flex items-center justify-center px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_25px_rgba(220,38,38,0.5)] hover:scale-105 cursor-pointer"
            >
              {t('ctaBtn')}
            </Link>
          </div>
        </div>

      </section>
    </main>
  );
}