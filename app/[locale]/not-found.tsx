'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { FaHome, FaCompass, FaEnvelope, FaWhatsapp } from 'react-icons/fa';

export default function NotFound() {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <main 
      className="w-full min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden px-6 py-24"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl mx-auto text-center relative z-10 space-y-8">
        
        <div className="flex justify-center">
          <div className="relative w-24 h-24 drop-shadow-[0_0_20px_rgba(0,149,255,0.7)]">
            <Image 
              src="/logoo.webp" 
              alt="The Light House Logo" 
              fill 
              sizes="96px"
              className="object-contain"
              priority
            />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-blue-500 font-mono text-sm tracking-widest uppercase bg-blue-950/40 border border-blue-600/30 px-3 py-1 rounded-full">
            404 Error
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {isRtl ? 'عذراً، الصفحة غير موجودة' : 'Oops! Page Not Found'}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md mx-auto">
            {isRtl 
              ? 'يبدو أن الرابط الذي قمت بزيارته قد تم حذفه، تغير مساره، أو أن هناك خطأ في كتابة العنوان.' 
              : 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link 
            href={`/${locale}`}
            className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 text-sm"
          >
            <FaHome className="text-base" />
            <span>{isRtl ? 'الرئيسية' : 'Home Page'}</span>
          </Link>

          <Link 
            href={`/${locale}/services`}
            className="flex items-center gap-2 px-6 py-3.5 bg-zinc-900/80 border border-blue-600/30 hover:border-blue-500 text-zinc-200 hover:text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all duration-300 text-sm"
          >
            <FaCompass className="text-blue-400 text-base" />
            <span>{isRtl ? 'استكشف الخدمات' : 'Explore Services'}</span>
          </Link>

          <Link 
            href={`/${locale}/contact`}
            className="flex items-center gap-2 px-6 py-3.5 bg-zinc-900/80 border border-blue-600/30 hover:border-blue-500 text-zinc-200 hover:text-white font-semibold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.1)] transition-all duration-300 text-sm"
          >
            <FaEnvelope className="text-blue-400 text-base" />
            <span>{isRtl ? 'اتصل بنا' : 'Contact Us'}</span>
          </Link>
        </div>

        <div className="pt-6 border-t border-blue-600/20 flex items-center justify-center gap-2 text-xs text-zinc-400">
          <span>{isRtl ? 'تحتاج مساعدة فورية؟' : 'Need instant help?'}</span>
          <a 
            href="https://wa.me/201273327311" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
          >
            <FaWhatsapp className="text-sm" />
            <span>WhatsApp Us</span>
          </a>
        </div>

      </div>
    </main>
  );
}