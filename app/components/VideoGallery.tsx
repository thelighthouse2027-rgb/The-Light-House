'use client';

import { useState } from 'react';

const youtubeVideoIds = [
  'qafU51EaoJM',
  'SGsvoMmbmG8',
  'SFpDS74LC5M',
  'LJZQfO1dG2A',
  'FN-DSBkQNqI',
  '-iVfe_21H9I',
  'OFX7d4cyHLM',
  'ga41Uwts8fM',
  'Cclvx-4xCNs',
  'Zj8HamOiapY'
];

const translations = {
  en: {
    title: "Lens of Our Adventures",
    subtitle: "Discover the beauty of the depths and nature through exclusive live footage from our past trips."
  },
  de: {
    title: "Linse unserer Abenteuer",
    subtitle: "Entdecken Sie die Schönheit der Tiefen und der Natur durch exklusive Live-Aufnahmen unserer vergangenen Reisen."
  },
  fr: {
    title: "L'objectif de nos aventures",
    subtitle: "Découvrez la beauté des profondeurs et de la nature grâce à des images en direct exclusives de nos précédents voyages."
  },
  pl: {
    title: "Obiektyw naszych przygód",
    subtitle: "Odkryj piękno głębin i natury dzięki ekskluzywnym nagraniom na żywo z naszych ostatnich podróży."
  }
};

export default function VideoGallery({ locale }: { locale: string }) {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const currentLang = (['en', 'de', 'fr', 'pl'].includes(locale) ? locale : 'en') as 'en' | 'de' | 'fr' | 'pl';
  const t = translations[currentLang];

  const closeModal = () => setActiveVideoId(null);

  return (
    <section className="py-24 bg-[#0b0f19] overflow-hidden relative">
      
      <div className="text-center mb-16 relative z-10 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          {t.title.split(' ')[0]} <span className="text-indigo-500">{t.title.split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <div className="relative w-full flex whitespace-nowrap overflow-hidden group">
        
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0b0f19] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0b0f19] to-transparent z-10 pointer-events-none" />

        <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max px-3">
          {[...youtubeVideoIds, ...youtubeVideoIds].map((id, index) => {
            const imageAltTitle = `${t.title} - Adventure Video ${index + 1}`;

            return (
              <div 
                key={index} 
                role="button"
                tabIndex={0}
                aria-label={imageAltTitle}
                title={imageAltTitle} // <-- إضافة الـ title لعنصر الفيديو التفاعلي
                className="relative w-[300px] md:w-[400px] aspect-video flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer border border-indigo-500/20 shadow-lg group/video transition-transform duration-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(79,70,229,0.4)] hover:border-indigo-500/50 bg-slate-900"
                onClick={() => setActiveVideoId(id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveVideoId(id);
                  }
                }}
              >
                <img 
                  src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`} 
                  alt={imageAltTitle}
                  title={imageAltTitle}
                  className="w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover/video:scale-110"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30 shadow-xl">
                    <svg className="w-8 h-8 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
          
          <div 
            role="button"
            tabIndex={0}
            aria-label="Close modal"
            title="Close modal"
            className="absolute inset-0 cursor-pointer" 
            onClick={closeModal}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === 'Space') {
                closeModal();
              }
            }}
          />
          
          <button 
            onClick={closeModal}
            aria-label="Close video modal"
            title="Close video modal"
            className="absolute top-6 right-6 md:top-10 md:right-10 w-12 h-12 bg-white/10 hover:bg-red-600 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors z-50 cursor-pointer"
          >
            ✕
          </button>

          <div className="relative z-10 w-full max-w-5xl aspect-video rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.3)] border border-white/10 bg-black">
            <iframe 
              src={`https://www.youtube-nocookie.com/embed/${activeVideoId}?autoplay=1&rel=0`}
              title="YouTube video player"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

        </div>
      )}
    </section>
  );
}