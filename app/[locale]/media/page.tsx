'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';

export default function MediaPage() {
  const locale = useLocale();
  const lang = locale === 'ar' ? 'ar' : 'en';

  const [activeTab, setActiveTab] = useState<'photos' | 'videos'>('photos');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // قائمة الصور المتوفرة لديك
  const photos = [
    { src: '/a.webp', title: lang === 'ar' ? 'تجربة الغوص الاحترافي' : 'Professional Diving Experience' },
    { src: '/about.webp', title: lang === 'ar' ? 'عن The Light House' : 'About The Light House' },
    { src: '/aboutus.webp', title: lang === 'ar' ? 'فريق العمل والخبرة' : 'Our Team & Expertise' },
    { src: '/b.webp', title: lang === 'ar' ? 'الشعاب المرجانية الساحرة' : 'Stunning Coral Reefs' },
    { src: '/c.webp', title: lang === 'ar' ? 'رحلات البحر والسفاري' : 'Sea & Safari Cruises' },
    { src: '/cruises.webp', title: lang === 'ar' ? 'رحلات اليخوت البحرية' : 'Yacht Cruises' },
    { src: '/d.webp', title: lang === 'ar' ? 'غوص الليل والمغامرة' : 'Night Diving Adventure' },
    { src: '/diving.webp', title: lang === 'ar' ? 'عالم الغوص الممتع' : 'Exciting Diving World' },
    { src: '/divingcourses.webp', title: lang === 'ar' ? 'دورات غوص PADI' : 'PADI Diving Courses' },
    { src: '/e.webp', title: lang === 'ar' ? 'السنorkeling والسباحة' : 'Snorkeling & Swimming' },
    { src: '/f.webp', title: lang === 'ar' ? 'غوص حطام السفن' : 'Wreck Diving' },
    { src: '/safari.webp', title: lang === 'ar' ? 'رحلات السفاري' : 'Safari Trips' },
    { src: '/u.webp', title: lang === 'ar' ? 'التصوير تحت الماء' : 'Underwater Photography' },
  ];

  // قائمة الفيديوهات الفعلية من مجلد videos/
  const videos = [
    { src: '/videos/hero.mp4', title: lang === 'ar' ? 'فيديو البداية الرئيسي' : 'Main Hero Video' },
    { src: '/videos/safari.mp4', title: lang === 'ar' ? 'رحلات السفاري والبحار' : 'Safari & Sea Trips' },
    { src: '/videos/bg.mp4', title: lang === 'ar' ? 'خلفية أعماق البحر الأحمر' : 'Red Sea Background' },
    { src: '/videos/aaa.mp4', title: lang === 'ar' ? 'مغامرات الغوص الاحترافي' : 'Pro Diving Adventures' },
    { src: '/videos/aaaa.mp4', title: lang === 'ar' ? 'لقطات حصرية تحت الماء' : 'Exclusive Underwater Shots' },
    { src: '/videos/c.mp4', title: lang === 'ar' ? 'استكشاف الشعاب المرجانية' : 'Exploring Coral Reefs' },
    { src: '/videos/dd.mp4', title: lang === 'ar' ? 'رحلات القوارب واليخوت' : 'Boat & Yacht Trips' },
    { src: '/videos/h.mp4', title: lang === 'ar' ? 'لحظات لا تنسى' : 'Unforgettable Moments' },
    { src: '/videos/i.mp4', title: lang === 'ar' ? 'جولة في مراكز الغوص' : 'Diving Center Tour' },
    { src: '/videos/kk.mp4', title: lang === 'ar' ? 'متعة الغوص والسباحة' : 'Diving & Swimming Fun' },
    { src: '/videos/p.mp4', title: lang === 'ar' ? 'لقطات تذكارية للضيوف' : 'Guest Memories' },
    { src: '/videos/pg.mp4', title: lang === 'ar' ? 'مشاهد من البحر الأحمر' : 'Red Sea Views' },
    { src: '/videos/q.mp4', title: lang === 'ar' ? 'مغامرة مثيرة' : 'Exciting Adventure' },
    { src: '/videos/v.mp4', title: lang === 'ar' ? 'عالم تحت الماء الساحر' : 'Magical Underwater World' },
    { src: '/videos/z.mp4', title: lang === 'ar' ? 'ختام رحلاتنا البحرية' : 'Cruise Finale' },
  ];

  return (
    <main className="min-h-screen bg-black text-white py-24 px-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto">
        
        {/* عنوان الصفحة */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold tracking-wider uppercase">
            {lang === 'ar' ? 'معرض الذكريات والميديا' : 'Media & Gallery Showcase'}
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {lang === 'ar' ? 'استكشف عالمنا تحت الماء' : 'Explore Our Underwater World'}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto font-light">
            {lang === 'ar' 
              ? 'لقطات حصرية وفيديوهات رائعة من رحلات الغوص، الشعاب المرجانية، ومغامراتنا في البحر الأحمر.' 
              : 'Exclusive snapshots and amazing videos from our diving trips, coral reefs, and Red Sea adventures.'}
          </p>
        </div>

        {/* أزرار التبديل بين الصور والفيديوهات */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500'
                : 'bg-neutral-900 text-zinc-400 hover:text-white border border-neutral-800'
            }`}
          >
            {lang === 'ar' ? '📸 معرض الصور' : '📸 Photo Gallery'}
          </button>
          
          <button
            onClick={() => setActiveTab('videos')}
            className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-500'
                : 'bg-neutral-900 text-zinc-400 hover:text-white border border-neutral-800'
            }`}
          >
            {lang === 'ar' ? '🎥 معرض الفيديوهات' : '🎥 Video Gallery'}
          </button>
        </div>

        {/* عرض الصور */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(photo.src)}
                className="group relative h-80 rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 cursor-pointer shadow-xl transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.2)]"
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                <div className="absolute inset-0 p-6 flex flex-col justify-end z-10">
                  <h3 className="text-white font-bold text-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {photo.title}
                  </h3>
                  <span className="text-blue-400 text-xs font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {lang === 'ar' ? 'اضغط للتكبير 🔍' : 'Click to expand 🔍'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* عرض الفيديوهات من مجلد videos */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video, idx) => (
              <div
                key={idx}
                className="bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col group hover:border-blue-500/50 transition duration-300"
              >
                <div className="relative w-full h-[240px] bg-black">
                  <video
                    src={video.src}
                    controls
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-white font-bold text-lg">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* نافذة عرض الصورة مكبرة (Lightbox) */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Expanded Preview"
                fill
                className="object-contain rounded-2xl"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition border border-white/20"
              >
                ✕
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}