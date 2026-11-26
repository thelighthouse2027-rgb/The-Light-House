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
      // 1. أي رابط قديم فيه features يتحول فوراً لصفحة الخدمات الرئيسية لكل لغة
      {
        source: '/:locale(en|de|fr|pl)/features/:slug*',
        destination: '/:locale/services',
        permanent: true,
      },
      {
        source: '/features/:slug*',
        destination: '/en/services',
        permanent: true,
      },

      // 2. تحويل الروابط القديمة المحددة اللي جوجل ماسك فيها لصفحة الخدمات
      {
        source: '/:locale(en|de|fr|pl)/:slug(coral-reefs|underwater-photography|night-diving|diving-experience|wreck-diving|snorkeling|hurghada-giftun-islands|vip-dolphin|5-days-diving-10-dives|padi-open-water-referral|underwater-navigator-specialty|peak-performance-buoyancy-specialty)',
        destination: '/:locale/services',
        permanent: true,
      },

      // 3. تصحيح الصفحات الثابتة لو اتطلبت غلط تحت services
      {
        source: '/:locale(en|de|fr|pl)/services/:page(about|contact|media|search|privacy|terms|faq)',
        destination: '/:locale/:page',
        permanent: false,
      },

      // 4. تحويل أي رابط خدمات بدون لغة إلى الإنجليزية
      {
        source: '/services/:path*',
        destination: '/en/services/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig as any);
