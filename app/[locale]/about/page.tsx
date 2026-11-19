import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { FaAward, FaShieldAlt, FaExternalLinkAlt } from 'react-icons/fa';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('AboutPage');

  return (
    <main className="w-full min-h-screen bg-black text-white selection:bg-red-600 selection:text-white pb-24">
      
      {/* 1. الهيدر */}
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

      {/* 2. المحتوى الرئيسي */}
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 space-y-20">
        
        {/* قسم التعريف */}
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

        {/* كارت المالك والمؤسس ياسر زيدان */}
        <div className="relative bg-gradient-to-br from-zinc-900/90 via-[#0d1326]/80 to-zinc-950/90 border border-blue-500/20 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[380px] aspect-[4/3] rounded-3xl overflow-hidden border-2 border-blue-500/40 shadow-[0_0_35px_rgba(37,99,235,0.25)] group">
                <Image
                  src="/founder.jpeg" 
                  alt={t('founderName')}
                  title={t('founderName')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                  {t('founderRole')}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {t('founderName')}
                </h2>
              </div>

              <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
                {t('founderBio')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl shrink-0">
                    <FaAward className="text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">
                    {t('experienceBadge')}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl shrink-0">
                    <FaShieldAlt className="text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">
                    {t('safetyBadge')}
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* سكشن الاعتمادات الرسمية */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {t('certificationsTitle')}
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. CDWS */}
            <div className="bg-zinc-900/40 border border-white/10 hover:border-blue-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group">
              <div>
                <div className="w-20 h-16 relative bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                  <Image
                    src="/cdws.jpg"
                    alt="CDWS Official Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('cdwsTitle')}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {t('cdwsDesc')}
                </p>
              </div>

              <a
                href="https://www.cdws.travel/members/safari-boats/hurghada/thelighthouse/7181"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-blue-600/15 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold transition-all duration-300 flex items-center justify-between shadow-md group/btn cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center font-black text-[11px] text-blue-300 group-hover/btn:text-white">
                    CDWS
                  </span>
                  <span>{t('verifyLink')}</span>
                </div>
                <FaExternalLinkAlt className="text-xs opacity-70 group-hover/btn:opacity-100" />
              </a>
            </div>

            {/* 2. PADI */}
            <div className="bg-zinc-900/40 border border-white/10 hover:border-red-600/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group">
              <div>
                <div className="w-20 h-16 relative bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-5 flex items-center justify-center border border-white/10 group-hover:scale-105 transition-transform">
                  <Image
                    src="/padi.webp"
                    alt="PADI Dive Center Logo"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('padiTitle')}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {t('padiDesc')}
                </p>
              </div>

              <a
                href="https://www.padi.com/dive-center/egypt/the-lighthouse-diving-center/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-red-600/15 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white text-xs font-bold transition-all duration-300 flex items-center justify-between shadow-md group/btn cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-red-500/20 flex items-center justify-center font-black text-[10px] text-red-300 group-hover/btn:text-white tracking-tighter">
                    PADI
                  </span>
                  <span>{t('verifyLink')}</span>
                </div>
                <FaExternalLinkAlt className="text-xs opacity-70 group-hover/btn:opacity-100" />
              </a>
            </div>

            {/* 3. ISO */}
            <div className="bg-zinc-900/40 border border-white/10 hover:border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 shadow-xl group">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center p-2 mb-5 group-hover:scale-105 transition-transform">
                  <FaShieldAlt className="text-3xl text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t('isoTitle')}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {t('isoDesc')}
                </p>
              </div>

              <div className="w-full py-3 px-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center text-center">
                <span>{t('isoDesc')}</span>
              </div>
            </div>

          </div>
        </div>

        {/* شبكة الكروت القديمة pp.webp */}
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

        {/* قسم السلامة */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-black border border-red-600/30 p-8 md:p-14 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">{t('safetyTitle')}</h3>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
              {t('safetyDesc')}
            </p>
          </div>
        </div>

        {/* معرض الصور الثنائي */}
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

        {/* زر التواصل */}
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
