'use client';
import { useEffect } from 'react';

export default function AIChatWidget() {
  useEffect(() => {
    if (document.getElementById('mojeeb-chat-widget')) return;

    // حقن السكريبت بطريقة تضمن عدم تجميد المتصفح نهائياً
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
    
    // محاولة ثانية لو لم يتم الربط بعد
    const btn = document.getElementById('my-chat-button');
    if (btn) {
      btn.click();
    }
  };

  return (
    <>
      <style jsx global>{`
        /* تنسيق نافذة الشات لتكون خفيفة وسريعة في العرض */
        iframe[src*="mojeeb"], 
        .mojeeb-widget-window,
        div[id*="mojeeb"] {
          max-width: 380px !important;
          max-height: 520px !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
          transition: transform 0.3s ease, opacity 0.3s ease !important;
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

      {/* الزر الأحمر الفخم */}
      <button
        id="my-chat-button"
        onClick={handleClick}
        className="fixed bottom-6 right-6 z-[99999] px-5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all duration-200 border border-red-500 cursor-pointer flex items-center gap-2.5 active:scale-95"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
        <span>Chat with us</span>
      </button>
    </>
  );
}