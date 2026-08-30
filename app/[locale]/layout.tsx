import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/app/components/Header';
import AIChatWidget from '@/app/components/AIChatWidget';
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="bg-black text-white antialiased min-h-screen relative selection:bg-red-600 selection:text-white">
        <NextIntlClientProvider messages={messages} locale={locale}>
          
          {/* فيديو الخلفية */}
          <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden pointer-events-none">
            <video
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover scale-105"
            >
              <source src="/videos/bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/80"></div>
          </div>

          <Header locale={locale} />

          <div className="relative z-10 w-full pt-20">
            {children}
          </div>

          {/* ويدجت الذكاء الاصطناعي */}
          <AIChatWidget />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}