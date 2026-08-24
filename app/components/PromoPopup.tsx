'use client';

import { useState } from 'react';

interface LocalizedString {
  en?: string;
  de?: string;
  fr?: string;
  pl?: string;
}

interface PromoBannerProps {
  data: {
    isActive?: boolean;
    title?: LocalizedString;
    description?: LocalizedString;
    discountBadge?: LocalizedString;
    ctaText?: LocalizedString;
    ctaLink?: string;
  } | null;
  locale: string;
}

export default function PromoBanner({ data, locale }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!data || data.isActive === false || !isVisible) {
    return null;
  }

  const lang = (['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en') as keyof LocalizedString;

  const title = data.title?.[lang] || data.title?.en;
  const description = data.description?.[lang] || data.description?.en;
  const badge = data.discountBadge?.[lang] || data.discountBadge?.en;
  const ctaText = data.ctaText?.[lang] || data.ctaText?.en;

  return (
    <div className="bg-blue-600 text-white px-4 py-2.5 relative shadow-md flex items-center justify-between w-full">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-3 text-center text-xs md:text-sm">
        {badge && (
          <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold shadow">
            {badge}
          </span>
        )}
        {title && <span className="font-bold">{title}</span>}
        {description && <span>{description}</span>}
        {data.ctaLink && ctaText && (
          <a
            href={data.ctaLink}
            className="underline font-bold hover:text-gray-200 transition-colors ml-2"
          >
            {ctaText}
          </a>
        )}
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="text-white hover:text-gray-200 p-1 rounded-full transition-colors absolute right-4 font-bold text-sm"
        aria-label="إغلاق العرض"
      >
        ✕
      </button>
    </div>
  );
}