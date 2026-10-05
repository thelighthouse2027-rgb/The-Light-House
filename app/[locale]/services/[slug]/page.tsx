import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import BookingForm from '../../../components/BookingForm';

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
        "badgeText": badgeText[$currentLang],
        badgeEmoji,
        "locationText": locationText[$currentLang],
        locationMapUrl,
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
  const whatsappText = locale === 'de' ? 'Über WhatsApp buchen' : locale === 'fr' ? 'Réserver via WhatsApp' : locale === 'pl' ? 'Zarezerwuj przez WhatsApp' : 'WhatsApp';

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

      {/* سكريبت تفعيل نوافذ الواتساب وأزرار الـ AI */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('click', function(e) {
              // 1. تفعيل بوت AI
              const triggerAi = e.target.closest('[data-ai-trigger]');
              if (triggerAi) {
                const chatBtn = document.getElementById('my-chat-button');
                if (chatBtn) chatBtn.click();
              }

              // 2. فتح نافذة الواتساب الخاصة بالكارت
              const triggerWa = e.target.closest('[data-wa-trigger]');
              if (triggerWa) {
                e.preventDefault();
                const modalId = triggerWa.getAttribute('data-wa-trigger');
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.remove('hidden');
              }

              // 3. إغلاق نافذة الواتساب
              const closeWa = e.target.closest('[data-wa-close]');
              if (closeWa) {
                e.preventDefault();
                const modalId = closeWa.getAttribute('data-wa-close');
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.add('hidden');
              }
              
              // 4. إغلاق النافذة عند الضغط خارجها (على الخلفية السوداء)
              if (e.target.classList.contains('wa-modal-overlay')) {
                e.target.classList.add('hidden');
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
    normal: ({ children }: any) => <p className="mb-3 leading-relaxed text-zinc-300">{children}</p>,
  },
  marks: {
    link: ({ value, children }: any) => {
      const href = value?.href || '#';
      const linkTitle = typeof children === 'string' ? children : 'External Link';
      return (
        <Link href={href} title={linkTitle} aria-label={linkTitle} className="text-[#06b6d4] hover:underline">
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
      <div key={index} className={`bg-[#0f172a] border border-[#1e293b] rounded-[24px] overflow-hidden p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl ${isImageLeft ? 'md:grid-flow-dense' : ''}`}>
        <div className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg ${isImageLeft ? 'md:order-1' : 'md:order-none'}`}>
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
          <Link href={buttonUrl} title={buttonText} aria-label={buttonText} className="mt-6 px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-2xl transition-all shadow-lg flex items-center gap-3 text-sm cursor-pointer w-max">
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
      <div key={index} className="bg-[#0f172a] border border-[#1e293b] rounded-[24px] p-8 md:p-12 text-start shadow-xl flex flex-col items-start">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{section.title?.[currentLang]}</h2>
        <div className="text-zinc-300 max-w-none mb-8 text-start leading-relaxed w-full">
          {section.subtitle?.[currentLang] && <PortableText value={section.subtitle[currentLang]} components={portableTextComponents} />}
        </div>
        {heroBtnText && (
          <Link href={heroBtnUrl} title={heroBtnText} aria-label={heroBtnText} className="mb-8 px-8 py-4 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-2xl transition-all shadow-lg flex items-center gap-3 cursor-pointer">
            <span>{heroBtnText}</span>
          </Link>
        )}
        {videoUrl ? (
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 shadow-2xl bg-black">
            <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        ) : resolvedHeroImage ? (
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 shadow-2xl">
            <Image src={resolvedHeroImage} alt={heroAltTitle} title={heroAltTitle} fill sizes="100vw" className="object-cover" />
          </div>
        ) : null}
      </div>
    );
  }

  if (section._type === 'gridCardsSection') {
    // الأرقام التي ستظهر في النافذة المنبثقة للواتساب
    const whatsappNumbers = [
      { label: 'WhatsApp', number: '201273327311', isCloned: false },
      { label: 'ENG SAQR', number: '201550503959', isCloned: true }
    ];

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
            
            const displayPrice = card.servicePrice ? `€${card.servicePrice}` : null;
            
            const showAi = card.showAiGuide !== false;
            const showWa = card.showWhatsApp !== false;
            
            // ID فريد لكل نافذة واتساب خاصة بكل كارت
            const modalId = `wa-modal-${index}-${cIdx}`;

            return (
              <div key={cIdx} className="bg-[#0b1120] border border-[#1e293b] rounded-[24px] p-5 flex flex-col justify-between shadow-xl text-start relative">
                <div>
                  {card.cardImageUrl && (
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
                      <Image 
                        src={card.cardImageUrl} 
                        alt={cardTitleText} 
                        title={cardTitleText} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 33vw" 
                        className="object-cover" 
                      />
                      
                      {/* الشارة الصفراء العلوية (نار + نص) */}
                      {card.badgeText && (
                        <div className="absolute top-3 left-3 z-10 bg-[#f59e0b] text-neutral-950 font-bold px-3.5 py-1.5 rounded-full text-sm shadow-md flex items-center gap-1.5">
                          {card.badgeEmoji && <span className="text-base leading-none">{card.badgeEmoji}</span>}
                          <span>{card.badgeText}</span>
                        </div>
                      )}

                      {/* شارة الموقع الجغرافي أسفل اليسار (مكانها المظبوط) */}
                      {card.locationText && (
                        <Link 
                          href={card.locationMapUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="absolute bottom-3 left-3 z-10 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 hover:bg-black transition-colors"
                        >
                          <svg className="w-3.5 h-3.5 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{card.locationText}</span>
                        </Link>
                      )}

                      {/* شارة السعر داكنة */}
                      {displayPrice && (
                        <div className="absolute top-3 right-3 z-10 bg-[#0f172a] text-[#38bdf8] border border-white/5 px-4 py-1.5 rounded-full text-sm font-bold shadow-md tracking-wide">
                          {displayPrice}
                        </div>
                      )}
                    </div>
                  )}

                  {/* عنوان الكارت */}
                  <h3 className="text-[22px] font-bold text-white mb-2">{card.cardTitle?.[currentLang]}</h3>
                  
                  {/* شارة الشركة تحت العنوان مباشرة */}
                  <div className="flex items-center gap-1.5 text-[#06b6d4] text-sm font-medium mb-4 w-max">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path></svg>
                    <span>The Light House Diving Center</span>
                  </div>
                  
                  <div className="text-[#94a3b8] text-sm mb-5 leading-relaxed w-full">
                    {card.cardDesc?.[currentLang] && <PortableText value={card.cardDesc[currentLang]} components={portableTextComponents} />}
                  </div>

                  {/* مميزات الكارت */}
                  {card.features && card.features.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 mb-6 border-b border-white/5 pb-6">
                      {card.features.map((feat: any, fIdx: number) => {
                        if (!feat?.featureText) return null;
                        return (
                          <div 
                            key={fIdx} 
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0f172a] border border-white/5 rounded-full text-xs font-semibold text-white shadow-sm"
                          >
                            {feat.emoji && <span className="text-[#38bdf8] text-sm">{feat.emoji}</span>}
                            <span>{feat.featureText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* توزيع الأزرار */}
                <div className="mt-auto">
                  {!showAi && showWa && (
                    <div className="grid grid-cols-2 gap-3">
                      <Link 
                        href={cardBtnUrl}
                        title={cardBtnText}
                        className="py-3 px-2 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-2xl transition-all text-center shadow-lg text-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        <span className="truncate">{cardBtnText}</span>
                      </Link>
                      {/* زر الواتساب هنا مربوط بالنافذة المنبثقة */}
                      <button 
                        type="button"
                        data-wa-trigger={modalId}
                        title={whatsappText}
                        className="py-3 px-2 bg-[#22c55e] hover:bg-[#16a34a] text-zinc-900 font-bold rounded-2xl transition-all text-center shadow-lg text-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        <span className="truncate">{whatsappText}</span>
                      </button>
                    </div>
                  )}

                  {showAi && showWa && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Link 
                          href={cardBtnUrl}
                          title={cardBtnText}
                          className="py-3 px-2 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-2xl transition-all text-center shadow-lg text-sm flex items-center justify-center gap-1.5"
                        >
                          <span className="truncate">{cardBtnText}</span>
                        </Link>

                        <button 
                          type="button"
                          data-ai-trigger="true"
                          title={aiGuideText}
                          className="py-3 px-2 bg-[#1e293b] hover:bg-[#334155] text-white font-bold rounded-2xl transition-all text-center shadow-lg text-sm flex items-center justify-center gap-1.5 border border-white/5"
                        >
                          <span>✨</span>
                          <span className="truncate">{aiGuideText}</span>
                        </button>
                      </div>

                      {/* زر الواتساب هنا مربوط بالنافذة المنبثقة */}
                      <button 
                        type="button"
                        data-wa-trigger={modalId}
                        title={whatsappText}
                        className="w-full py-3 px-4 bg-[#22c55e] hover:bg-[#16a34a] text-zinc-900 font-bold rounded-2xl transition-all text-center shadow-lg text-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                        <span className="truncate">{whatsappText}</span>
                      </button>
                    </div>
                  )}

                  {!showAi && !showWa && (
                    <Link 
                      href={cardBtnUrl}
                      title={cardBtnText}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-2xl transition-all text-center shadow-lg text-sm flex items-center justify-center gap-2"
                    >
                      <span>{cardBtnText}</span>
                    </Link>
                  )}
                </div>

                {/* --- نافذة اختيار تطبيق الواتساب الخاصة بالكارت (Modal) --- */}
                {showWa && (
                  <div id={modalId} className="wa-modal-overlay hidden fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#1e1e1e] border border-zinc-800 rounded-3xl shadow-2xl p-6 w-80 text-white flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                      <h3 className="text-base font-medium text-zinc-100 mb-2">Select an app to open</h3>
                      <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed">
                        To set a default app to open, go to "Settings - Apps - App Cloner". <span className="text-[#3b82f6] cursor-pointer hover:underline">Settings</span>
                      </p>

                      <div className="flex items-center justify-center gap-8 mb-6 w-full">
                        {whatsappNumbers.map((item, idx) => {
                          const defaultMessage = `Hello, I would like to inquire about ${cardTitleText}`;
                          return (
                            <a
                              key={idx}
                              href={`https://wa.me/${item.number}?text=${encodeURIComponent(defaultMessage)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              data-wa-close={modalId}
                              className="flex flex-col items-center gap-2 group cursor-pointer"
                            >
                              <div className="relative w-14 h-14 bg-[#18181b] rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-[#10b981] shadow-md transition-all">
                                <svg className="w-8 h-8 text-[#10b981]" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                {item.isCloned && (
                                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#3b82f6] rounded flex items-center justify-center text-[9px] border border-[#1e1e1e]">
                                    📁
                                  </div>
                                )}
                              </div>
                              <span className="text-xs font-medium text-zinc-300">{item.label}</span>
                            </a>
                          );
                        })}
                      </div>

                      <button 
                        type="button" 
                        data-wa-close={modalId}
                        className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-semibold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                {/* ------------------------------------------------------------- */}
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
            const pageTitle = typeof page.title === 'object' ? (page.title?.[currentLang] || page.title?.en || 'Service') : page.title;

            return (
              <Link key={pIdx} href={pageUrl} title={pageTitle} aria-label={pageTitle} className="group bg-[#0f172a] border border-[#1e293b] hover:border-[#38bdf8] rounded-2xl overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer">
                <div>
                  {page.imageUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
                      <Image src={page.imageUrl} alt={pageTitle} title={pageTitle} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-zinc-500 text-xs">No Image Available</div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#38bdf8] transition-colors">{pageTitle}</h3>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[#06b6d4] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Explore More</span>
                  <svg className="w-4 h-4 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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