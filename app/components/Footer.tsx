'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { FaWhatsapp, FaFacebookF, FaYoutube, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const quickLinks = [
    { name: t('about'), slug: 'about' },
    { name: t('services'), slug: 'services' },
    { name: t('exploreAndBook'), slug: 'search' }, 
    { name: t('contact'), slug: 'contact' },
  ];

  const serviceLinks = [
    { name: t('safari'), slug: 'services/safari' },
    { name: t('divingTrips'), slug: 'diving-trips' },
    { name: t('boatTrips'), slug: 'services/boat-trips' },
    { name: t('divingCourses'), slug: 'diving-courses' },
  ];

  return (
    <footer 
      className="relative w-full overflow-hidden bg-black/70 backdrop-blur-2xl border-t-2 border-red-600/50 shadow-[0_-15px_50px_rgba(220,38,38,0.15)] mt-20"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 mb-12">
          
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              <Image 
                src="/logoo.webp" 
                alt="The Light House Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
                The Light House
              </h2>
              <p className="text-zinc-400 text-sm mt-2 max-w-sm leading-relaxed">
                {t('description')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* الإيميل الجديد */}
            <a href="mailto:thelighthouse2027@gmail.com" className="flex items-center gap-3 bg-zinc-900/80 border border-red-600/30 hover:border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 px-5 py-3 rounded-2xl">
              <FaEnvelope className="text-red-500" />
              <span className="text-zinc-200 text-sm font-medium">thelighthouse2027@gmail.com</span>
            </a>
            
            <a href="https://wa.me/201273327311" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-zinc-900/80 border border-red-600/30 hover:border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)] transition-all duration-300 px-5 py-3 rounded-2xl">
              <FaPhoneAlt className="text-red-500" />
              <span className="text-zinc-200 text-sm font-mono">+20 127 332 7311</span>
            </a>

            <div className="flex items-center gap-3 ml-2">
              <a href="https://wa.me/201273327311" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900/80 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                <FaWhatsapp className="text-xl" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900/80 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                <FaFacebookF className="text-xl" />
              </a>
              <a href="https://www.youtube.com/@TheLightHouse-v8b" target="_blank" rel="noopener noreferrer" className="p-3 bg-zinc-900/80 border border-red-600/30 text-red-500 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.15)] hover:shadow-[0_0_25px_rgba(220,38,38,0.4)]">
                <FaYoutube className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-red-600/30 pb-3 inline-block drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]">
              {t('quickLinksTitle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <Link 
                  key={index} 
                  href={`/${locale}/${link.slug}`}
                  className="bg-zinc-900/60 backdrop-blur-md border border-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.05)] hover:border-red-500 hover:bg-red-950/40 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] text-zinc-300 hover:text-white transition-all duration-300 px-5 py-3 rounded-xl flex items-center justify-center text-sm font-semibold hover:-translate-y-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 border-b border-red-600/30 pb-3 inline-block drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]">
              {t('servicesTitle')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {serviceLinks.map((link, index) => (
                <Link 
                  key={index} 
                  href={`/${locale}/${link.slug}`}
                  className="bg-zinc-900/60 backdrop-blur-md border border-red-600/20 shadow-[0_0_15px_rgba(220,38,38,0.05)] hover:border-red-500 hover:bg-red-950/40 hover:shadow-[0_0_25px_rgba(220,38,38,0.3)] text-zinc-300 hover:text-white transition-all duration-300 px-5 py-3 rounded-xl flex items-center justify-center text-sm font-semibold hover:-translate-y-1"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        <div className="mt-16 pt-6 border-t border-red-600/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs font-medium">
            © {new Date().getFullYear()} The Light House. {t('rights')}
          </p>
          <p className="text-zinc-600 text-xs font-medium flex items-center gap-1">
            Made with <span className="text-red-600 animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]">❤</span> in Hurghada
          </p>
        </div>

      </div>
    </footer>
  );
}