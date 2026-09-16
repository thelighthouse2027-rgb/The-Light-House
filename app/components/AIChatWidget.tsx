'use client';

import { useState, useEffect } from 'react';

export default function AIChatWidget() {
  const [isMounted, setIsMounted] = useState(false);

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

  // إذا لم يتم التحميل على المتصفح بعد، لا نrendered شيئاً لتجنب أي تضارب
  if (!isMounted) return null;

  return (
    <>
      <button
        id="my-chat-button"
        onClick={handleClick}
        title="Chat with us"
        aria-label="Chat with us"
        className="fixed bottom-5 right-5 z-[99999] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all duration-200 border border-blue-500 cursor-pointer flex items-center gap-2 active:scale-95 md:bottom-6 md:right-6 md:px-5 md:py-3.5 md:text-sm"
      >
        <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>Chat with us</span>
      </button>
    </>
  );
}