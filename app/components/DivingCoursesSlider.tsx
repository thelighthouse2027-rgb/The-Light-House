'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function DivingCoursesSlider({ 
  data = [], 
  locale, 
  exploreText, 
  featuredText,
  heading,
  headingHighlight,
  subtitle
}: { 
  data?: any[], 
  locale: string, 
  exploreText: string, 
  featuredText: string,
  heading: string,
  headingHighlight: string,
  subtitle: string
}) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || !data || data?.length === 0) return;

    const interval = setInterval(() => {
      setActive((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 4500);
    
    return () => clearInterval(interval);
  }, [data?.length, isPaused]); 

  if (!data || data?.length === 0) {
    return (
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
          {heading} <span className="text-blue-500">{headingHighlight}</span>
        </h2>
        <div className="text-zinc-400 py-10">لا توجد كورسات مضافة حالياً.</div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {heading} <span className="text-blue-500">{headingHighlight}</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div 
        className="flex flex-col md:flex-row w-full h-[850px] md:h-[650px] gap-2 md:gap-3"
        onMouseEnter={() => setIsPaused(true)} 
        onMouseLeave={() => setIsPaused(false)} 
        onTouchStart={() => setIsPaused(true)} 
        onTouchEnd={() => setIsPaused(false)} 
      >
        {data.map((item, index) => {
          const isActive = active === index;
          const imageText = item.title;
          const description = item.desc;
          
          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onClick={() => {
                if (!isActive) {
                  setActive(index);
                } else {
                  router.push(`/${locale}/services/${item.slug}`); 
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (!isActive) {
                    setActive(index);
                  } else {
                    router.push(`/${locale}/services/${item.slug}`);
                  }
                }
              }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive 
                  ? 'flex-[4] md:flex-[5] shadow-[0_0_40px_rgba(37,99,235,0.25)]' 
                  : 'flex-[1] opacity-70 hover:opacity-100 hover:flex-[1.2]'
              }`}
            >
              <Image
                src={item.img}
                alt={imageText || 'صورة'}
                title={imageText}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 400px"
                quality={80} 
                className={`object-cover transition-transform duration-[1200ms] ${
                  isActive ? 'scale-105' : 'scale-100 grayscale-[40%]'
                }`}
                priority={index === 0} 
              />
              
              <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 z-10 ${
                isActive ? 'from-black/90 via-black/40 to-transparent' : 'from-black/90 via-black/30 to-transparent'
              }`} />

              <div className="absolute z-20 bottom-0 left-0 w-full h-full flex flex-col justify-end p-5 md:p-8">
                <div 
                  className={`transition-all duration-[800ms] delay-100 ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="hidden md:inline-block px-3 py-1 mb-4 rounded-full bg-blue-600/20 border border-blue-500/50 backdrop-blur-md">
                    <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">{featuredText}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 md:mb-3 drop-shadow-lg leading-tight">
                    {imageText}
                  </h3>
                  
                  {description && (
                    <p className="hidden md:block text-zinc-300 text-sm font-light max-w-sm drop-shadow-md leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  )}
                  
                  <div className="mt-3 md:mt-6">
                    <Link 
                      href={`/${locale}/services/${item.slug}`}
                      title={imageText}
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <button className="px-5 py-2 md:px-8 md:py-3 bg-white/10 hover:bg-blue-600 border border-white/20 hover:border-blue-500 backdrop-blur-md rounded-xl md:rounded-2xl text-white text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                        {exploreText}
                      </button>
                    </Link>
                  </div>
                </div>

                {!isActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-4 z-25">
                    <span className="text-white/60 font-mono text-xs font-bold tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      0{index + 1}
                    </span>
                    <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.9)] animate-pulse mb-4"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}