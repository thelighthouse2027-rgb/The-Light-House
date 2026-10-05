'use client';

import { useEffect, useState } from 'react';
import { Star, ExternalLink, Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Review {
  name?: string;
  relativePublishTimeDescription?: string;
  rating?: number;
  text?: { text?: string } | string;
  originalText?: { text?: string } | string;
  authorAttribution?: {
    displayName?: string;
    photoUri?: string;
    uri?: string;
  };
}

interface PlaceData {
  name: string;
  rating: number;
  userRatingCount: number;
  reviews: Review[];
}

export default function GoogleReviews() {
  const t = useTranslations('GoogleReviews');

  const fallbackReviews: Review[] = [
    {
      relativePublishTimeDescription: t('monthAgo'),
      rating: 5,
      text: { text: 'حجزنا عدة رحلات بحرية للغطس والغوص هنا 🩴. خدمة موثوقة وودودة ومتعاونة!' },
      authorAttribution: {
        displayName: 'Julia Kindgen',
        photoUri: 'https://lh3.googleusercontent.com/a-/ALV-UjX8',
        uri: 'https://maps.google.com',
      },
    },
    {
      relativePublishTimeDescription: t('threeWeeksAgo'),
      rating: 5,
      text: { text: 'Awesome diving experience with The Light House team! Very professional instructors and great diving spots.' },
      authorAttribution: {
        displayName: 'Markus Weber',
        uri: 'https://maps.google.com',
      },
    },
    {
      relativePublishTimeDescription: t('twoMonthsAgo'),
      rating: 5,
      text: { text: 'من أفضل مراكز الغوص في الغردقة، تنظيم ممتاز وطاقم رحلات محترف جداً.' },
      authorAttribution: {
        displayName: 'احمد علي',
        uri: 'https://maps.google.com',
      },
    },
  ];

  const [data, setData] = useState<PlaceData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch('/api/google-reviews');
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();

        if (!result.reviews || result.reviews.length === 0) {
          result.reviews = fallbackReviews;
        }
        setData(result);
      } catch (err) {
        console.error(err);
        setData({
          name: 'The Light House Diving Center',
          rating: 4.9,
          userRatingCount: 77,
          reviews: fallbackReviews,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto my-12">
      {/* الهيدر والعنوان بلون أزرق بنفسجي مطابق للصورة */}
      <div className="text-center mb-12 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-800/50 text-indigo-300 text-xs font-medium mb-4 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
          <span>{t('badge')}</span>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
          {t('titlePrefix')} <span className="text-indigo-500">The Light House</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-indigo-900/50 backdrop-blur-md">
            <span className="text-3xl font-extrabold text-amber-400">
              {data.rating ? data.rating.toFixed(1) : '4.9'}
            </span>
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(data.rating || 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
          <span className="text-sm text-slate-400">
            {t('basedOn')} <strong className="text-slate-200">{data.userRatingCount || 77}</strong> {t('reviewsSuffix')}
          </span>
        </div>
      </div>

      {/* كروت التقييمات بخلفيات وألوان زرقاء داكنة مثل كروت الفيديو بالصورة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.reviews.map((review, idx) => {
          const getText = (val: any) => {
            if (typeof val === 'string') return val;
            if (val && typeof val === 'object' && val.text) return val.text;
            return '';
          };

          const reviewText =
            getText(review.text) ||
            getText(review.originalText) ||
            t('noComment');

          const authorName = review.authorAttribution?.displayName || t('guestUser');
          const authorPhoto = review.authorAttribution?.photoUri;

          return (
            <div
              key={idx}
              className="group relative bg-[#0f1523]/80 hover:bg-[#141c2e] border border-indigo-900/40 hover:border-indigo-600/60 transition-all duration-300 p-6 rounded-2xl backdrop-blur-md flex flex-col justify-between shadow-lg"
            >
              <Quote className="absolute top-5 ltr:right-5 rtl:left-5 w-7 h-7 text-indigo-950/80 group-hover:text-indigo-800/40 transition-colors pointer-events-none" />

              <div>
                {/* اسم وصورة المراجع */}
                <div className="flex items-center gap-3 mb-4">
                  {authorPhoto ? (
                    <img
                      src={authorPhoto}
                      alt={authorName}
                      className="w-11 h-11 rounded-full object-cover border border-indigo-800/50"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-indigo-900/80 text-indigo-200 flex items-center justify-center font-bold text-base border border-indigo-700/50">
                      {authorName[0]}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                      {authorName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {review.relativePublishTimeDescription || t('recently')}
                    </p>
                  </div>
                </div>

                {/* تقييم النجوم */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (review.rating || 5)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-800'
                      }`}
                    />
                  ))}
                </div>

                {/* نص التقييم */}
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-4 font-normal">
                  "{reviewText}"
                </p>
              </div>

              {/* رابط العرض على جوجل */}
              <a
                href={review.authorAttribution?.uri || 'https://maps.google.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pt-4 border-t border-indigo-950"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('viewOriginal')}</span>
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}