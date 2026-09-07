'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaWhatsapp, FaFacebookF, FaYoutube } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'pl', name: 'Polski' },
];

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('Header');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <header className="absolute top-0 left-0 w-full z-50 px-4 sm:px-8 pt-4">
      {/* هيدر متحرك مع السكرول غير ثابت */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-black/90 backdrop-blur-2xl border-2 border-blue-600/40 shadow-[0_10px_30px_rgba(37,99,235,0.2)]">
        
        {/* اللوجو مع الإضاءة الزرقاء القوية الملتصقة بالحواف */}
        <Link href={`/${locale}`} className="py-1 inline-block" aria-label="The Light House Home">
          <Image 
            src="/logoo.webp" 
            alt="The Light House Logo" 
            width={96}
            height={96}
            priority
            className="h-24 w-24 object-contain filter drop-shadow-[0_0_22px_rgba(0,149,255,0.9)] hover:scale-105 transition-transform duration-300" 
          />
        </Link>

        {/* القائمة الرئيسية - الديسكتوب */}
        <nav className="hidden lg:flex items-center gap-8 text-white font-medium text-sm">
          <Link href={`/${locale}`} className="hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">{t('home')}</Link>
          <Link href={`/${locale}/about`} className="text-white/90 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">{t('about')}</Link>
          <Link href={`/${locale}/services`} className="text-white/90 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">{t('services')}</Link>
          <Link href={`/${locale}/search`} className="text-white/90 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">{t('exploreAndBook')}</Link>
          <Link href={`/${locale}/contact`} className="text-white/90 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">{t('contact')}</Link>
        </nav>

        <div className="flex items-center gap-4 md:gap-5">
          
          {/* روابط السوشيال ميديا - ديسكتوب */}
          <div className="hidden md:flex items-center gap-3">
            <a href="https://wa.me/201273327311" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-zinc-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">
              <FaWhatsapp className="text-lg" aria-hidden="true" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-zinc-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">
              <FaFacebookF className="text-md" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@TheLightHouse-v8b" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-zinc-300 hover:text-blue-400 hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all">
              <FaYoutube className="text-lg" aria-hidden="true" />
            </a>
          </div>

          <div className="hidden md:block w-px h-5 bg-blue-600/50"></div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              aria-label="Select Language"
              className="flex items-center gap-1 text-white font-semibold text-xs sm:text-sm bg-blue-600/20 border border-blue-500 px-3 py-2 rounded-xl hover:bg-blue-600/30 hover:border-blue-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <span>{currentLang.name}</span>
              <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-black/95 backdrop-blur-2xl text-white rounded-xl shadow-[0_10px_30px_rgba(37,99,235,0.5)] py-2 border border-blue-600 z-50">
                {languages.map((l) => (
                  <Link 
                    key={l.code} 
                    href={`/${l.code}`} 
                    onClick={() => setLangDropdownOpen(false)}
                    className={`block px-4 py-2 text-xs md:text-sm font-medium transition-colors ${
                      locale === l.code ? 'bg-blue-600 text-white font-bold' : 'text-zinc-300 hover:bg-blue-950/50 hover:text-blue-400'
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden text-white p-1 hover:text-blue-400 transition-colors focus:outline-none cursor-pointer drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 max-w-7xl mx-auto bg-black/95 backdrop-blur-2xl border border-blue-600 rounded-2xl p-6 shadow-[0_10px_40px_rgba(37,99,235,0.5)]">
          <nav className="flex flex-col gap-5 text-center">
            <Link href={`/${locale}`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-blue-400 transition-colors drop-shadow-md">{t('home')}</Link>
            <Link href={`/${locale}/about`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-blue-400 transition-colors drop-shadow-md">{t('about')}</Link>
            <Link href={`/${locale}/services`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-blue-400 transition-colors drop-shadow-md">{t('services')}</Link>
            <Link href={`/${locale}/search`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-blue-400 transition-colors drop-shadow-md">{t('exploreAndBook')}</Link>
            <Link href={`/${locale}/contact`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-blue-400 transition-colors drop-shadow-md">{t('contact')}</Link>
          </nav>
          
          {/* روابط السوشيال ميديا - موبايل */}
          <div className="mt-6 pt-6 border-t border-blue-600/40 flex justify-center gap-6">
            <a href="https://wa.me/201273327311" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="p-3 bg-blue-600/10 border border-blue-500 text-white hover:bg-blue-600 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <FaWhatsapp className="text-xl" aria-hidden="true" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-3 bg-blue-600/10 border border-blue-500 text-white hover:bg-blue-600 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <FaFacebookF className="text-lg" aria-hidden="true" />
            </a>
            <a href="https://www.youtube.com/@TheLightHouse-v8b" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="p-3 bg-blue-600/10 border border-blue-500 text-white hover:bg-blue-600 rounded-xl transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <FaYoutube className="text-xl" aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}