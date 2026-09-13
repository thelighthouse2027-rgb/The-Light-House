'use client';

import { useState, useEffect } from 'react';

interface LocalizedString {
  en?: string;
  de?: string;
  fr?: string;
  pl?: string;
}

interface PromoPopupProps {
  data: {
    isActive?: boolean;
    title?: LocalizedString;
    description?: LocalizedString;
    discountBadge?: LocalizedString;
    ctaText?: LocalizedString;
    ctaLink?: string;
    imageUrl?: string;
  } | null;
  locale: string;
}

export default function PromoPopup({ data, locale }: PromoPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.isActive !== false && data.imageUrl) {
        setIsVisible(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.isActive === false || !isVisible || !data.imageUrl) {
    return null;
  }

  const lang = (['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en') as keyof LocalizedString;

  const title = data.title?.[lang] || data.title?.en;
  const description = data.description?.[lang] || data.description?.en;
  const badge = data.discountBadge?.[lang] || data.discountBadge?.en;
  const ctaText = data.ctaText?.[lang] || data.ctaText?.en;
  const imageAltTitle = title || "Offer";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative bg-[#0b0f19] border border-indigo-500/30 rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.3)] max-w-lg w-full overflow-hidden flex flex-col">
        
        {/* زر الإغلاق */}
        <button
          onClick={() => setIsVisible(false)}
          title="Close"
          aria-label="إغلاق"
          className="absolute top-3 right-3 z-20 bg-black/70 hover:bg-black text-white w-9 h-9 rounded-full flex items-center justify-center transition-colors font-bold shadow-lg cursor-pointer"
        >
          ✕
        </button>

        {/* الصورة */}
        <div className="w-full h-60 md:h-72 relative bg-gray-900">
          <img
            src={data.imageUrl}
            alt={imageAltTitle}
            title={imageAltTitle}
            className="w-full h-full object-cover"
          />
          {badge && (
            <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
              {badge}
            </div>
          )}
        </div>

        <div className="p-6 text-center flex flex-col items-center gap-3">
          {title && (
            <h3 className="text-xl md:text-2xl font-bold text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-300 text-sm leading-relaxed">
              {description}
            </p>
          )}
          {data.ctaLink && ctaText && (
            <a
              href={data.ctaLink}
              title={ctaText}
              aria-label={ctaText}
              className="mt-2 inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-7 rounded-full transition-transform hover:scale-105 shadow-md text-sm cursor-pointer"
            >
              {ctaText}
            </a>
          )}
        </div>

      </div>
    </div>
  );
}