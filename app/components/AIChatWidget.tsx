'use client';
import { useEffect } from 'react';

export default function AIChatWidget() {
  useEffect(() => {
    // 1. تحميل سكريبت مجيب (مع ترك وضع default ليعمل الشات في الخلفية)
    if (document.getElementById('mojeeb-chat-widget')) return;

    const script = document.createElement('script');
    script.id = 'mojeeb-chat-widget';
    script.src = 'https://mojeebcdn.z7.web.core.windows.net/mojeeb-widget.js';
    script.setAttribute('data-widget-id', '7612d4f3-edbf-486d-be9e-f60a342adcde');
    script.setAttribute('data-mode', 'default');
    script.setAttribute('data-config', '{}');
    script.async = true;

    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById('mojeeb-chat-widget');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <>
      {/* حقن CSS صغير لإخفاء الزر الافتراضي الباهت للمنصة */}
      <style jsx global>{`
        /* إخفاء الزر الأصلي الخاص بمنصة مجيب أياً كان الـ selector الخاص به */
        #mojeeb-chat-widget-container, 
        .mojeeb-widget-button,
        iframe[src*="mojeeb"] {
          /* لو ظهر زر إضافي من المنصة نخفيه ونعتمد على زرنا الفخم */
        }
      `}</style>

      {/* زرنا الأحمر الفخم الثابت في أسفل الشاشة */}
      <button
        id="my-chat-button"
        onClick={() => {
          // محاولة استدعاء دفتح الشات البرمجية من سكربت مجيب لو وجدت
          const widgetRoot = document.querySelector('#mojeeb-chat-widget') || (window as any).MojeebWidget;
          if (widgetRoot && (window as any).MojeebWidget?.toggle) {
            (window as any).MojeebWidget.toggle();
          } else {
            // كحل بديل: الضغط على أي عنصر تحكم افتراضي قد تكون المنصة أضافته
            const defaultBtn = document.querySelector('[id*="mojeeb"]') as HTMLElement;
            if (defaultBtn) defaultBtn.click();
          }
        }}
        className="fixed bottom-6 right-6 z-[99999] px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-[0_0_25px_rgba(220,38,38,0.6)] transition-all duration-300 border border-red-500 cursor-pointer flex items-center gap-3 group"
      >
        <span className="w-3 h-3 rounded-full bg-white animate-pulse"></span>
        <span>Chat with us</span>
      </button>
    </>
  );
}