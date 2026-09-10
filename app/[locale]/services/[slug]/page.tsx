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
    sections[]{
      _type,
      title,
      subtitle,
      description,
      "imageUrl": image.asset->url,
      "bgImageUrl": bgImage.asset->url,
      layoutDirection,
      mediaType,
      ctaText,
      ctaUrl,
      sectionTitle,
      cards[]{
        cardTitle,
        cardDesc,
        "cardImageUrl": cardImage.asset->url,
        servicePrice,
        serviceSlug,
        cardCtaText,
        cardCtaUrl
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
        <Link href={`/${locale}`} className="text-red-500 underline">Back to Home</Link>
      </main>
    );
  }

  const currentLang = ['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en';
  const backText = locale === 'ar' ? 'العودة للرئيسية' : locale === 'de' ? 'Zurück zur Startseite' : locale === 'fr' ? 'Retour à l\'accueil' : 'Back to Home';

  // استخراج اسم الصفحة باللغة الحالية بدقة لمنع خطأ الـ Objects
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

  return (
    <main className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      {/* زر العودة */}
      <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
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
              {renderSections(mainSections, currentLang, locale, slug, formatUrl)}
            </div>
            
            <div className="lg:col-span-1 lg:sticky lg:top-28">
              <BookingForm 
                adultPrice={bookingSection.defaultAdultPrice || 150}
                childPrice={bookingSection.defaultChildPrice || 150}
                locale={locale}
                serviceName={pageName}
              />
            </div>
          </div>

          {internalLinksSection && renderSingleSection(internalLinksSection, currentLang, locale, formatUrl)}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-16">
          {renderSections(mainSections, currentLang, locale, slug, formatUrl)}
          {internalLinksSection && renderSingleSection(internalLinksSection, currentLang, locale, formatUrl)}
        </div>
      )}
    </main>
  );
}

function renderSections(sections: any[], currentLang: string, locale: string, slug: string, formatUrl: Function) {
  return sections.map((section: any, index: number) => renderSingleSection(section, currentLang, locale, formatUrl, slug, index));
}

function renderSingleSection(section: any, currentLang: string, locale: string, formatUrl: Function, slug?: string, index: number = 0) {
  
  if (section._type === 'splitSection') {
    const isImageLeft = section.layoutDirection === 'imageLeft';
    const buttonText = section.ctaText?.[currentLang] || 'Book Now';
    const buttonUrl = formatUrl(section.ctaUrl?.[currentLang], `/contact?service=${slug}`);
    const resolvedImage = section.imageUrl || section.bgImageUrl;

    return (
      <div key={index} className={`bg-zinc-900/60 backdrop-blur-2xl border border-red-600/30 rounded-3xl overflow-hidden p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${isImageLeft ? 'md:grid-flow-dense' : ''}`}>
        <div className={`relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-red-600/20 shadow-xl ${isImageLeft ? 'md:order-1' : 'md:order-none'}`}>
          {resolvedImage ? <Image src={resolvedImage} alt="Image" fill className="object-cover" /> : <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500">No Image</div>}
        </div>
        <div className={`flex flex-col items-start text-start ${isImageLeft ? 'md:order-2' : 'md:order-none'}`}>
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white">{section.title?.[currentLang]}</h2>
          
          <div className="prose prose-invert max-w-none text-zinc-300 text-base leading-relaxed text-start space-y-4 
            [&>p]:mb-4 
            [&>strong]:text-amber-400 
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2
            [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:text-white [&>h2]:mt-6 [&>h2]:mb-3
            [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-5 [&>h3]:mb-2">
            {section.description?.[currentLang] && <PortableText value={section.description[currentLang]} />}
          </div>

          <Link href={buttonUrl} className="mt-6 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-3 text-sm">
            <span>{buttonText}</span>
          </Link>
        </div>
      </div>
    );
  }

  if (section._type === 'heroSection') {
    const resolvedHeroImage = section.imageUrl || section.bgImageUrl;
    const heroBtnText = section.ctaText?.[currentLang];
    const heroBtnUrl = formatUrl(section.ctaUrl?.[currentLang], slug ? `/contact?service=${slug}` : '#');

    return (
      <div key={index} className="bg-zinc-900/60 border border-red-600/30 rounded-3xl p-8 md:p-12 text-start shadow-xl flex flex-col items-start">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">{section.title?.[currentLang]}</h2>
        
        <div className="text-zinc-300 max-w-none mb-8 text-start leading-relaxed prose prose-invert 
          [&>strong]:text-amber-400
          [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2
          [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2
          [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-extrabold [&>h2]:text-white [&>h2]:mt-6 [&>h2]:mb-3
          [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-5 [&>h3]:mb-2">
          {section.subtitle?.[currentLang] && <PortableText value={section.subtitle[currentLang]} />}
        </div>

        {heroBtnText && (
          <Link 
            href={heroBtnUrl} 
            className="mb-8 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center gap-3"
          >
            <span>{heroBtnText}</span>
          </Link>
        )}

        {resolvedHeroImage && (
          <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden mt-2 border border-white/10 shadow-2xl">
            <Image src={resolvedHeroImage} alt="Hero Section Image" fill className="object-cover" />
          </div>
        )}
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
            const cardBtnText = card.cardCtaText?.[currentLang];
            const cardBtnUrl = formatUrl(card.cardCtaUrl?.[currentLang], card.serviceSlug || '#');

            return (
              <div key={cIdx} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col justify-between shadow-lg text-start">
                <div>
                  {card.cardImageUrl && (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                      <Image src={card.cardImageUrl} alt="Card Image" fill className="object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-3">{card.cardTitle?.[currentLang]}</h3>
                  
                  {card.servicePrice && (
                    <div className="text-red-500 font-black text-xl mb-3 tracking-wide">
                      {card.servicePrice} €
                    </div>
                  )}

                  <div className="text-zinc-400 text-sm mb-6 leading-relaxed prose prose-invert 
                    [&>strong]:text-amber-400
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5
                    [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-4 [&>h2]:mb-2
                    [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-3 [&>h3]:mb-1">
                    {card.cardDesc?.[currentLang] && <PortableText value={card.cardDesc[currentLang]} />}
                  </div>
                </div>

                {cardBtnText && (
                  <Link 
                    href={cardBtnUrl}
                    className="mt-4 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all text-center block shadow-md text-sm"
                  >
                    {cardBtnText}
                  </Link>
                )}
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
                className="group bg-zinc-900/80 border border-white/10 hover:border-red-600/50 rounded-2xl overflow-hidden p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-lg"
              >
                <div>
                  {page.imageUrl ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                      <Image 
                        src={page.imageUrl} 
                        alt={pageTitle || 'Service'} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 bg-zinc-800 rounded-xl mb-4 flex items-center justify-center text-zinc-500 text-xs">
                      No Image Available
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors">
                    {pageTitle}
                  </h3>
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