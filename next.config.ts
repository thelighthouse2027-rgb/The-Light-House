import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  images: {
    qualities: [25, 50, 75, 80, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  async redirects() {
    return [
      // 1. تحويل روابط features القديمة في كل اللغات إلى مسار services الصحيح
      {
        source: '/:locale(en|de|fr|pl)/features/:slug*',
        destination: '/:locale/services/:slug*',
        permanent: true,
      },
      // 2. تحويل أي رابط features بدون لغة إلى en/services
      {
        source: '/features/:slug*',
        destination: '/en/services/:slug*',
        permanent: true,
      },
      // 3. تصحيح الصفحات الثابتة إذا تم طلبها تحت services بالخطأ
      {
        source: '/:locale(en|de|fr|pl)/services/:page(about|contact|media|search|privacy|terms|faq)',
        destination: '/:locale/:page',
        permanent: false,
      },
      // 4. تحويل روابط الكورسات والرحلات المباشرة بدون services إلى services/slug
      {
        source:
          '/:locale(en|de|fr|pl)/:slug((?!services$|about$|contact$|media$|search$|privacy$|terms$|faq$|studio$|api$|_next$|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$)[^/]+)',
        destination: '/:locale/services/:slug',
        permanent: true,
      },
      // 5. تحويل أي مسار خدمات بدون لغة إلى /en/services
      {
        source: '/services/:path*',
        destination: '/en/services/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig as any);
