import { MetadataRoute } from 'next'
import { client } from '@/sanity/lib/client' 

const languages = ['en', 'fr', 'de', 'pl']
const baseUrl = 'https://www.thelighthousee.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = []

  const staticRoutes = [
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

  try {
    const sanityPages = await client.fetch(`
      *[_type == "post"] {
        "slug": slug.current,
        _updatedAt
      }
    `)

    sanityPages.forEach((page: { slug: string; _updatedAt: string }) => {
      if (!page.slug) return

      languages.forEach((lang) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/blog/${page.slug}`, // عدل مسار /blog/ إذا كان مختلفاً في موقعك
          lastModified: page._updatedAt ? new Date(page._updatedAt) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    })
  } catch (error) {
    console.error('Error fetching Sanity data for sitemap:', error)
  }

  return sitemapEntries
}