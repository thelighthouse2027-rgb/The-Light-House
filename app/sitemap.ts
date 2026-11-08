// app/sitemap.ts
import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client' 

const languages = ['en', 'fr', 'de', 'pl']
const baseUrl = 'https://www.thelighthousee.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 1. الصفحات الثابتة والـ Features (شاملة الصفحة الرئيسية لكل لغة '')
  const staticRoutes = [
    '', 
    '/about',
    '/services',
    '/media',
    '/contact',
    '/features/underwater-photography',
    '/features/wreck-diving',
    '/features/snorkeling',
    '/features/night-diving',
    '/features/coral-reefs',
    '/features/diving-experience',
  ]

  staticRoutes.forEach((route) => {
    languages.forEach((lang) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      })
    })
  })

  // 2. جلب جميع الصفحات ديناميكياً من Sanity (من نوع flexiblePage)
  try {
    const sanityPages = await client.fetch(`
      *[_type == "flexiblePage" && defined(slug.current)] {
        "slug": slug.current,
        _updatedAt
      }
    `)

    sanityPages.forEach((page: { slug: string; _updatedAt: string }) => {
      // إذا كانت الصفحة الرئيسية تم إنشاؤها في سانتي ولها slug فارغ أو '/', نتجنب تكرارها
      if (!page.slug || page.slug === '/') return

      languages.forEach((lang) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/${page.slug}`, // الرابط المباشر لكل صفحة مرنة بكل لغة
          lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      })
    })
  } catch (error) {
    console.error('Error fetching Sanity pages for sitemap:', error)
  }

  return sitemapEntries
}