import { client } from '@/sanity/lib/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

async function getPageBySlug(slug: string) {
  const query = `*[_type == "flexiblePage" && slug.current == $slug][0]{
    pageTitle,
    slug,
    sections[]{
      ...,
      _type == "heroSection" => {
        ...,
        "bgImageUrl": bgImage.asset->url,
        "bgVideoFileUrl": bgVideoFile.asset->url
      },
      _type == "splitSection" => {
        ...,
        "imageUrl": image.asset->url,
        "videoFileUrl": videoFile.asset->url
      },
      _type == "sliderSection" => {
        ...,
        slides[]{
          ...,
          "imageUrl": image.asset->url
        }
      },
      _type == "gridCardsSection" => {
        ...,
        cards[]{
          ...,
          "cardImageUrl": cardImage.asset->url,
          "miniSliderUrls": miniSliderImages[].asset->url
        }
      }
    }
  }`;
  return await client.fetch(query, { slug });
}

export default async function FeaturePage({ 
  params 
}: { 
  params: Promise<{ locale: string; slug: string }> 
}) {
  const { locale, slug } = await params;
  const data = await getPageBySlug(slug);

  if (!data) {
    notFound();
  }

  const lang = (['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en') as 'en' | 'de' | 'fr' | 'pl';

  return (
    <main className="w-full min-h-screen text-white bg-[#0b0f19]">
      
      {data.sections && data.sections.map((section: any, index: number) => {
        
        // 1. Hero Section
        if (section._type === 'heroSection') {
          const badgeText = section.badge?.[lang] || section.badge?.en;
          const titleText = section.title?.[lang] || section.title?.en;
          const subtitleText = section.subtitle?.[lang] || section.subtitle?.en;
          const ctaText = section.ctaText?.[lang] || section.ctaText?.en;
          // جلب الرابط حسب اللغة
          const ctaUrl = section.ctaUrl?.[lang] || section.ctaUrl?.en; 

          let youtubeEmbedUrl = '';
          if (section.bgVideoUrl) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = section.bgVideoUrl.match(regExp);
            if (match && match[2].length === 11) {
              youtubeEmbedUrl = `https://www.youtube.com/embed/${match[2]}?autoplay=1&mute=1&loop=1&playlist=${match[2]}&controls=0&showinfo=0&autohide=1`;
            }
          }

          return (
            <div 
              key={index} 
              className="relative min-h-[75vh] flex items-center justify-center text-center p-8 bg-cover bg-center overflow-hidden"
              style={{ backgroundImage: !section.bgVideoFileUrl && !youtubeEmbedUrl && section.bgImageUrl ? `url(${section.bgImageUrl})` : 'none' }}
            >
              {section.bgVideoFileUrl && (
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0">
                  <source src={section.bgVideoFileUrl} type="video/mp4" />
                </video>
              )}
              {!section.bgVideoFileUrl && youtubeEmbedUrl && (
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                  <iframe src={youtubeEmbedUrl} className="absolute top-1/2 left-1/2 w-[150vw] h-[150vh] -translate-x-1/2 -translate-y-1/2 object-cover opacity-60" allow="autoplay; encrypted-media" tabIndex={-1} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10" />

              <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center gap-6">
                {badgeText && (
                  <span className="bg-indigo-600/80 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                    {badgeText}
                  </span>
                )}
                {titleText && (
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                    {titleText}
                  </h1>
                )}
                {subtitleText && (
                  <p className="text-zinc-200 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
                    {subtitleText}
                  </p>
                )}
                {ctaText && ctaUrl && (
                  <div className="mt-4">
                    <Link href={ctaUrl} className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all duration-300">
                      {ctaText}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        }

        // 2. Split Section
        if (section._type === 'splitSection') {
          const titleText = section.title?.[lang] || section.title?.en;
          const descText = section.description?.[lang] || section.description?.en;
          const ctaText = section.ctaText?.[lang] || section.ctaText?.en;
          // جلب الرابط حسب اللغة
          const ctaUrl = section.ctaUrl?.[lang] || section.ctaUrl?.en; 
          
          const isImageLeft = section.layoutDirection === 'imageLeft';

          return (
            <section key={index} className="py-24 px-6 max-w-7xl mx-auto">
              <div className={`flex flex-col lg:flex-row items-center gap-12 ${isImageLeft ? '' : 'lg:flex-row-reverse'}`}>
                
                <div className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-2xl border border-indigo-500/20 bg-slate-900 h-[380px] md:h-[450px]">
                  {section.mediaType === 'image' && section.imageUrl && (
                    <img src={section.imageUrl} alt={titleText || "Split media"} className="w-full h-full object-cover" />
                  )}
                  {section.mediaType === 'videoFile' && section.videoFileUrl && (
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                      <source src={section.videoFileUrl} type="video/mp4" />
                    </video>
                  )}
                </div>

                <div className="w-full lg:w-1/2 flex flex-col items-start gap-6">
                  {titleText && (
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      {titleText}
                    </h2>
                  )}
                  {descText && (
                    <p className="text-zinc-300 text-lg font-light leading-relaxed">
                      {descText}
                    </p>
                  )}
                  {ctaText && ctaUrl && (
                    <div className="pt-2">
                      <Link href={ctaUrl} className="px-7 py-3 bg-white/10 hover:bg-indigo-600 border border-white/20 hover:border-indigo-500 rounded-xl text-white font-bold transition-all duration-300 shadow-md">
                        {ctaText}
                      </Link>
                    </div>
                  )}
                </div>

              </div>
            </section>
          );
        }

        // 3. Slider Section
        if (section._type === 'sliderSection') {
          const secTitle = section.sectionTitle?.[lang] || section.sectionTitle?.en;

          return (
            <section key={index} className="py-20 overflow-hidden w-full bg-[#0b0f19]">
              {secTitle && (
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
                  {secTitle}
                </h2>
              )}
              <div className="relative w-full overflow-hidden flex whitespace-nowrap group">
                <div className="flex gap-6 animate-marquee w-max">
                  {[...(section.slides || []), ...(section.slides || [])].map((slide: any, sIdx: number) => {
                    const captionText = slide.caption?.[lang] || slide.caption?.en;
                    // جلب الرابط حسب اللغة
                    const slideUrl = slide.slideUrl?.[lang] || slide.slideUrl?.en; 
                    
                    const slideContent = (
                      <div className="relative rounded-2xl overflow-hidden shadow-2xl w-[350px] md:w-[420px] h-[250px] md:h-[280px] bg-gray-900 border border-indigo-500/30 flex-shrink-0 group/card cursor-pointer">
                        {slide.imageUrl && (
                          <img src={slide.imageUrl} alt={captionText || "Slide"} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" />
                        )}
                        {captionText && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-6">
                            <p className="text-white font-bold text-lg drop-shadow-md">{captionText}</p>
                          </div>
                        )}
                      </div>
                    );

                    return slideUrl ? (
                      <Link key={sIdx} href={slideUrl}>
                        {slideContent}
                      </Link>
                    ) : (
                      <div key={sIdx}>{slideContent}</div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        }

        // 4. Grid Cards Section
        if (section._type === 'gridCardsSection') {
          const secTitle = section.sectionTitle?.[lang] || section.sectionTitle?.en;

          return (
            <section key={index} className="py-16 px-6 max-w-7xl mx-auto">
              {secTitle && (
                <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-indigo-400">
                  {secTitle}
                </h2>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.cards?.map((card: any, cIdx: number) => {
                  const cardTitle = card.cardTitle?.[lang] || card.cardTitle?.en;
                  const cardDesc = card.cardDesc?.[lang] || card.cardDesc?.en;
                  const cardCtaText = card.cardCtaText?.[lang] || card.cardCtaText?.en;
                  // جلب الرابط حسب اللغة
                  const cardCtaUrl = card.cardCtaUrl?.[lang] || card.cardCtaUrl?.en;

                  return (
                    <div key={cIdx} className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.15)] flex flex-col justify-between">
                      <div>
                        {card.cardImageUrl && (
                          <div className="h-52 w-full overflow-hidden relative">
                            <img src={card.cardImageUrl} alt={cardTitle || "Card"} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        )}
                        <div className="p-6">
                          {cardTitle && <h3 className="text-2xl font-bold mb-2 text-white">{cardTitle}</h3>}
                          {cardDesc && <p className="text-zinc-300 text-sm leading-relaxed">{cardDesc}</p>}
                        </div>
                      </div>

                      <div className="p-6 pt-0 flex flex-col gap-4">
                        {card.hasMiniSlider && card.miniSliderUrls?.length > 0 && (
                          <div className="pt-2 border-t border-zinc-800 flex gap-2 overflow-x-auto pb-2">
                            {card.miniSliderUrls.map((mUrl: string, mIdx: number) => (
                              <img key={mIdx} src={mUrl} alt="Mini slide" className="w-20 h-16 object-cover rounded-lg border border-indigo-500/30 flex-shrink-0" />
                            ))}
                          </div>
                        )}

                        {cardCtaText && cardCtaUrl && (
                          <Link href={cardCtaUrl} className="w-full py-2.5 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/50 text-center rounded-xl text-white font-semibold text-sm transition-all duration-300">
                            {cardCtaText}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        return null;
      })}

    </main>
  );
}