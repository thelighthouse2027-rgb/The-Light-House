import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client'

const languages = ['en', 'de', 'fr', 'pl']
const baseUrl = 'https://www.thelighthousee.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = []

  // 1. الصفحات الثابتة
  const staticRoutes = [
    { path: '', changeFreq: 'daily' as const, priority: 1.0 },
    { path: '/about', changeFreq: 'weekly' as const, priority: 0.8 },
    { path: '/services', changeFreq: 'daily' as const, priority: 0.9 },
    { path: '/media', changeFreq: 'weekly' as const, priority: 0.7 },
    { path: '/contact', changeFreq: 'weekly' as const, priority: 0.8 },
    { path: '/features/underwater-photography', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/features/wreck-diving', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/features/snorkeling', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/features/night-diving', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/features/coral-reefs', changeFreq: 'monthly' as const, priority: 0.7 },
    { path: '/features/diving-experience', changeFreq: 'monthly' as const, priority: 0.7 },
  ]

  // بناء روابط اللغات للصفحات الثابتة
  staticRoutes.forEach((route) => {
    languages.forEach((lang) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFreq,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            languages.map((l) => [l, `${baseUrl}/${l}${route.path}`])
          ),
        },
      })
    })
  })

  // 2. جلب صفحات الخدمات من Sanity (الصفحات النشطة فقط وبالمسار السليم)
  try {
    const sanityPages = await client.fetch(`
      *[_type == "flexiblePage" && defined(slug.current) && isActive != false] {
        "slug": slug.current,
        _updatedAt
      }
    `)

    sanityPages.forEach((page: { slug: string; _updatedAt: string }) => {
      const cleanSlug = page.slug?.trim()
      if (!cleanSlug || cleanSlug === '/') return

      const servicePath = `/services/${cleanSlug}`

      languages.forEach((lang) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}${servicePath}`,
          lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.85,
          alternates: {
            languages: Object.fromEntries(
              languages.map((l) => [l, `${baseUrl}/${l}${servicePath}`])
            ),
          },
        })
      })
    })
  } catch (error) {
    console.error('Error fetching Sanity pages for sitemap:', error)
  }

  return sitemapEntries
}
