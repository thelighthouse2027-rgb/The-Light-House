'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; 

export default function AIChatWidget() {
    useEffect(() => {
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

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

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

  return (
    <>
      <style jsx global>{`
        iframe[src*="mojeeb"], 
        .mojeeb-widget-window,
        div[id*="mojeeb"] {
          max-width: 380px !important;
          max-height: 520px !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
          opacity: 1 !important;
          visibility: visible !important;
          transition: none !important;
        }
        @media (max-width: 768px) {
          iframe[src*="mojeeb"], 
          .mojeeb-widget-window,
          div[id*="mojeeb"] {
            width: calc(100vw - 32px) !important;
            height: 450px !important;
            bottom: 80px !important;
            right: 16px !important;
          }
        }
      `}</style>

      <button
        id="my-chat-button"
        onClick={handleClick}
        title="Chat with us"
        aria-label="Chat with us"
        className="fixed bottom-6 right-6 z-[99999] px-5 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl shadow-[0_0_25px_rgba(37,99,235,0.6)] transition-all duration-200 border border-blue-500 cursor-pointer flex items-center gap-2.5 active:scale-95"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
        <span>Chat with us</span>
      </button>
    </>
  );
}