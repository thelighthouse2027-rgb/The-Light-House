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

  // نصوص المؤسس والاعتمادات الرسمية مترجمة داخلياً لكل لغة تلقائياً
  const contentMap: Record<string, {
    founderRole: string;
    founderName: string;
    founderBio: string;
    experienceBadge: string;
    safetyBadge: string;
    certificationsTitle: string;
    cdwsTitle: string;
    cdwsDesc: string;
    padiTitle: string;
    padiDesc: string;
    isoTitle: string;
    isoDesc: string;
    verifyLink: string;
  }> = {
    de: {
      founderRole: 'Gründer & Geschäftsführer',
      founderName: 'Yasser Zidan',
      founderBio: 'Angetrieben von einer tiefen Leidenschaft für das Rote Meer und langjähriger maritimer Erfahrung gründete Yasser Zidan The Light House Diving Center mit einer klaren Vision: internationale Tauchstandards mit echter Gastfreundschaft zu verbinden. Unter seiner Führung wird jeder Tauchgang zu einem inspirierenden und sicheren Unterwassererlebnis.',
      experienceBadge: 'Jahre an maritimer Erfahrung',
      safetyBadge: 'Höchste internationale Sicherheitsstandards',
      certificationsTitle: 'Offizielle Akkreditierungen & Lizenzen',
      cdwsTitle: 'CDWS Zertifiziert',
      cdwsDesc: 'Offiziell zertifiziertes und lizenziertes Mitglied (#7181) gemäß den Vorschriften des ägyptischen Tourismusministeriums.',
      padiTitle: 'PADI-zertifiziertes Tauchcenter',
      padiDesc: 'Autorisiertes Tauchzentrum für erstklassige Ausbildung und geführte Tauchausflüge nach globalen Standards.',
      isoTitle: 'ISO-Qualitätszertifiziert',
      isoDesc: 'Vollständige Einhaltung internationaler Standards für Freizeittauchdienste und Sicherheit (ISO 24803).',
      verifyLink: 'Offizielle Lizenz prüfen'
    },
    fr: {
      founderRole: 'Fondateur et Directeur Général',
      founderName: 'Yasser Zidan',
      founderBio: "Animé par une véritable passion pour la mer Rouge et des années d'expertise maritime, Yasser Zidan a fondé The Light House Diving Center avec une vision claire : associer les normes internationales de plongée à une hospitalité authentique. Chaque plongée est une aventure inoubliable bâtie sur la confiance, le professionnalisme et l'excellence.",
      experienceBadge: "Des années d'expérience en mer Rouge",
      safetyBadge: 'Engagement absolu envers la sécurité',
      certificationsTitle: 'Accréditations & Licences Officielles',
      cdwsTitle: 'Certifié CDWS',
      cdwsDesc: 'Membre officiel et agréé (#7181), en parfaite conformité avec les directives du Ministère égyptien du Tourisme.',
      padiTitle: 'Centre de Plongée PADI',
      padiDesc: "Centre agréé dispensant des formations récréatives et des sorties d'exploration selon les normes mondiales.",
      isoTitle: 'Conformité aux Normes ISO',
      isoDesc: 'Conformité totale avec les normes internationales relatives aux services de plongée de loisir (ISO 24803).',
      verifyLink: 'Vérifier la licence officielle'
    },
    pl: {
      founderRole: 'Założyciel i Dyrektor Zarządzający',
      founderName: 'Yasser Zidan',
      founderBio: 'Kierując się pasją do Morza Czerwonego oraz wieloletnim doświadczeniem morskim, Yasser Zidan założył The Light House Diving Center z wizją połączenia światowych standardów nurkowania z prawdziwą gościnnością. Pod jego kierownictwem każde nurkowanie staje się bezpieczną i niezapomnianą przygodą.',
      experienceBadge: 'Lata doświadczenia na Morzu Czerwonym',
      safetyBadge: 'Zgodność z normami bezpieczeństwa',
      certificationsTitle: 'Oficjalne Akredytacje i Certyfikaty',
      cdwsTitle: 'Certyfikat CDWS',
      cdwsDesc: 'Oficjalnie certyfikowany członek (#7181), w pełni spełniający wymogi egipskiego Ministerstwa Turystyki.',
      padiTitle: 'Centrum Nurkowe PADI',
      padiDesc: 'Autoryzowane centrum oferujące szkolenia oraz profesjonalne wyprawy nurkowe według standardów światowych.',
      isoTitle: 'Zgodność z Normami ISO',
      isoDesc: 'Pełna zgodność z międzynarodowymi normami dotyczącymi rekreacyjnych usług nurkowych (ISO 24803).',
      verifyLink: 'Sprawdź oficjalną licencję'
    },
    en: {
      founderRole: 'Founder & Managing Director',
      founderName: 'Yasser Zidan',
      founderBio: 'Driven by a genuine passion for the Red Sea and years of maritime expertise, Yasser Zidan established The Light House Diving Center with a clear vision: delivering world-class diving standards alongside genuine Red Sea hospitality. Under his leadership, every dive is crafted as an inspiring underwater journey defined by trust, rigorous safety standards, and unforgettable memories for divers from around the world.',
      experienceBadge: 'Years of Red Sea Leadership',
      safetyBadge: 'Strict Safety & Quality Commitment',
      certificationsTitle: 'Official Accreditations & Licenses',
      cdwsTitle: 'CDWS Certified',
      cdwsDesc: 'Officially certified and licensed member (#7181) under Egyptian Ministry of Tourism regulations.',
      padiTitle: 'PADI Dive Center',
      padiDesc: 'Authorized dive center delivering world-class recreational training and guided sea excursions.',
      isoTitle: 'ISO Standards Compliant',
      isoDesc: 'Full adherence to international safety and recreational diving service quality standards (ISO 24803).',
      verifyLink: 'Verify Official License'
    }
  };

  const currentContent = contentMap[locale] || contentMap.en;

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
                  alt={currentContent.founderName}
                  title={currentContent.founderName}
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
                  {currentContent.founderRole}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                  {currentContent.founderName}
                </h2>
              </div>

              <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
                {currentContent.founderBio}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl shrink-0">
                    <FaAward className="text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">
                    {currentContent.experienceBadge}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl shrink-0">
                    <FaShieldAlt className="text-xl" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-200">
                    {currentContent.safetyBadge}
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
              {currentContent.certificationsTitle}
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
                <h3 className="text-xl font-bold text-white mb-2">{currentContent.cdwsTitle}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {currentContent.cdwsDesc}
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
                  <span>{currentContent.verifyLink}</span>
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
                <h3 className="text-xl font-bold text-white mb-2">{currentContent.padiTitle}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {currentContent.padiDesc}
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
                  <span>{currentContent.verifyLink}</span>
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
                <h3 className="text-xl font-bold text-white mb-2">{currentContent.isoTitle}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {currentContent.isoDesc}
                </p>
              </div>

              <div className="w-full py-3 px-4 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-center text-center">
                <span>{currentContent.isoDesc}</span>
              </div>
            </div>

          </div>
        </div>

        {/* الكروت السابقة pp.webp */}
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

        {/* قسم السلامة والأمان */}
        <div className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-red-950/40 via-zinc-900/60 to-black border border-red-600/30 p-8 md:p-14 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6">{t('safetyTitle')}</h3>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
              {t('safetyDesc')}
            </p>
          </div>
        </div>

        {/* معرض الصور */}
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
