import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.thelighthousee.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/studio/'], // استبعاد مسارات الـ API ولوحة تحكم Sanity Studio من الأرشفة
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}