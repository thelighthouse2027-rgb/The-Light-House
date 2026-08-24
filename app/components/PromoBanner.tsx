'use client';

import { useState, useEffect } from 'react';

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
    imageUrl?: string; // أضفنا حقل رابط الصورة
  } | null;
  locale: string;
}

export default function PromoBanner({ data, locale }: PromoBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  // تأخير بسيط جداً عند الفتح ليعطي تأثيراً ناعماً
  useEffect(() => {
    const timer = setTimeout(() => {
      if (data && data.isActive !== false) {
        setIsVisible(true);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [data]);

  if (!data || data.isActive === false || !isVisible) {
    return null;
  }

  const lang = (['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en') as keyof LocalizedString;

  const title = data.title?.[lang] || data.title?.en;
  const description = data.description?.[lang] || data.description?.en;
  const badge = data.discountBadge?.[lang] || data.discountBadge?.en;
  const ctaText = data.ctaText?.[lang] || data.ctaText?.en;

  return (
    // الخلفية الزجاجية المعتمة التي تغطي الموقع بالكامل
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      
      {/* صندوق العرض بتأثير 3D وإضاءة حول الحواف */}
      <div className="relative bg-[#0f172a] border border-indigo-500/40 rounded-2xl shadow-[0_10px_40px_rgba(79,70,229,0.4)] max-w-xl w-full overflow-hidden flex flex-col">
        
        {/* زر الإغلاق */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors font-bold"
          aria-label="إغلاق العرض"
        >
          ✕
        </button>

        {/* مساحة الصورة */}
        {data.imageUrl && (
          <div className="w-full h-56 md:h-72 relative bg-gray-800">
            <img
              src={data.imageUrl}
              alt={title || "Special Offer"}
              className="w-full h-full object-cover"
            />
            {/* شارة الخصم فوق الصورة */}
            {badge && (
              <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {badge}
              </div>
            )}
          </div>
        )}

        {/* مساحة النصوص والزر */}
        <div className="p-6 md:p-8 text-center flex flex-col items-center gap-3">
          {!data.imageUrl && badge && (
            <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {badge}
            </span>
          )}
          
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
              {title}
            </h2>
          )}
          
          {description && (
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-md">
              {description}
            </p>
          )}
          
          {data.ctaLink && ctaText && (
            <a
              href={data.ctaLink}
              className="mt-4 inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-transform hover:-translate-y-1 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            >
              {ctaText}
            </a>
          )}
        </div>

      </div>
    </div>
  );
}