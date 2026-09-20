'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function AIChatWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('AIChat');

  const currentLangTexts = {
    headerTitle: t('headerTitle', { defaultValue: 'Ask Guide' }),
    online: t('online', { defaultValue: 'Online' }),
    placeholder: t('placeholder', { defaultValue: 'Type a message...' }),
    buttonText: t('buttonText', { defaultValue: 'Ask Guide' }),
    selectApp: t('selectApp', { defaultValue: 'Select an app to open' }),
    settingsText: t('settingsText', { defaultValue: 'Settings' }),
    cancelText: t('cancelText', { defaultValue: 'Cancel' }),
  };

  const whatsappNumbers = [
    { label: 'WhatsApp', number: '201273327311', isCloned: false },
    { label: 'ENG SAQR', number: '201550503959', isCloned: true },
  ];

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

      <div className="fixed bottom-4 right-4 z-[99999] flex items-center gap-3">
        
        {/* نافذة اختيار التطبيق للواتساب */}
        {isWhatsAppOpen && (
          <div className="absolute bottom-16 right-0 bg-[#1e1e1e] border border-zinc-800 rounded-3xl shadow-2xl p-6 w-80 text-white flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-base font-medium text-zinc-100 mb-2">{currentLangTexts.selectApp}</h3>
            <p className="text-[11px] text-zinc-400 mb-6 leading-relaxed">
              To set a default app to open, go to "Settings - Apps - App Cloner". <span className="text-blue-400 cursor-pointer">{currentLangTexts.settingsText}</span>
            </p>

            <div className="flex items-center justify-center gap-8 mb-6 w-full">
              {whatsappNumbers.map((item, index) => (
                <a
                  key={index}
                  href={`https://wa.me/${item.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 group cursor-pointer"
                >
                  <div className="relative w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:border-emerald-500 shadow-md transition-all">
                    <svg className="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    {item.isCloned && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-md border border-zinc-900 flex items-center justify-center text-[8px]">
                        📁
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-zinc-300">{item.label}</span>
                </a>
              ))}
            </div>

            <button 
              onClick={() => setIsWhatsAppOpen(false)}
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold cursor-pointer mt-2"
            >
              {currentLangTexts.cancelText}
            </button>
          </div>
        )}

        {/* زر الواتساب */}
        <button
          onClick={() => setIsWhatsAppOpen(!isWhatsAppOpen)}
          title="WhatsApp"
          aria-label="WhatsApp"
          className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95 border border-emerald-500 shrink-0"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        </button>

        {/* زر البوت الأساسي */}
        <button
          id="my-chat-button"
          onClick={handleClick}
          title={currentLangTexts.buttonText}
          aria-label={currentLangTexts.buttonText}
          className={`z-[99999] bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg transition-all duration-300 border border-blue-500 cursor-pointer flex items-center justify-center active:scale-95 ${
            isOpen 
              ? 'w-11 h-11 rounded-full p-0' 
              : 'px-3.5 py-2.5 text-xs rounded-2xl gap-2 w-max h-12'
          }`}
        >
          {isOpen ? (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <span className="text-amber-300 text-sm">✨</span>
              <span>{currentLangTexts.buttonText}</span>
            </>
          )}
        </button>

      </div>
    </>
  );
}