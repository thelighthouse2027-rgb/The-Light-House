'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function AIChatWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations('AIChat');

  // الترجمات الخاصة بالنصوص الداخلية للبوت
  const chatTranslations: Record<string, { headerTitle: string; online: string; placeholder: string }> = {
    de: { headerTitle: 'Chatten Sie mit uns', online: 'Online', placeholder: 'Nachricht eingeben...' },
    fr: { headerTitle: 'Discutez avec nous', online: 'En ligne', placeholder: 'Tapez un message...' },
    pl: { headerTitle: 'Napisz do nas', online: 'Dostępny', placeholder: 'Wpisz wiadomość...' },
    en: { headerTitle: 'Chat with us', online: 'Online', placeholder: 'Type a message...' },
  };

  const currentLangTexts = chatTranslations[locale] || chatTranslations.en;

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

    // مراقبة وتحديث النصوص داخل الـ iframe الخاص بالبوت عند فتحه
    const observer = new MutationObserver(() => {
      const iframes = document.querySelectorAll('iframe');
      iframes.forEach((iframe) => {
        try {
          const doc = iframe.contentDocument || iframe.contentWindow?.document;
          if (doc) {
            // ترجمة العناصر الداخلية لو وجدت
            doc.querySelectorAll('*').forEach((el) => {
              if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent?.trim();
                if (text === 'Chat with us' || text === 'Support team') {
                  el.textContent = currentLangTexts.headerTitle;
                }
                if (text === 'Online' || text === 'We are online') {
                  el.textContent = currentLangTexts.online;
                }
              }
              if ((el as HTMLInputElement).placeholder === 'Type a message...') {
                (el as HTMLInputElement).placeholder = currentLangTexts.placeholder;
              }
            });
          }
        } catch (err) {
          // تجاوز أخطاء الأمان الخاصة بالـ cross-origin للـ iframes لو وجدت
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
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
          return;
        }
        if (typeof widget.open === 'function') {
          widget.open();
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    const btn = document.getElementById('my-chat-button');
    if (btn) {
      btn.click();
    }
  };

  if (!isMounted) return null;

  const buttonText = t('buttonText');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        iframe[src*="mojeeb"], 
        .mojeeb-widget-window,
        div[id*="mojeeb"] {
          max-width: 360px !important;
          width: 360px !important;
          max-height: 480px !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8) !important;
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
            bottom: 75px !important;
            right: 12px !important;
            left: 12px !important;
            width: calc(100vw - 24px) !important;
            max-width: 360px !important;
            height: 410px !important;
            max-height: 410px !important;
          }
        }
      ` }} />

      <button
        id="my-chat-button"
        onClick={handleClick}
        title={buttonText}
        aria-label={buttonText}
        className="fixed bottom-5 right-5 z-[99999] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-200 border border-blue-500 cursor-pointer flex items-center gap-2 active:scale-95 md:bottom-6 md:right-6 md:px-5 md:py-3.5 md:text-sm"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>{buttonText}</span>
      </button>
    </>
  );
}