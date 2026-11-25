import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { PortableText } from '@portabletext/react';
import BookingForm from '../../../components/BookingForm';

async function getFlexiblePage(slug: string, locale: string) {
  const cleanSlug = decodeURIComponent(slug).trim();
  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';

  const query = `*[_type == "flexiblePage" && lower(slug.current) == lower($cleanSlug) && isActive != false][0]{
    "name": pageTitle,
    "slug": slug.current,
    isActive,
    pageCategory,
    shortDescription,
    basePriceEur,
    includedInPrice,
    notIncludedInPrice,
    pricingDetails,
    capacityOps,
    whatsappMarketing,
    "mainCoverImageUrl": mainCoverImage.asset->url,
    "metaTitle": seo.metaTitle[$currentLang],
    "metaDescription": seo.metaDescription[$currentLang],
    sections[]{
      _type,
      badge,
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
      slides[]{
        "imageUrl": image.asset->url,
        caption,
        slideUrl
      },
      cards[]{
        "linkedPrice": linkedTrip->basePriceEur,
        "linkedSlug": linkedTrip->slug.current,
        "linkedTitle": linkedTrip->pageTitle,
        cardTitle,
        cardDesc,
        "cardImageUrl": cardImage.asset->url,
        priceText,
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
        whatsappNumber,
        hasMiniSlider,
        "miniSliderUrls": miniSliderImages[].asset->url
      },
      formTitle,
      defaultAdultPrice,
      defaultChildPrice,
      htmlCode,
      pages[]->{
        "title": pageTitle,
        "slug": slug.current,
        "imageUrl": coalesce(
          mainCoverImage.asset->url,
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
    ? (pageData.name?.[currentLang] || pageData.name?.en || 'The Light House Diving Center') 
    : (pageData?.name || 'The Light House Diving Center');

  const domain = 'https://www.thelighthousee.com';
  const canonicalUrl = `${domain}/${locale}/services/${slug}`;
  const metaDescription = pageData?.metaDescription || 'Book premium scuba diving trips, PADI courses, and Red Sea excursions in Hurghada with The Light House Diving Center.';

  return {
    title: pageData?.metaTitle || `${fallbackTitle} | Hurghada Diving`,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en': `${domain}/en/services/${slug}`,
        'de': `${domain}/de/services/${slug}`,
        'fr': `${domain}/fr/services/${slug}`,
        'pl': `${domain}/pl/services/${slug}`,
      },
    },
    openGraph: {
      title: pageData?.metaTitle || fallbackTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'The Light House Diving Center',
      images: pageData?.mainCoverImageUrl ? [{ url: pageData.mainCoverImageUrl, width: 1200, height: 630, alt: fallbackTitle }] : [],
      locale: locale,
      type: 'website',
    },
  };
}

const portableTextComponents = {
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-5 space-y-1.5 my-2">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-5 space-y-1.5 my-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-snug">{children}</li>,
    number: ({ children }: any) => <li className="leading-snug">{children}</li>,
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-xl md:text-2xl font-bold text-white mt-6 mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg md:text-xl font-bold text-white mt-5 mb-2">{children}</h3>,
    normal: ({ children }: any) => <p className="mb-2 leading-relaxed text-zinc-300">{children}</p>,
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
        <Link href={`/${locale}`} title="Back to Home" aria-label="Back to Home" className="text-[#38bdf8] underline">
          Back to Home
        </Link>
      </main>
    );
  }

  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  const backText = locale === 'ar' ? 'العودة للرئيسية' : locale === 'de' ? 'Zurück zur Startseite' : locale === 'fr' ? 'Retour à l\'accueil' : 'Back to Home';
  const aiGuideText = 'Ask AI Guide';
  const whatsappText = locale === 'de' ? 'Über WhatsApp buchen' : locale === 'fr' ? 'Réserver via WhatsApp' : locale === 'pl' ? 'Zarezerwuj przez WhatsApp' : 'Book via WhatsApp';

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

  const basePriceEur = typeof pageData.basePriceEur === 'number' && pageData.basePriceEur > 0 ? pageData.basePriceEur : null;

  const vessel = pageData.capacityOps?.vessel;
  const maxCap = pageData.capacityOps?.maxCapacity || 20;
  const bookedCap = pageData.capacityOps?.bookedCapacity ?? 0;
  const remainingSeats = Math.max(0, maxCap - bookedCap);
  const utilizationPct = Math.min(100, Math.round((bookedCap / Math.max(1, maxCap)) * 100));

  const waPhone = pageData.whatsappMarketing?.whatsappPhone || '201036930803';
  const waCustomMsg =
    pageData.whatsappMarketing?.customMessage ||
    `Hello The Light House Diving Center! 🤿 I want to book ${pageName}${basePriceEur ? ` (€${basePriceEur})` : ''}${vessel ? ` on ${vessel}` : ''}. Please confirm current seat availability.`;
  const directWaLink = `https://wa.me/${waPhone}?text=${encodeURIComponent(waCustomMsg)}`;

  const shortDescContent = pageData.shortDescription?.[currentLang] || pageData.shortDescription?.en;
  const includedContent = pageData.includedInPrice?.[currentLang] || pageData.includedInPrice?.en;
  const notIncludedContent = pageData.notIncludedInPrice?.[currentLang] || pageData.notIncludedInPrice?.en;
  const pricingDetailsContent = pageData.pricingDetails?.[currentLang] || pageData.pricingDetails?.en;

  const hasTripDashboardBar = Boolean(basePriceEur || vessel || pageData.capacityOps);
  const hasPricingBreakdown = Boolean(includedContent || notIncludedContent || pricingDetailsContent);

  const cardsSection = pageData.sections?.find((s: any) => s._type === 'gridCardsSection');
  const schemaItems = cardsSection?.cards?.map((card: any, idx: number) => {
    const cardTitle = card.linkedTitle?.[currentLang] || card.linkedTitle?.en || card.cardTitle?.[currentLang] || card.cardTitle?.en || pageName;
    const cardPrice = card.linkedPrice || card.servicePrice || (card.priceText ? card.priceText.replace(/[^0-9]/g, '') : null);
    const cardUrl = formatUrl(card.cardCtaUrl?.[currentLang] || card.cardCtaUrl?.en, card.linkedSlug || card.serviceSlug || '');
    return {
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "TouristTrip",
        "name": cardTitle,
        "description": typeof card.cardDesc === 'string' ? card.cardDesc : `${cardTitle} in Hurghada Red Sea`,
        "image": card.cardImageUrl,
        "url": `https://www.thelighthousee.com${cardUrl}`,
        "offers": cardPrice ? {
          "@type": "Offer",
          "price": cardPrice,
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
        } : undefined,
        "provider": {
          "@type": "TouristInformationCenter",
          "name": "The Light House Diving Center",
          "url": "https://www.thelighthousee.com"
        }
      }
    };
  }) || [];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageName,
    "itemListElement": schemaItems
  };

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 sm:px-6 max-w-7xl mx-auto text-white relative">
      {schemaItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      )}

      <Link href={`/${locale}`} title={backText} aria-label={backText} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
        <svg className="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        <span>{backText}</span>
      </Link>

      <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 text-center text-white drop-shadow-md">
        {pageName}
      </h1>

      {shortDescContent && (
        <div className="max-w-3xl mx-auto text-center text-zinc-200 text-sm md:text-base mb-10 leading-relaxed font-normal">
          {Array.isArray(shortDescContent) ? (
            <PortableText value={shortDescContent} components={portableTextComponents} />
          ) : (
            <p>{shortDescContent}</p>
          )}
        </div>
      )}

      {pageData.mainCoverImageUrl && (
        <div className="relative w-full h-[260px] sm:h-[350px] md:h-[460px] rounded-[24px] overflow-hidden mb-10 border border-[#1e293b] shadow-2xl">
          <Image
            src={pageData.mainCoverImageUrl}
            alt={`${pageName} - The Light House Diving Center Hurghada`}
            title={pageName}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      {hasTripDashboardBar && (
        <div className="max-w-6xl mx-auto mb-12 bg-[#0f172a] border border-[#1e293b] rounded-[24px] p-5 sm:p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex flex-col gap-1 border-b md:border-b-0 md:border-r border-[#1e293b] pb-4 md:pb-0 md:pr-6">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
                {locale === 'de' ? 'Preis pro Person' : locale === 'fr' ? 'Prix par personne' : locale === 'pl' ? 'Cena za osobę' : 'Package Price'}
              </span>
              {basePriceEur ? (
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-3xl md:text-4xl font-extrabold text-amber-400">€{basePriceEur}</span>
                </div>
              ) : (
                <span className="text-lg font-bold text-white mt-1">Contact for Custom Quote</span>
              )}
            </div>

            <div className="flex flex-col gap-2.5 border-b md:border-b-0 md:border-r border-[#1e293b] pb-4 md:pb-0 md:pr-6">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {vessel && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-[#1e293b] text-white px-3 py-1 rounded-full border border-white/10">
                    <span>🛥️</span>
                    <span>{vessel}</span>
                  </span>
                )}

                {remainingSeats <= 0 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Fully Booked</span>
                  </span>
                ) : remainingSeats <= 4 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-amber-950 text-amber-300 border border-amber-700 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>Limited Seats ({remainingSeats} Left!)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Available ({remainingSeats} Seats Open)</span>
                  </span>
                )}
              </div>

              <div className="w-full space-y-1.5 mt-1">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Boat Capacity Utilization</span>
                  <span className="font-mono text-white font-semibold">{bookedCap} / {maxCap} Booked ({utilizationPct}%)</span>
                </div>
                <div className="w-full h-2 bg-[#0b1120] rounded-full overflow-hidden border border-[#1e293b]">
                  <div
                    className={`h-full transition-all duration-500 ${
                      remainingSeats <= 4 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${utilizationPct}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <a
                href={directWaLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsappText}
                className="w-full py-3.5 px-5 bg-[#22c55e] hover:bg-[#16a34a] text-zinc-950 font-bold rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>{whatsappText}</span>
              </a>

              <button
                type="button"
                data-ai-trigger="true"
                aria-label={aiGuideText}
                className="w-full py-2.5 px-4 bg-[#1e293b] hover:bg-[#334155] text-white font-semibold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 border border-white/5 cursor-pointer"
              >
                <span>✨</span>
                <span>{aiGuideText}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {bookingSection ? (
        <div className="space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative">
            <div className="lg:col-span-2 space-y-16">
              {renderSections(mainSections, currentLang, locale, slug, formatUrl, pageName, aiGuideText, whatsappText)}
              {hasPricingBreakdown && renderPricingBreakdown(includedContent, notIncludedContent, pricingDetailsContent, locale)}
            </div>
            
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <BookingForm 
                adultPrice={bookingSection.defaultAdultPrice || basePriceEur || 150}
                childPrice={bookingSection.defaultChildPrice || basePriceEur || 150}
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
          {hasPricingBreakdown && renderPricingBreakdown(includedContent, notIncludedContent, pricingDetailsContent, locale)}
          {internalLinksSection && renderSingleSection(internalLinksSection, currentLang, locale, formatUrl, slug, 0, pageName, aiGuideText, whatsappText)}
        </div>
      )}

      <Script id="ai-trigger-script" strategy="afterInteractive">
        {`
          if (typeof window !== 'undefined') {
            document.addEventListener('click', function(e) {
              const triggerAi = e.target.closest('[data-ai-trigger]');
              if (triggerAi) {
                const chatBtn = document.getElementById('my-chat-button');
                if (chatBtn) chatBtn.click();
              }
            });
          }
        `}
      </Script>
    </main>
  );
}

function renderPricingBreakdown(includedContent: any, notIncludedContent: any, pricingDetailsContent: any, locale: string) {
  const incTitle = locale === 'de' ? 'Im Preis inbegriffen' : locale === 'fr' ? 'Inclus dans le prix' : locale === 'pl' ? 'W cenie' : 'What is Included';
  const notIncTitle = locale === 'de' ? 'Nicht inbegriffen' : locale === 'fr' ? 'Non inclus' : locale === 'pl' ? 'Opcjonalnie / Płatne' : 'Not Included / Extras';
  const detailsTitle = locale === 'de' ? 'Wichtige Details' : locale === 'fr' ? 'Détails importants' : locale === 'pl' ? 'Ważne informacje' : 'Important Details';

  const extractItems = (content: any): string[] => {
    if (!content) return [];
    if (Array.isArray(content)) {
      return content.flatMap((block: any) => {
        if (typeof block === 'string') return [block];
        if (block?.children) {
          return [block.children.map((c: any) => c.text).join('')];
        }
        return [];
      }).filter(Boolean);
    }
    if (typeof content === 'string') {
      return content.split('\n').map(s => s.trim().replace(/^[•\-\*]\s*/, '')).filter(Boolean);
    }
    return [];
  };

  const includedItems = extractItems(includedContent);
  const notIncludedItems = extractItems(notIncludedContent);

  return (
    <div className="space-y-8 my-8">
      {(includedItems.length > 0 || notIncludedItems.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {includedItems.length > 0 && (
            <div className="bg-[#0b1322] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-sm">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{incTitle}</h3>
                  <span className="text-xs text-emerald-400 font-medium">Included in this package</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {includedItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#0f1d30]/80 border border-emerald-500/15 hover:border-emerald-500/35 transition-colors"
                  >
                    <span className="text-emerald-400 mt-0.5 text-sm shrink-0">●</span>
                    <span className="text-zinc-100 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {notIncludedItems.length > 0 && (
            <div className="bg-[#0b1120] border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-zinc-800/90 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold shadow-sm">
                  ✕
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">{notIncTitle}</h3>
                  <span className="text-xs text-zinc-400 font-medium">Extra fees or optional</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {notIncludedItems.map((item, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-2xl bg-[#080d1a]/85 border border-zinc-800/80 hover:border-zinc-700 transition-colors"
                  >
                    <span className="text-zinc-400 mt-0.5 text-sm shrink-0">○</span>
                    <span className="text-zinc-200 text-sm leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {pricingDetailsContent && (
        <div className="bg-[#0b1322] border border-cyan-500/25 rounded-3xl p-6 md:p-8 shadow-xl">
          <h3 className="text-lg font-bold text-cyan-400 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>{detailsTitle}</span>
          </h3>
          <div className="text-zinc-200 text-sm leading-relaxed">
            {Array.isArray(pricingDetailsContent) ? (
              <PortableText value={pricingDetailsContent} components={portableTextComponents} />
            ) : (
              <p>{String(pricingDetailsContent)}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function renderSections(sections: any[], currentLang: string, locale: string, slug: string, formatUrl: Function, pageName: string, aiGuideText: string, whatsappText: string) {
  return sections.map((section: any, index: number) => renderSingleSection(section, currentLang, locale, formatUrl, slug, index, pageName, aiGuideText, whatsappText));
}

function renderSingleSection(section: any, currentLang: string, locale: string, formatUrl: Function, slug: string = '', index: number = 0, pageName: string = 'Service', aiGuideText: string, whatsappText: string) {
  
  if (section._type === 'splitSection') {
    const isImageLeft = section.layoutDirection === 'imageLeft';
    const buttonText = section.ctaText?.[currentLang] || section.ctaText?.en || 'Book Now';
    const buttonUrl = formatUrl(section.ctaUrl?.[currentLang] || section.ctaUrl?.en, `/contact?service=${slug}`);
    const resolvedImage = section.imageUrl || section.bgImageUrl;
    const imageAltTitle = section.title?.[currentLang] || section.title?.en || pageName;
    const descContent = section.description?.[currentLang] || section.description?.en;

    return (
      <div key={index} className={`bg-[#0f172a] border border-[#1e293b] rounded-[24px] overflow-hidden p-6 sm:p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl ${isImageLeft ? 'md:grid-flow-dense' : ''}`}>
        <div className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-lg ${isImageLeft ? 'md:order-1' : 'md:order-none'}`}>
          {resolvedImage ? (
            <Image 
              src={resolvedImage} 
              alt={`${imageAltTitle} - The Light House Diving Center`} 
              title={imageAltTitle} 
              fill 
              sizes="(max-width: 768px) 100vw, 50vw" 
              className="object-cover" 
            />
          ) : (
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">No Image</div>
          )}
        </div>
        <div className={`flex flex-col items-start text-start ${isImageLeft ? 'md:order-2' : 'md:order-none'}`}>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white">{section.title?.[currentLang] || section.title?.en}</h2>
          <div className="max-w-none text-zinc-200 text-sm md:text-base leading-relaxed text-start w-full">
            {descContent && <PortableText value={descContent} components={portableTextComponents} />}
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
    const heroBtnText = section.ctaText?.[currentLang] || section.ctaText?.en;
    const heroBtnUrl = formatUrl(section.ctaUrl?.[currentLang] || section.ctaUrl?.en, slug ? `/contact?service=${slug}` : '#');
    const heroAltTitle = section.title?.[currentLang] || section.title?.en || pageName;
    const heroBadge = section.badge?.[currentLang] || section.badge?.en;
    const subtitleContent = section.subtitle?.[currentLang] || section.subtitle?.en;

    return (
      <div key={index} className="bg-[#0f172a] border border-[#1e293b] rounded-[24px] p-6 sm:p-8 md:p-12 text-start shadow-xl flex flex-col items-start">
        {heroBadge && (
          <span className="mb-3 px-3.5 py-1 rounded-full text-xs font-bold bg-[#1e293b] text-[#38bdf8] border border-[#38bdf8]/30">
            {heroBadge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">{section.title?.[currentLang] || section.title?.en}</h2>
        <div className="text-zinc-200 max-w-none mb-8 text-start text-sm md:text-base leading-relaxed w-full">
          {subtitleContent && <PortableText value={subtitleContent} components={portableTextComponents} />}
        </div>
        {heroBtnText && (
          <Link href={heroBtnUrl} title={heroBtnText} aria-label={heroBtnText} className="mb-8 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-2xl transition-all shadow-lg flex items-center gap-3 cursor-pointer text-sm sm:text-base">
            <span>{heroBtnText}</span>
          </Link>
        )}
        {videoUrl ? (
          <div className="relative w-full h-[260px] sm:h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 shadow-2xl bg-black">
            <video src={videoUrl} autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        ) : resolvedHeroImage ? (
          <div className="relative w-full h-[260px] sm:h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 shadow-2xl">
            <Image 
              src={resolvedHeroImage} 
              alt={`${heroAltTitle} - Scuba Diving Hurghada`} 
              title={heroAltTitle} 
              fill 
              sizes="100vw" 
              className="object-cover" 
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (section._type === 'sliderSection') {
    const sliderTitle = section.sectionTitle?.[currentLang] || section.sectionTitle?.en;
    return (
      <div key={index} className="space-y-6">
        {sliderTitle && <h2 className="text-2xl sm:text-3xl font-bold text-start text-white">{sliderTitle}</h2>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {section.slides?.map((slide: any, sIdx: number) => {
            const captionText = slide.caption?.[currentLang] || slide.caption?.en || pageName;
            const slideHref = slide.slideUrl?.[currentLang] || slide.slideUrl?.en;
            return (
              <div key={sIdx} className="bg-[#0f172a] border border-[#1e293b] rounded-2xl overflow-hidden shadow-lg group">
                {slide.imageUrl && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image src={slide.imageUrl} alt={`${captionText} - The Light House`} title={captionText} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                {captionText && (
                  <div className="p-4 flex items-center justify-between">
                    <span className="font-semibold text-white text-sm">{captionText}</span>
                    {slideHref && (
                      <Link href={formatUrl(slideHref, '#')} title={captionText} aria-label={captionText} className="text-xs text-[#38bdf8] hover:underline">
                        View →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (section._type === 'gridCardsSection') {
    const whatsappNumbers = [
      { label: 'The Light House WhatsApp', number: '201036930803', isCloned: false },
      { label: 'Booking Desk', number: '201550503959', isCloned: true }
    ];

    return (
      <div key={index} className="space-y-6">
        {(section.sectionTitle?.[currentLang] || section.sectionTitle?.en) && (
          <h2 className="text-2xl sm:text-3xl font-bold text-start mb-6">{section.sectionTitle?.[currentLang] || section.sectionTitle?.en}</h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {section.cards?.map((card: any, cIdx: number) => {
            const resolvedTitle = card.linkedTitle?.[currentLang] || card.linkedTitle?.en || card.cardTitle?.[currentLang] || card.cardTitle?.en || pageName;
            const cardBtnText = card.cardCtaText?.[currentLang] || card.cardCtaText?.en || 'View Packages'; 
            const cardBtnUrl = formatUrl(card.cardCtaUrl?.[currentLang] || card.cardCtaUrl?.en, card.linkedSlug || card.serviceSlug || '#');
            const cardDescContent = card.cardDesc?.[currentLang] || card.cardDesc?.en;
            
            const displayPrice = card.linkedPrice 
              ? `€${card.linkedPrice}` 
              : (card.priceText || (card.servicePrice ? `€${card.servicePrice}` : null));
            
            const hasCta = !!cardBtnText;
            const showAi = card.showAiGuide !== false;
            const showWa = card.showWhatsApp !== false;
            const hasAnyButton = hasCta || showAi || showWa;
            
            const modalId = `wa-modal-${index}-${cIdx}`;
            const displayFeatures = (card.features || []).slice(0, 4);

            return (
              <div 
                key={cIdx} 
                className="bg-[#0b1120] border border-[#1e293b] rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 flex flex-col justify-between shadow-lg text-start relative group hover:border-[#38bdf8]/40 transition-all duration-300"
              >
                <input type="checkbox" id={modalId} className="peer hidden" />

                <div>
                  {card.cardImageUrl && (
                    <div className="relative aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden mb-3.5">
                      <Image 
                        src={card.cardImageUrl} 
                        alt={`${resolvedTitle} - The Light House Diving Center Hurghada`} 
                        title={resolvedTitle} 
                        fill 
                        priority={cIdx === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      
                      {card.badgeText && (
                        <div className="absolute top-2.5 left-2.5 z-10 bg-[#f59e0b] text-neutral-950 font-bold px-2.5 py-1 rounded-full text-[11px] shadow-md flex items-center gap-1">
                          {card.badgeEmoji && <span className="text-xs leading-none">{card.badgeEmoji}</span>}
                          <span>{card.badgeText}</span>
                        </div>
                      )}

                      {displayPrice && (
                        <div className="absolute top-2.5 right-2.5 z-10 bg-black/80 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-center shadow-lg flex items-center gap-1.5">
                          <span className="text-[9px] text-zinc-300 uppercase tracking-wider font-semibold">From</span>
                          <span className="text-xs sm:text-sm font-black text-amber-400">{displayPrice}</span>
                        </div>
                      )}

                      {card.locationText && (
                        <Link 
                          href={card.locationMapUrl || '#'} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`Location: ${card.locationText}`}
                          className="absolute bottom-2.5 left-2.5 z-10 bg-black/85 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 hover:bg-black transition-colors"
                        >
                          <svg className="w-3 h-3 text-[#06b6d4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{card.locationText}</span>
                        </Link>
                      )}
                    </div>
                  )}

                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1.5 line-clamp-2 min-h-[3rem] leading-snug">
                    {resolvedTitle}
                  </h2>
                  
                  <div className="flex items-center gap-1.5 text-[#06b6d4] text-xs font-medium mb-2.5 w-max">
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"></path><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"></path></svg>
                    <span>The Light House Diving Center</span>
                  </div>
                  
                  {cardDescContent && (
                    <div className="text-zinc-300 text-xs mb-3 line-clamp-2 leading-relaxed h-[2.5rem] overflow-hidden">
                      {Array.isArray(cardDescContent) ? (
                        <PortableText value={cardDescContent} components={portableTextComponents} />
                      ) : (
                        <p>{String(cardDescContent)}</p>
                      )}
                    </div>
                  )}

                  {displayFeatures.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4 border-b border-white/5 pb-3.5">
                      {displayFeatures.map((feat: any, fIdx: number) => {
                        if (!feat?.featureText) return null;
                        return (
                          <div 
                            key={fIdx} 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#0f172a] border border-white/10 rounded-lg text-[11px] font-medium text-zinc-200 shadow-sm"
                          >
                            {feat.emoji && <span className="text-[#38bdf8] text-xs">{feat.emoji}</span>}
                            <span>{feat.featureText}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {hasAnyButton && (
                  <div className="mt-auto pt-1">
                    {!showAi && showWa && (
                      hasCta ? (
                        <div className="flex items-center gap-2">
                          <Link 
                            href={cardBtnUrl}
                            title={cardBtnText}
                            aria-label={cardBtnText}
                            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-xl transition-all text-center shadow text-xs sm:text-sm flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <span className="truncate">{cardBtnText}</span>
                          </Link>
                          
                          <label 
                            htmlFor={modalId}
                            title={whatsappText}
                            className="w-10 h-10 flex-shrink-0 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl transition-all flex items-center justify-center shadow cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          </label>
                        </div>
                      ) : (
                        <label 
                          htmlFor={modalId}
                          title={whatsappText}
                          className="w-full py-2.5 px-3 bg-[#22c55e] hover:bg-[#16a34a] text-zinc-900 font-bold rounded-xl transition-all text-center shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          <span className="truncate">{whatsappText}</span>
                        </label>
                      )
                    )}

                    {showAi && showWa && (
                      <div className="space-y-2">
                        {hasCta ? (
                          <div className="flex items-center gap-2">
                            <Link 
                              href={cardBtnUrl}
                              title={cardBtnText}
                              aria-label={cardBtnText}
                              className="flex-1 py-2.5 px-3 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-xl transition-all text-center shadow text-xs sm:text-sm flex items-center justify-center gap-1.5"
                            >
                              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                              <span className="truncate">{cardBtnText}</span>
                            </Link>
                            
                            <label 
                              htmlFor={modalId}
                              title={whatsappText}
                              className="w-10 h-10 flex-shrink-0 bg-[#22c55e] hover:bg-[#16a34a] text-white rounded-xl transition-all flex items-center justify-center shadow cursor-pointer"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                            </label>
                          </div>
                        ) : (
                          <label 
                            htmlFor={modalId}
                            title={whatsappText}
                            className="w-full py-2.5 px-3 bg-[#22c55e] hover:bg-[#16a34a] text-zinc-900 font-bold rounded-xl transition-all text-center shadow text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                          <span className="truncate">{whatsappText}</span>
                        </label>
                      )}

                      <button 
                        type="button"
                        data-ai-trigger="true"
                        title={aiGuideText}
                        aria-label={aiGuideText}
                        className="w-full py-2 px-3 bg-[#1e293b] hover:bg-[#334155] text-white font-semibold rounded-xl transition-all text-center shadow text-xs flex items-center justify-center gap-1 border border-white/5 cursor-pointer"
                      >
                        <span>✨</span>
                        <span className="truncate">{aiGuideText}</span>
                      </button>
                    </div>
                  )}

                  {showAi && !showWa && (
                    <div className={hasCta ? "grid grid-cols-2 gap-2" : "w-full"}>
                      {hasCta && (
                        <Link
                          href={cardBtnUrl}
                          title={cardBtnText}
                          aria-label={cardBtnText}
                          className="py-2.5 px-2 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-xl transition-all text-center shadow text-xs flex items-center justify-center gap-1"
                        >
                          <span className="truncate">{cardBtnText}</span>
                        </Link>
                      )}
                      <button
                        type="button"
                        data-ai-trigger="true"
                        title={aiGuideText}
                        aria-label={aiGuideText}
                        className={`py-2.5 ${hasCta ? "px-2" : "w-full px-3"} bg-[#1e293b] hover:bg-[#334155] text-white font-bold rounded-xl transition-all text-center shadow text-xs flex items-center justify-center gap-1 border border-white/5 cursor-pointer`}
                      >
                        <span>✨</span>
                        <span className="truncate">{aiGuideText}</span>
                      </button>
                    </div>
                  )}

                  {!showAi && !showWa && hasCta && (
                    <Link 
                      href={cardBtnUrl}
                      title={cardBtnText}
                      aria-label={cardBtnText}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white font-bold rounded-xl transition-all text-center shadow text-xs sm:text-sm flex items-center justify-center gap-1.5"
                    >
                      <span>{cardBtnText}</span>
                    </Link>
                  )}                  
                </div>
              )}

              {showWa && (
                <div className="hidden peer-checked:flex fixed inset-0 z-[99999] items-center justify-center p-4">
                  <label htmlFor={modalId} className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"></label>
                  
                  <div className="relative z-10 bg-[#1e1e1e] border border-zinc-800 rounded-3xl shadow-2xl p-6 w-80 text-white flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
                    <h3 className="text-base font-medium text-zinc-100 mb-2">Select an app to open</h3>
                    <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed">
                      Choose your preferred WhatsApp line to inquire directly.
                    </p>

                    <div className="flex items-center justify-center gap-8 mb-6 w-full">
                      {whatsappNumbers.map((item, idx) => {
                        const defaultMessage = `Hello, I would like to inquire about ${resolvedTitle}${displayPrice ? ` (${displayPrice})` : ''}`;
                        return (
                          <a
                            key={idx}
                            href={`https://wa.me/${item.number}?text=${encodeURIComponent(defaultMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Chat with ${item.label}`}
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

                    <label 
                      htmlFor={modalId}
                      className="text-[#3b82f6] hover:text-[#60a5fa] text-sm font-semibold cursor-pointer mt-2"
                    >
                      Cancel
                    </label>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

if (section._type === 'customHtmlSection') {
  const customTitle = section.sectionTitle?.[currentLang] || section.sectionTitle?.en;
  return (
    <div key={index} className="space-y-8 w-full pt-8">
      {customTitle && (
        <h2 className="text-2xl sm:text-3xl font-bold text-start mb-6 text-white">
          {customTitle}
        </h2>
      )}
      
      {section.htmlCode && (
        <div 
          className="w-full custom-html-wrapper"
          dangerouslySetInnerHTML={{ __html: section.htmlCode }} 
        />
      )}
    </div>
  );
}

if (section._type === 'internalLinksSection') {
  const internalTitle = section.sectionTitle?.[currentLang] || section.sectionTitle?.en;
  return (
    <div key={index} className="space-y-8 pt-12 border-t border-white/10 w-full">
      {internalTitle && (
        <h2 className="text-2xl sm:text-3xl font-bold text-start text-white">
          {internalTitle}
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
                    <Image src={page.imageUrl} alt={`${pageTitle} - Diving in Hurghada`} title={pageTitle} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
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
