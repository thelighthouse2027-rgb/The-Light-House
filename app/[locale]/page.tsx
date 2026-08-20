import Hero from '../components/Hero';
import Features from '../components/Features';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <main className="relative min-h-screen">
        
        {/* خلفية الفيديو الثابتة ورا الموقع كله */}
        <div className="fixed top-0 left-0 w-full h-full z-[-1] overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105" 
          >
            <source src="/videos/bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"></div>
        </div>

        {/* محتوى الموقع */}
        <div className="relative z-10 w-full">
          <div className="pt-2 md:pt-4 pb-10 px-2 md:px-6">
            <Hero />
          </div>
          
          <div className="w-full pb-20">
            <Features />
          </div>
        </div>

      </main>
    </NextIntlClientProvider>
  );
}