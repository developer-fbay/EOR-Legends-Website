/**
 * Dynamic sitemap: static pages + service/pillar/cluster/guide slugs from
 * app data + live WP content (blogs, news, case studies, glossary).
 * Cached for an hour; WP being briefly unreachable degrades to static routes.
 */
import { SERVICES } from '../../app/data/services'
import { PILLARS } from '../../app/data/staffing-insights'
import { GUIDES } from '../../app/data/guides'

const SITE = process.env.NUXT_PUBLIC_SITE_URL || 'https://legendseor.com'

const STATIC_PATHS = [
  '/',
  '/about',
  '/contact',
  '/services',
  '/case-studies',
  '/learn',
  '/blog',
  '/news',
  '/hr-glossary',
  '/staffing-insights',
  '/tools',
  '/tools/salary-benchmarking',
  '/guides',
  '/privacy-policy',
  '/modern-slavery-act',
]

export default defineCachedEventHandler(
  async (event) => {
    const urls: { loc: string; lastmod?: string }[] = STATIC_PATHS.map((p) => ({ loc: p }))

    for (const s of SERVICES) urls.push({ loc: `/services/${s.slug}` })
    for (const p of PILLARS) {
      urls.push({ loc: `/staffing-insights/${p.slug}` })
      for (const c of p.clusters) urls.push({ loc: `/staffing-insights/${p.slug}/${c.slug}` })
    }
    for (const g of GUIDES) urls.push({ loc: `/guides/${g.slug}` })

    // Live WP content — tolerate failures per type
    const WP_SECTIONS: [string, string][] = [
      ['blogs', '/blog'],
      ['news_articles', '/news'],
      ['case_studies', '/case-studies'],
      ['hr_glossary', '/hr-glossary'],
    ]
    await Promise.all(
      WP_SECTIONS.map(async ([type, prefix]) => {
        try {
          const rows = await fetchWpList(type)
          for (const r of rows) {
            urls.push({ loc: `${prefix}/${r.slug}`, lastmod: r.updated_at || r.published_at || undefined })
          }
        } catch (err: any) {
          console.error(`[sitemap] ${type} skipped:`, err?.message)
        }
      }),
    )

    const xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls
        .map((u) => {
          const lastmod = u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''
          return `  <url><loc>${SITE}${u.loc}</loc>${lastmod}</url>`
        })
        .join('\n') +
      '\n</urlset>'

    setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    return xml
  },
  { maxAge: 3600, staleMaxAge: 86400, swr: true, name: 'sitemap' },
)
