'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

export default function AIChatWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('AIChat');

  const currentLangTexts = {
    headerTitle: t('headerTitle', { defaultValue: 'Ask Guide' }),
    online: t('online', { defaultValue: 'Online' }),
    placeholder: t('placeholder', { defaultValue: 'Type a message...' }),
    buttonText: t('buttonText', { defaultValue: 'Ask Guide' }),
  };

  const excludedPaths = [
    '/services/courses',
    '/services/boat-trips',
    '/services/daily-diving',
    '/services/safari',
    '/services/specialties',
    '/services/diving-courses',
  ];

  const isExcluded = excludedPaths.some((path) => pathname?.includes(path));

  useEffect(() => {
    setIsMounted(true);

    if (document.getElementById('mojeeb-chat-widget')) return;

    const script = document.createElement('script');
    script.id = 'mojeeb-chat-widget';
    script.src = 'https://mojeebcdn.z7.web.core.windows.net/mojeeb-widget.js';
    script.setAttribute('data-widget-id', '7612d4f3-edbf-486d-be9e-f60a342adcde');
    script.setAttribute('data-mode', 'headless');
    script.setAttribute('data-config', '{}');
    script.async = true;

    document.body.appendChild(script);

    const attachWidget = () => {
      if ((window as any).MojeebWidget) {
        try {
          (window as any).MojeebWidget.attach('#my-chat-button', {});
        } catch (e) {
          console.error(e);
        }
      }
    };

    const timer = setTimeout(attachWidget, 100);
    const interval = setInterval(attachWidget, 500);

    const checkWidgetState = () => {
      const chatWindow = document.querySelector('.mojeeb-widget-window') || document.querySelector('iframe[style*="visibility: visible"]');
      if (chatWindow) {
        const style = window.getComputedStyle(chatWindow);
        if (style.display !== 'none' && style.visibility !== 'hidden') {
          setIsOpen(true);
        }
      } else {
        const activeDiv = document.querySelector('div[id*="mojeeb"] iframe');
        if (!activeDiv) {
          setIsOpen(false);
        }
      }

      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            doc.querySelectorAll('*').forEach((el) => {
              if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent?.trim();
                if (text === 'Ask Guide' || text === 'Support team') {
                  el.textContent = currentLangTexts.headerTitle;
                }
                if (text === 'Online' || text === 'We are online') {
                  el.textContent = currentLangTexts.online;
                }
              }
              const inputEl = el as HTMLInputElement;
              if (inputEl.placeholder === 'Type a message...' || inputEl.placeholder === 'Nachricht eingeben...') {
                inputEl.placeholder = currentLangTexts.placeholder;
              }
            });
          }
        } catch (err) {}
      });
    };

    const observer = new MutationObserver(checkWidgetState);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });

    const stateInterval = setInterval(checkWidgetState, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
      clearInterval(stateInterval);
      observer.disconnect();
    };
  }, [locale]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const widget = (window as any).MojeebWidget;
    
    if (widget) {
      try {
        if (typeof widget.toggle === 'function') {
          widget.toggle();
          setIsOpen((prev) => !prev);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    setIsOpen((prev) => !prev);
    const btn = document.getElementById('my-chat-button');
    if (btn) {
      btn.click();
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        iframe[src*="mojeeb"], 
        .mojeeb-widget-window,
        div[id*="mojeeb"] {
          max-width: 340px !important;
          width: 340px !important;
          max-height: 420px !important;
          border-radius: 1.2rem !important;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.7) !important;
          opacity: 1 !important;
          visibility: visible !important;
          overflow: hidden !important;
        }
        @media (max-width: 768px) {
          iframe[src*="mojeeb"], 
          .mojeeb-widget-window,
          div[id*="mojeeb"] {
            position: fixed !important;
            top: auto !important;
            bottom: 65px !important;
            right: 10px !important;
            left: 10px !important;
            width: calc(100vw - 20px) !important;
            max-width: 330px !important;
            height: 380px !important;
            max-height: 380px !important;
          }
        }
      ` }} />

      <div className="fixed bottom-4 right-4 z-[99999] flex flex-col items-end">
        
        {!isExcluded && isWhatsAppOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="bg-[#1c1c1e] text-white rounded-3xl shadow-2xl border border-gray-800 p-6 w-full max-w-sm flex flex-col items-center text-center gap-4 relative">
              
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-white tracking-wide">Select an app to open</h3>
                <p className="text-xs text-gray-400 leading-relaxed px-2">
                  To set a default app to open, go to <span className="text-blue-400 font-medium cursor-pointer">"Settings - Apps - App Cloner"</span>. <span className="text-blue-400 font-medium cursor-pointer">Settings</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 my-2 w-full px-4">
                
                {/* الرقم الأول */}
                <a
                  href="https://wa.me/201273327311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#2c2c2e] group-hover:bg-[#3a3a3c] border border-gray-700 flex items-center justify-center text-[#25D366] shadow-md transition-transform active:scale-95">
                    <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448zM12.002 2.15c-5.436 0-9.868 4.432-9.87 9.87-.001 1.87.52 3.693 1.516 5.289l-.999 3.658 3.743-.982c1.536 1.041 3.328 1.59 5.161 1.591 5.437 0 9.871-4.433 9.873-9.87.002-5.436-4.432-9.868-9.874-9.868zm5.399 12.385c-.296-.148-1.751-.864-2.021-.963-.27-.099-.467-.148-.665.148-.197.296-.767.963-.94 1.161-.173.198-.347.222-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.296-.347.444-.521.148-.174.198-.296.296-.494.099-.198.05-.37-.025-.518-.075-.148-.665-1.602-.911-2.193-.239-.572-.483-.495-.665-.505l-.568-.01c-.198 0-.518.074-.79.37-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.066 2.876 1.214 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.751-.715 1.998-1.405.247-.69.247-1.282.173-1.405-.074-.123-.272-.198-.568-.347z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-200">WhatsApp</span>
                </a>

                {/* الرقم الثاني */}
                <a
                  href="https://wa.me/201550503959"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#2c2c2e] group-hover:bg-[#3a3a3c] border border-gray-700 flex items-center justify-center text-[#25D366] shadow-md transition-transform active:scale-95 relative">
                    <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448zM12.002 2.15c-5.436 0-9.868 4.432-9.87 9.87-.001 1.87.52 3.693 1.516 5.289l-.999 3.658 3.743-.982c1.536 1.041 3.328 1.59 5.161 1.591 5.437 0 9.871-4.433 9.873-9.87.002-5.436-4.432-9.868-9.874-9.868zm5.399 12.385c-.296-.148-1.751-.864-2.021-.963-.27-.099-.467-.148-.665.148-.197.296-.767.963-.94 1.161-.173.198-.347.222-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.296-.347.444-.521.148-.174.198-.296.296-.494.099-.198.05-.37-.025-.518-.075-.148-.665-1.602-.911-2.193-.239-.572-.483-.495-.665-.505l-.568-.01c-.198 0-.518.074-.79.37-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.066 2.876 1.214 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.751-.715 1.998-1.405.247-.69.247-1.282.173-1.405-.074-.123-.272-.198-.568-.347z"/>
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-gray-200">ENG SAQR</span>
                </a>

              </div>

              <button
                onClick={() => setIsWhatsAppOpen(false)}
                className="w-full py-2.5 text-blue-500 font-semibold text-sm hover:bg-white/5 rounded-xl transition"
              >
                Cancel
              </button>

            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          
          {/* أيقونة الواتساب الدائرية */}
          {!isExcluded && (
            <button
              onClick={() => setIsWhatsAppOpen(true)}
              title="WhatsApp"
              aria-label="WhatsApp"
              className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-95 border border-green-400"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448zM12.002 2.15c-5.436 0-9.868 4.432-9.87 9.87-.001 1.87.52 3.693 1.516 5.289l-.999 3.658 3.743-.982c1.536 1.041 3.328 1.59 5.161 1.591 5.437 0 9.871-4.433 9.873-9.87.002-5.436-4.432-9.868-9.874-9.868zm5.399 12.385c-.296-.148-1.751-.864-2.021-.963-.27-.099-.467-.148-.665.148-.197.296-.767.963-.94 1.161-.173.198-.347.222-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.296-.347.444-.521.148-.174.198-.296.296-.494.099-.198.05-.37-.025-.518-.075-.148-.665-1.602-.911-2.193-.239-.572-.483-.495-.665-.505l-.568-.01c-.198 0-.518.074-.79.37-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.066 2.876 1.214 3.074.148.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.751-.715 1.998-1.405.247-.69.247-1.282.173-1.405-.074-.123-.272-.198-.568-.347z"/>
              </svg>
            </button>
          )}

          {/* أيقونة البوت (دائرية بالكامل وبها النص Ask Guide فقط بدون أي أيقونات أو أشكال) */}
          <button
            id="my-chat-button"
            onClick={handleClick}
            title={currentLangTexts.buttonText}
            aria-label={currentLangTexts.buttonText}
            className="z-[99999] w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] leading-tight text-center shadow-lg transition-all duration-300 border border-blue-500 cursor-pointer flex items-center justify-center p-1 active:scale-95"
          >
            {isOpen ? (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <span>Ask Guide</span>
            )}
          </button>

        </div>
      </div>
    </>
  );
}