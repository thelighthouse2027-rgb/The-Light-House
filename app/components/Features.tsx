'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Features() {
  const t = useTranslations('Features');

  const data = [
    { key: 'diving', img: '/a.webp' },
    { key: 'coral', img: '/b.webp' },
    { key: 'boat', img: '/c.webp' },
    { key: 'night', img: '/d.webp' },
    { key: 'snorkeling', img: '/e.webp' },
    { key: 'wreck', img: '/f.webp' },
    { key: 'photo', img: '/u.webp' },
  ];

  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      
      {/* عنوان السيكشن */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {t('heading')} <span className="text-red-600">{t('headingHighlight')}</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* السلايدر المتمدد */}
      <div className="flex flex-col md:flex-row w-full h-[850px] md:h-[650px] gap-2 md:gap-3">
        {data.map((item, index) => {
          const isActive = active === index;
          
          return (
            <div
              key={index}
              onClick={() => setActive(index)}
              className={`relative cursor-pointer overflow-hidden rounded-2xl md:rounded-[2rem] transition-all duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive 
                  ? 'flex-[4] md:flex-[5] shadow-[0_0_40px_rgba(220,38,38,0.2)]' 
                  : 'flex-[1] opacity-70 hover:opacity-100 hover:flex-[1.2]'
              }`}
            >
              {/* الصورة */}
              <img
                src={item.img}
                alt={t(`items.${item.key}.title`)}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ${
                  isActive ? 'scale-105' : 'scale-100 grayscale-[40%]'
                }`}
              />
              
              {/* التعتيم الزجاجي */}
              <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-700 ${
                isActive ? 'from-black/90 via-black/40 to-transparent' : 'from-black/90 via-black/30 to-transparent'
              }`} />

              {/* المحتوى النصي داخل الكارت النشط */}
              <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-end p-5 md:p-8">
                <div 
                  className={`transition-all duration-[800ms] delay-100 ${
                    isActive ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="hidden md:inline-block px-3 py-1 mb-4 rounded-full bg-red-600/20 border border-red-500/50 backdrop-blur-md">
                    <span className="text-red-400 text-xs font-bold uppercase tracking-wider">{t('featured')}</span>
                  </div>
                  
                  <h3 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-white mb-2 md:mb-3 drop-shadow-lg leading-tight">
                    {t(`items.${item.key}.title`)}
                  </h3>
                  
                  <p className="hidden md:block text-zinc-300 text-sm font-light max-w-sm drop-shadow-md leading-relaxed">
                    {t(`items.${item.key}.desc`)}
                  </p>
                  
                  <div className="mt-3 md:mt-6">
                    <button className="px-5 py-2 md:px-8 md:py-3 bg-white/10 hover:bg-red-600 border border-white/20 hover:border-red-500 backdrop-blur-md rounded-xl md:rounded-2xl text-white text-xs md:text-sm font-bold transition-all duration-300">
                      {t('exploreMore')}
                    </button>
                  </div>
                </div>

                {/* تصميم الكارت غير النشط (أنيق وبسيط بدون نصوص مقصوصة) */}
                {!isActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-between p-4">
                    {/* رقم الكارت في الأعلى */}
                    <span className="text-white/60 font-mono text-xs font-bold tracking-widest bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                      0{index + 1}
                    </span>
                    
                    {/* نقطة مضيئة في الأسفل تدل على الكارت */}
                    <div className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse mb-4"></div>
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