'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// قائمة اللغات المتاحة
const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'pl', name: 'Polski' },
];

export default function Header({ locale }: { locale: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // مرجع لإغلاق قائمة اللغات عند الضغط خارجها
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 sm:px-8 pt-4 transition-all duration-500">
      <div className={`max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-500 ${
        scrolled ? 'bg-white/30 backdrop-blur-xl border border-white/50 shadow-lg' : 'bg-white/15 backdrop-blur-md border border-white/30 shadow-sm'
      }`}>
        
        {/* اللوجو */}
        <Link href={`/${locale}`}>
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain filter drop-shadow-sm hover:scale-105 transition-transform duration-300" />
        </Link>

        {/* القائمة الرئيسية (ديسكتوب فقط) - تصميم محسّن للروابط */}
        <nav className="hidden md:flex gap-8 text-white font-medium text-sm">
          <Link href={`/${locale}`} className="hover:text-red-400 transition-colors drop-shadow-sm">Home</Link>
          <Link href={`/${locale}/about`} className="text-white/90 hover:text-red-400 transition-colors drop-shadow-sm">About Us</Link>
          <Link href={`/${locale}/services`} className="text-white/90 hover:text-red-400 transition-colors drop-shadow-sm">Services</Link>
          <Link href={`/${locale}/contact`} className="text-white/90 hover:text-red-400 transition-colors drop-shadow-sm">Contact</Link>
        </nav>

        {/* الجزء الأيمن: زر اللغات + زر الهمبرجر */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* قائمة الدول (تظهر في الموبايل والديسكتوب بالخارج) */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 text-white font-semibold text-xs sm:text-sm bg-white/10 md:bg-transparent px-2.5 py-1.5 md:px-0 md:py-0 border border-white/20 md:border-none rounded-lg hover:text-red-300 hover:bg-white/20 md:hover:bg-transparent transition-colors"
            >
              <span>{currentLang.name}</span>
              <svg className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* القائمة المنسدلة للغات (شكل زجاجي أنيق) */}
            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 md:w-40 bg-white/20 backdrop-blur-2xl text-white rounded-xl shadow-2xl py-2 border border-white/40 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                {languages.map((l) => (
                  <Link 
                    key={l.code} 
                    href={`/${l.code}`} 
                    onClick={() => setLangDropdownOpen(false)}
                    className={`block px-4 py-2 text-xs md:text-sm font-medium transition-colors ${
                      locale === l.code ? 'bg-white/30 text-white font-bold' : 'text-white/90 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {l.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* زر الهمبرجر للموبايل فقط */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-white p-1 hover:text-red-400 transition-colors focus:outline-none"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> 
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل الزجاجية (تظهر فقط عند الضغط على الهمبرجر) */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 max-w-7xl mx-auto bg-white/20 backdrop-blur-2xl border border-white/40 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-5 text-center">
            <Link href={`/${locale}`} onClick={() => setMobileMenuOpen(false)} className="text-white font-semibold text-lg hover:text-red-400 transition-colors">Home</Link>
            <Link href={`/${locale}/about`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-red-400 transition-colors">About Us</Link>
            <Link href={`/${locale}/services`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-red-400 transition-colors">Services</Link>
            <Link href={`/${locale}/contact`} onClick={() => setMobileMenuOpen(false)} className="text-white/90 text-lg hover:text-red-400 transition-colors">Contact Us</Link>
          </nav>
        </div>
      )}
    </header>
  );
}