'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { client } from '@/sanity/lib/client';
import { defineQuery } from 'next-sanity';

const REVIEWS_QUERY = defineQuery(`
  *[_type == "review"] | order(_createdAt desc){
    authorName,
    reviewText,
    timeAgo,
    rating,
    googleLink,
    "avatarUrl": avatar.asset->url
  }
`);

export default function GoogleReviews() {
  const t = useTranslations('GoogleReviews');
  const locale = useLocale();
  const lang = locale === 'ar' ? 'ar' : 'en';

  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    client.fetch(REVIEWS_QUERY)
      .then((data) => setReviews(data || []))
      .catch((err) => console.error('Error fetching reviews from Sanity:', err));
  }, []);

  // تكرار المصفوفة لضمان استمرار الشريط المتحرك بسلاسة دون فراغات
  const duplicatedReviews = reviews.length > 0 
    ? [...reviews, ...reviews, ...reviews, ...reviews, ...reviews] 
    : [];

  return (
    <section className="py-20 w-full overflow-hidden bg-black" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* عنوان السكشن والتقييم العام مترجم عبر ملفات الـ JSON */}
      <div className="text-center mb-16 px-6 max-w-7xl mx-auto">
        <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold tracking-wider">
          {t('tag')}
        </span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          {t('title')}
        </h2>
        
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
          <span className="text-2xl font-black text-white">4.9</span>
          <div className="text-yellow-500 tracking-wider">★★★★★</div>
          <span className="text-gray-400 text-sm">
            {t('reviewsCount')}
          </span>
        </div>
      </div>

      {/* شريط المراجعات المتحرك */}
      <div className="relative w-full overflow-hidden flex whitespace-nowrap py-4">
        {duplicatedReviews.length > 0 ? (
          <div 
            className={`flex gap-8 items-center shrink-0 review-ticker-${lang}`}
            style={{
              display: 'flex',
              width: 'max-content',
              animation: lang === 'ar' ? 'tickerAr 40s linear infinite' : 'tickerEn 40s linear infinite'
            }}
          >
            {duplicatedReviews.map((review: any, idx: number) => {
              // المراجعات من سانتي تدعم اللغات أو النص المباشر
              const authorName = review?.authorName 
                ? (typeof review.authorName === 'object' 
                    ? (review.authorName[lang] || review.authorName.ar || review.authorName.en || 'مستخدم') 
                    : review.authorName)
                : 'مستخدم';

              const reviewText = review?.reviewText 
                ? (typeof review.reviewText === 'object' 
                    ? (review.reviewText[lang] || review.reviewText.ar || review.reviewText.en || '') 
                    : review.reviewText)
                : '';

              const timeAgo = review?.timeAgo 
                ? (typeof review.timeAgo === 'object' 
                    ? (review.timeAgo[lang] || review.timeAgo.ar || review.timeAgo.en || '') 
                    : review.timeAgo)
                : '';

              return (
                <div 
                  key={idx} 
                  className="bg-[#0b0f19]/90 border border-neutral-800/80 p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between relative group hover:border-blue-500/50 transition duration-300 w-[380px] md:w-[420px] whitespace-normal shrink-0"
                >
                  {/* أيقونة الاقتباس */}
                  <div className="absolute top-6 end-6 text-indigo-950/80 group-hover:text-blue-900/40 transition duration-300 pointer-events-none">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </div>

                  <div>
                    <div className="flex items-center gap-4 mb-6 relative z-10">
                      {review?.avatarUrl ? (
                        <img src={review.avatarUrl} alt={authorName} className="w-12 h-12 rounded-full object-cover border border-neutral-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-300 font-bold text-lg">
                          {authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base text-start">{authorName}</h4>
                        <span className="text-xs text-gray-400 text-start block">{timeAgo}</span>
                      </div>
                    </div>

                    <div className="text-yellow-500 mb-4 text-sm tracking-widest text-start">★★★★★</div>

                    <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light text-start line-clamp-4">
                      "{reviewText}"
                    </p>
                  </div>

                  {review?.googleLink && (
                    <div className="pt-4 border-t border-neutral-800/80 text-start">
                      <a 
                        href={review.googleLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 transition inline-flex items-center gap-1 font-medium"
                      >
                        <span>{t('googleBtn')}</span>
                        <span>↗</span>
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="w-full text-center text-gray-500 py-10">
            {lang === 'ar' ? 'لا توجد مراجعات مضافة حالياً في لوحة التحكم.' : 'No reviews added in the studio yet.'}
          </div>
        )}

        {/* حركات الشريط المتحرك */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes tickerAr {
            0% { transform: translateX(0); }
            100% { transform: translateX(50%); }
          }
          @keyframes tickerEn {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .review-ticker-ar:hover, .review-ticker-en:hover {
            animation-play-state: paused;
          }
        `}} />
      </div>

    </section>
  );
}