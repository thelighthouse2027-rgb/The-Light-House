'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function AIChatWidget() {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations('AIChat');

  const currentLangTexts = {
    headerTitle: t('headerTitle', { defaultValue: 'Ask Guide' }),
    online: t('online', { defaultValue: 'Online' }),
    placeholder: t('placeholder', { defaultValue: 'Type a message...' }),
    buttonText: t('buttonText', { defaultValue: 'Ask Guide' }),
  };

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
        
        {/* زر البوت الأساسي فقط */}
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