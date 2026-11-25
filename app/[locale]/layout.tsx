import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer'; 
import AIChatWidget from '@/app/components/AIChatWidget';
import Script from 'next/script';
import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const domain = 'https://www.thelighthousee.com';

  return {
    title: 'The Light House | Diving & Safari Center',
    description: 'Explore and book your diving, snorkeling, and safari adventures with The Light House at Long Beach Resort, Hurghada.',
    verification: {
      google: 'uTh7j9DgOVKNqb3Iv--B4MSk3gY9u_G5XlSTZ-ArhhU',
    },
    alternates: {
      canonical: `${domain}/${locale}`,
      languages: {
        'en': `${domain}/en`,
        'de': `${domain}/de`,
        'fr': `${domain}/fr`,
        'pl': `${domain}/pl`,
      },
    },
    openGraph: {
      title: 'The Light House | Diving & Safari Center Hurghada',
      description: 'Explore and book your diving, snorkeling, and safari adventures with The Light House at Long Beach Resort, Hurghada.',
      url: `${domain}/${locale}`,
      siteName: 'The Light House Diving Center',
      images: [
        {
          url: `${domain}/images/hero-bg.jpg`,
          width: 1200,
          height: 630,
          alt: 'The Light House Diving Center',
        },
      ],
      locale: locale,
      type: 'website',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristInformationCenter',
    'name': 'The Light House Diving Center',
    'description': 'Premier diving and safari center in Hurghada offering PADI & CMAS courses, daily boat diving, snorkeling, and wreck excursions.',
    'image': 'https://www.thelighthousee.com/images/hero-bg.jpg',
    '@id': 'https://www.thelighthousee.com',
    'url': 'https://www.thelighthousee.com',
    'telephone': '+201036930803',
    'priceRange': '€€',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Sahl Hasheesh Road, Long Beach Resort',
      'addressLocality': 'Hurghada',
      'addressRegion': 'Red Sea Governorate',
      'postalCode': '84511',
      'addressCountry': 'EG',
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 27.0858,
      'longitude': 33.8647,
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '08:30',
      'closes': '17:00'
    },
    'sameAs': [
      'https://www.facebook.com/thelighthousee',
      'https://www.instagram.com/thelighthousee'
    ]
  };

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-black text-white antialiased min-h-screen relative selection:bg-red-600 selection:text-white overflow-x-hidden">
        
        {/* تحميل GTM بخاصية lazyOnload بعد رسم الشاشة وتفادي إبطاء المعالج */}
        <Script
          id="google-tag-manager"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtag/js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-T9ZSGSH4');
            `,
          }}
        />

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T9ZSGSH4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

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

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
