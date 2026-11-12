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
      {
        source: '/:locale(en|de|fr|pl)/:slug((?!services).+)',
        destination: '/:locale/services/:slug',
        permanent: true,
      },
            {
        source: '/services/:path*',
        destination: '/en/services/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig as any);