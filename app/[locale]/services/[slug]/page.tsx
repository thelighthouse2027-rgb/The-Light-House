import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import BookingForm from '../../../components/BookingForm';

// جلب بيانات الصفحة
async function getFlexiblePage(slug: string, locale: string) {
  const cleanSlug = decodeURIComponent(slug).trim();
  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';

  const query = `*[_type == "flexiblePage" && lower(slug.current) == lower($cleanSlug)][0]{
    "name": pageTitle,
    "slug": slug.current,
    "metaTitle": seo.metaTitle[$currentLang],
    "metaDescription": seo.metaDescription[$currentLang],
    sections[]{
      _type,
      title,
      subtitle,
      description,
      "imageUrl": image.asset->url,
      "bgImageUrl": bgImage.asset->url,
      "bgVideoUrl": coalesce(bgVideoUrl, video.asset->url, bgVideo.asset->url, file.asset->url, videoUrl, bgVideoFile.asset->url),
      layoutDirection,
      mediaType,
      ctaText,
      ctaUrl,
      sectionTitle,
      cards[]{
        cardTitle,
        cardDesc,
        "cardImageUrl": cardImage.asset->url,
        "badgeText": badgeData.badgeText[$currentLang],
        "badgeEmoji": badgeData.emoji,
        servicePrice,
        serviceSlug,
        features[]{
          "featureText": featureText[$currentLang],
          emoji
        },
        cardCtaText,
        cardCtaUrl,
        showAiGuide,
        showWhatsApp,
        whatsappNumber
      },
      formTitle,
      defaultAdultPrice,
      defaultChildPrice,
      pages[]->{
        "title": pageTitle,
        "slug": slug.current,
        "imageUrl": coalesce(
          sections[_type == "heroSection"][0].image.asset->url,
          sections[_type == "heroSection"][0].bgImage.asset->url,
          sections[_type == "splitSection"][0].image.asset->url,
          sections[_type == "splitSection"][0].bgImage.asset->url
        )
      }
    }
  }`;
  return await client.fetch(query, { cleanSlug, currentLang });
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const pageData = await getFlexiblePage(slug, locale);

  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  
  const fallbackTitle = typeof pageData?.name === 'object' 
    ? (pageData.name?.[currentLang] || pageData.name?.en || 'The Light House') 
    : (pageData?.name || 'The Light House');

  return {
    title: pageData?.metaTitle || fallbackTitle,
    description: pageData?.metaDescription || 'Explore and book your adventures with The Light House.',
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const pageData = await getFlexiblePage(slug, locale);

  if (!pageData) {
    return (
      <main className="min-h-screen pt-40 text-center text-white">
        <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
        <p className="text-zinc-400 mb-6">Could not find service with slug: {slug}</p>
        <Link href={`/${locale}`} title="Back to Home" aria-label="Back to Home" className="text-red-500 underline">Back to Home</Link>
      </main>
    );
  }

  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  const backText = locale === 'ar' ? 'العودة للرئيسية' : locale === 'de' ? 'Zurück zur Startseite' : locale === 'fr' ? 'Retour à l\'accueil' : 'Back to Home';
  const aiGuideText = 'Ask AI Guide';
  const whatsappText = locale === 'de' ? 'Über WhatsApp buchen' : locale === 'fr' ? 'Réserver via WhatsApp' : locale === 'pl' ? 'Zarezerwuj przez WhatsApp' : 'Book Instantly via WhatsApp';

  const pageName = typeof pageData.name === 'object' 
    ? (pageData.name?.[currentLang] || pageData.name?.en || 'Service') 
    : pageData.name;

  const formatUrl = (rawUrl: string | undefined, defaultSlug: string) => {
    const target = rawUrl || defaultSlug;
    if (!target) return `/${locale}`;
    if (target.startsWith('http')) return target;
    const cleanPath = target.startsWith('/') ? target : `/${target}`;
    if (cleanPath.startsWith(`/${locale}/`)) return cleanPath;
    return `/${locale}${cleanPath}`;
  };

  const mainSections = pageData.sections?.filter((s: any) => s._type !== 'bookingFormSection' && s._type !== 'internalLinksSection') || [];
  const internalLinksSection = pageData.sections?.find((s: any) => s._type === 'internalLinksSection');
  const bookingSection = pageData.sections?.find((s: any) => s._type === 'bookingFormSection');

  const formTitleText = bookingSection?.formTitle 
    ? (bookingSection.formTitle[currentLang] || bookingSection.formTitle.en) 
    : null;

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto text-white relative">
      <Link href={`/${locale}`} title={backText} aria-label={backText} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{backText}</span>
      </Link>

      <h1 className="text-4xl md:text-6xl font-extrabold mb-12 text-center text-white drop-shadow-md">
        {pageName}
      </h1>

      {bookingSection ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative">
            <div className="lg:col-span-2 space-y-16">
              {renderSections(mainSections, currentLang, locale, slug, formatUrl, pageName, aiGuideText, whatsappText)}
            </div>
            
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <BookingForm 
                adultPrice={bookingSection.defaultAdultPrice || 150}
                childPrice={bookingSection.defaultChildPrice || 150}
                locale={locale}
                serviceName={pageName}
                formTitle={formTitleText}
              />
            </div>
          </div>

          {internalLinksSection && renderSingleSection(internalLinksSection, currentLang, locale, formatUrl, slug, 0, pageName, aiGuideText, whatsappText)}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-16">
          {renderSections(mainSections, currentLang, locale, slug, formatUrl, pageName, aiGuideText, whatsappText)}
          {internalLinksSection && renderSingleSection(internalLinksSection, currentLang, locale, formatUrl, slug, 0, pageName, aiGuideText, whatsappText)}
        </div>
      )}

      {/* سكريبت لتوصيل أزرار الكروت بالويدجت الخاص بك الموجود في التطبيق */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              // 1. تفعيل البوت
              const triggerAi = e.target.closest('[data-ai-trigger]');
              if (triggerAi) {
                const chatBtn = document.getElementById('my-chat-button');
                if (chatBtn) chatBtn.click();
              }

              // 2. تفعيل الواتساب الخاص بالويدجت
              const triggerWa = e.target.closest('[data-wa-trigger]');
              if (triggerWa) {
                // البحث عن زر الواتساب الموجود في الـ AIChatWidget والضغط عليه
                const waBtn = document.querySelector('button[title="WhatsApp"]') || document.querySelector('button[aria-label="WhatsApp"]');
                if (waBtn) waBtn.click();
              }
            });
          `,
        }}
      />
    </main>
  );
}

function renderSections(sections: any[], currentLang: string, locale: string, slug: string, formatUrl: Function, pageName: string, aiGuideText: string, whatsappText: string) {
  return sections.map((section: any, index: number) => renderSingleSection(section, currentLang, locale, formatUrl, slug, index, pageName, aiGuideText, whatsappText));
}

const portableTextComponents = {
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 space-y-2 my-3">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 space-y-2 my-3">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-xl md:text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg md:text-xl font-bold text-white mt-5 mb-2">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-3 leading-relaxed">{children}</p>,
  },
  marks: {
    link: ({ value, children }: any) => {
      const href = value?.href || '#';
      const linkTitle = typeof children === 'string' ? children : 'External Link';
      return (
        <Link href={href} title={linkTitle} aria-label={linkTitle} className="text-red-400 hover:underline">
          {children}
        </Link>
      );
    },
  },
};

function renderSingleSection(section: any, currentLang: string, locale: string, formatUrl: Function, slug: string = '', index: number = 0, pageName: string = 'Service', aiGuideText: string, whatsappText: string) {
  
  if (section._type === 'splitSection') {
    const isImageLeft = section.layoutDirection === 'imageLeft';
    const buttonText = section.ctaText?.[currentLang] || 'Book Now';
    const buttonUrl = formatUrl(section.ctaUrl?.[currentLang], `/contact?service=${slug}`);
    const resolvedImage = section.imageUrl || section.bgImageUrl;
    const imageAltTitle = section.title?.[currentLang] || pageName;

    return (
      <div key={index} className={`bg-zinc-900/60 backdrop-blur-2xl border border-red-600/30 rounded-3xl overflow-hidden p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${isImageLeft ? 'md:grid-flow-dense' : ''}`}>
        <div className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-red-600/20 shadow-xl ${isImageLeft ? 'md:order-1' : 'md:order-none'}`}>
          {resolvedImage ? (
            <Image src={resolvedImage} alt={imageAltTitle} title={imageAltTitle} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">No Image</div>
          )}
        </div>
        <div className={`flex flex-col items-start text-start ${isImageLeft ? 'md:order-2' : 'md:order-none'}`}>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white">{section.title?.[currentLang]}</h2>
          <div className="max-w-none text-zinc-300 text-base leading-relaxed text-start w-full">
            {section.description?.[currentLang] && <PortableText value={section.description[currentLang]} components={portableTextComponents} />}
          </div>
          <Link href={buttonUrl} title={buttonText} aria-label={buttonText} className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-3 text-sm cursor-pointer">
            <span>{buttonText}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (section._type === 'heroSection') {
    const resolvedHeroImage = section.imageUrl || section.bgImageUrl;
    const videoUrl = section.bgVideoUrl;
    const heroBtnText = section.ctaText?.[currentLang];
    const heroBtnUrl = formatUrl(section.ctaUrl?.[currentLang], slug ? `/contact?service=${slug}` : '#');
    const heroAltTitle = section.title?.[currentLang] || pageName;

    return (
      <div key={index} className="bg-zinc-900/60 border border-red-600/30 rounded-3xl p-8 md:p-12 text-start shadow-xl flex flex-col items-start">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{section.title?.[currentLang]}</h2>
        
        <div className="text-zinc-300 max-w-none mb-8 text-start leading-relaxed w-full">
          {section.subtitle?.[currentLang] && <PortableText value={section.subtitle[currentLang]} components={portableTextComponents} />}
        </div>

        {heroBtnText && (
          <Link href={heroBtnUrl} title={heroBtnText} aria-label={heroBtnText} className="mb-8 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center gap-3 cursor-pointer">
            <span>{heroBtnText}</span>
          </Link>
        )}

        {videoUrl ? (
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 border border-white/10 shadow-2xl bg-black">
            <video
              src={videoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : resolvedHeroImage ? (
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 border border-white/10 shadow-2xl">
            <Image src={resolvedHeroImage} alt={heroAltTitle} title={heroAltTitle} fill sizes="100vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    );
  }

  if (section._type === 'gridCardsSection') {
    return (
      <div key={index} className="space-y-8">
        {section.sectionTitle?.[currentLang] && (
          <h2 className="text-3xl font-bold text-start mb-8">{section.sectionTitle[currentLang]}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {section.cards?.map((card: any, cIdx: number) => {
            const cardBtnText = card.cardCtaText?.[currentLang] || 'View Packages';
            const cardBtnUrl = formatUrl(card.cardCtaUrl?.[currentLang], card.serviceSlug || '#');
            const cardTitleText = card.cardTitle?.[currentLang] || pageName;
            const displayPrice = card.servicePrice ? `From €${card.servicePrice}` : null;
            const showAi = card.showAiGuide !== false;
            const showWa = card.showWhatsApp !== false;

            return (
              <div key={cIdx} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg text-start">
                <div>
                  {card.cardImageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                      <Image 
                        src={card.cardImageUrl} 
                        alt={cardTitleText} 
                        title={cardTitleText} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw" 
                        className="object-cover" 
                      />
                      
                      {card.badgeText && (
                        <div className="absolute top-3 left-3 z-10 bg-amber-500 text-neutral-950 font-bold px-3 py-1.5 rounded-full text-xs shadow-md flex items-center gap-1.5">
                          {card.badgeEmoji && <span className="text-sm leading-none">{card.badgeEmoji}</span>}
                          <span>{card.badgeText}</span>
                        </div>
                      )}

                      {displayPrice && (
                        <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-md text-teal-300 border border-teal-500/30 px-3.5 py-1 rounded-full text-xs font-semibold shadow-md">
                          {displayPrice}
                        </div>
                      )}
                    </div>
                  )}

                  <h3 className="text-xl font-bold mb-3">{card.cardTitle?.[currentLang]}</h3>
                  
                  <div className="text-zinc-400 text-sm mb-4 leading-relaxed w-full">
                    {card.cardDesc?.[currentLang] && <PortableText value={card.cardDesc[currentLang]} components={portableTextComponents} />}
                  </div>

                  {card.features && card.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {card.features.map((feat: any, fIdx: number) => {
                        if (!feat?.featureText) return null;
                        return (
                          <div 
                            key={fIdx} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#171e2e]/90 hover:bg-[#1d273b] border border-blue-900/40 rounded-xl text-xs font-medium text-zinc-200 transition-colors shadow-sm"
                          >
                            {feat.emoji && <span className="text-sm">{feat.emoji}</span>}
                            <span>{feat.featureText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href={cardBtnUrl}
                      title={cardBtnText}
                      aria-label={cardBtnText}
                      className="py-3 px-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all text-center block shadow-md text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>📖</span>
                      <span className="truncate">{cardBtnText}</span>
                    </Link>

                    {showAi && (
                      <button 
                        type="button"
                        data-ai-trigger="true"
                        title={aiGuideText}
                        aria-label={aiGuideText}
                        className="py-3 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all text-center block shadow-md text-xs sm:text-sm cursor-pointer flex items-center justify-center gap-1.5 w-full"
                      >
                        <span>✨</span>
                        <span className="truncate">{aiGuideText}</span>
                      </button>
                    )}
                  </div>

                  {showWa && (
                    <button 
                      type="button"
                      data-wa-trigger="true"
                      title={whatsappText}
                      aria-label={whatsappText}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all text-center block shadow-lg text-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>💬</span>
                      <span>{whatsappText}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section._type === 'internalLinksSection') {
    return (
      <div key={index} className="space-y-8 pt-12 border-t border-white/10 w-full">
        {section.sectionTitle?.[currentLang] && (
          <h2 className="text-2xl md:text-3xl font-bold text-start text-white">
            {section.sectionTitle[currentLang]}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {section.pages?.map((page: any, pIdx: number) => {
            if (!page?.slug) return null;
            const pageUrl = `/${locale}/services/${page.slug}`;
            const pageTitle = typeof page.title === 'object' 
              ? (page.title?.[currentLang] || page.title?.en || 'Service') 
              : page.title;

            return (
              <Link 
                key={pIdx} 
                href={pageUrl}
                title={pageTitle}
                aria-label={pageTitle}
                className="group bg-zinc-900/80 border border-white/10 hover:border-red-600/50 rounded-2xl overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
              >
                <div>
                  {page.imageUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                      <Image src={page.imageUrl} alt={pageTitle} title={pageTitle} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-zinc-500 text-xs">No Image Available</div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">{pageTitle}</h3>
                </div>

                <div className="mt-4 flex items-center gap-2 text-red-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Explore More</span>
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}