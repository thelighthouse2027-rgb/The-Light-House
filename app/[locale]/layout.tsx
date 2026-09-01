import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer'; 
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
      <head>
        {/* اتصالات مسبقة ضرورية ومحدودة لتحسين أداء تحميل صور Sanity */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>
      <body className="bg-black text-white antialiased min-h-screen relative selection:bg-red-600 selection:text-white overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          
          <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden pointer-events-none bg-black">
            <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-950/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-zinc-900/30 rounded-full blur-[120px]"></div>
          </div>

          <Header locale={locale} />

          <div className="relative z-10 w-full pt-20 min-h-screen">
            {children}
          </div>

          <Footer />

          <AIChatWidget />

        </NextIntlClientProvider>
      </body>
    </html>
  );
}