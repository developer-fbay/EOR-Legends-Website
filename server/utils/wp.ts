/**
 * Headless WordPress content layer. WP is the single source of truth for
 * blogs, news articles, case studies and the HR glossary; Gravity Forms and
 * the media library stay on WP too.
 *
 * - Lists + bodies: WP REST API
 * - FAQs + case-study structure: ACF fields ("Show in REST API" enabled)
 * - SEO: Rank Math headless endpoint (/rankmath/v1/getHead)
 */

const WP_BASE = 'https://legendseor.com'
const WP_API = `${WP_BASE}/wp-json/wp/v2`

/** Internal content-type names (unchanged from the Supabase era) → WP REST bases. */
export const WP_TYPE_MAP: Record<string, string> = {
  blogs: 'posts',
  news_articles: 'news-article',
  case_studies: 'case-study',
  hr_glossary: 'hr-glossary',
}

export type WpContentRow = {
  id: number
  title: string
  slug: string
  body: string | null
  excerpt: string | null
  featured_image: string | null
  status: string
  meta_title: string | null
  meta_description: string | null
  noindex: boolean
  published_at: string | null
  link?: string
  caseStudy?: {
    heroText: string
    videoId: string | null
    logoUrl: string | null
    industry: string
    service: string
    location: string
    problem: string
    solution: string
    servicesIncluded: string[]
    results: { label: string; text: string }[]
  }
}

function stripHtml(s: string) {
  return (s || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#8211;/g, '–')
    .replace(/&hellip;|\[&hellip;\]|\[…\]/g, '…')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mapItem(p: any): WpContentRow {
  // Prefer WP's pre-generated "large" rendition (~1024px) over the full-size
  // original — archive cards don't need 2560px Shutterstock scans.
  const media = p._embedded?.['wp:featuredmedia']?.[0]
  const sizes = media?.media_details?.sizes
  const featured =
    sizes?.large?.source_url || sizes?.medium_large?.source_url || media?.source_url || null

  return {
    id: p.id,
    title: stripHtml(p.title?.rendered || ''),
    slug: p.slug,
    body: p.content?.rendered ?? null,
    excerpt: stripHtml(p.excerpt?.rendered || '').slice(0, 400) || null,
    featured_image: featured,
    status: 'published',
    meta_title: null,
    meta_description: null,
    noindex: false,
    published_at: p.date ? new Date(p.date).toISOString() : null,
    link: p.link,
  }
}

export async function fetchWpList(type: string, orderBy?: string): Promise<WpContentRow[]> {
  const rest = WP_TYPE_MAP[type]
  if (!rest) return []
  const order = orderBy === 'title' ? '&orderby=title&order=asc' : '&orderby=date&order=desc'
  const items: WpContentRow[] = []
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(
      `${WP_API}/${rest}?per_page=50&page=${page}&status=publish&_embed=wp:featuredmedia` +
        `&_fields=id,slug,title,excerpt,date,link,_links,_embedded${order}`,
    )
    if (!res.ok) break
    const batch: any[] = await res.json()
    items.push(...batch.map(mapItem))
    if (page >= Number(res.headers.get('x-wp-totalpages') || 1)) break
  }
  return items
}

/** FAQ pairs from ACF fields (keys like blogs_faq_1 / blogs_faq_a_1, any prefix). */
function extractAcfFaqs(acf: Record<string, any> | undefined): { q: string; a: string }[] {
  if (!acf) return []
  const faqs: { q: string; a: string }[] = []
  for (const [key, value] of Object.entries(acf)) {
    const m = key.match(/^(.*faq)_(\d+)$/)
    if (!m || !value || typeof value !== 'string') continue
    const answer = acf[`${m[1]}_a_${m[2]}`]
    if (answer && typeof answer === 'string') {
      faqs.push({ q: value.trim(), a: answer.trim() })
    }
  }
  return faqs
}

/** SEO fields via the Rank Math headless endpoint. */
async function fetchRankMathSeo(link: string) {
  try {
    const res = await fetch(`${WP_BASE}/wp-json/rankmath/v1/getHead?url=${encodeURIComponent(link)}`)
    if (!res.ok) return {}
    const { head } = (await res.json()) as { head?: string }
    if (!head) return {}
    const title = (head.match(/<title>([\s\S]*?)<\/title>/) || [])[1]
    const desc = (head.match(/<meta name="description" content="([^"]*)"/) || [])[1]
    const robots = (head.match(/<meta name="robots" content="([^"]*)"/) || [])[1] || ''
    return {
      // strip WP's own site suffix — the Nuxt titleTemplate re-appends it
      meta_title: title ? stripHtml(title).replace(/\s*[-|–]\s*Legends EOR\s*$/i, '') : null,
      meta_description: desc ? stripHtml(desc) : null,
      noindex: /noindex/i.test(robots),
    }
  } catch {
    return {}
  }
}

/** Resolve an ACF media ID to its URL (tiny in-memory cache). */
const mediaCache = new Map<number, string | null>()
async function resolveMediaUrl(id: number): Promise<string | null> {
  if (!id) return null
  if (mediaCache.has(id)) return mediaCache.get(id)!
  try {
    const res = await fetch(`${WP_API}/media/${id}?_fields=source_url`)
    const url = res.ok ? ((await res.json()) as any).source_url ?? null : null
    mediaCache.set(id, url)
    return url
  } catch {
    return null
  }
}

/** Structured case-study fields from ACF. */
async function buildCaseStudy(acf: Record<string, any>): Promise<WpContentRow['caseStudy']> {
  const videoId =
    (String(acf.case_study_video_link || '').match(/(?:v=|youtu\.be\/|embed\/)([A-Za-z0-9_-]{6,})/) || [])[1] || null
  const servicesIncluded = [...String(acf.case_study_service_included || '').matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
    .map((m) => stripHtml(m[1]!))
    .filter(Boolean)
  const results: { label: string; text: string }[] = []
  for (const n of ['', '_2', '_3']) {
    const label = stripHtml(acf[`case_study_results_heading${n}`] || '').replace(/:$/, '')
    const text = stripHtml(acf[`case_study_results_text${n}`] || '')
    if (label && text) results.push({ label, text })
  }
  return {
    heroText: stripHtml(acf.case_study_hero_text || ''),
    videoId,
    logoUrl: await resolveMediaUrl(Number(acf.case_study_hero_logo)),
    industry: stripHtml(acf.case_study_industry || ''),
    service: stripHtml(acf.case_study_service || ''),
    location: stripHtml(acf.case_study_location || ''),
    problem: stripHtml(acf.case_study_problem || ''),
    solution: stripHtml(acf.case_study_solution || ''),
    servicesIncluded,
    results,
  }
}

export async function fetchWpSingle(type: string, slug: string): Promise<WpContentRow | null> {
  const rest = WP_TYPE_MAP[type]
  if (!rest) return null
  const res = await fetch(
    `${WP_API}/${rest}?slug=${encodeURIComponent(slug)}&status=publish&_embed=wp:featuredmedia`,
  )
  if (!res.ok) return null
  const items: any[] = await res.json()
  if (!items.length) return null
  const row = mapItem(items[0])
  row.body = items[0].content?.rendered ?? ''

  // FAQs from ACF (appended as a comment — the article template parses it out)
  const faqs = extractAcfFaqs(items[0].acf)
  if (faqs.length) {
    row.body = `${row.body}\n<!--FAQS:${JSON.stringify(faqs)}-->`
  }

  // Structured case-study fields
  if (type === 'case_studies' && items[0].acf) {
    row.caseStudy = await buildCaseStudy(items[0].acf)
  }

  // SEO from Rank Math
  if (row.link) {
    Object.assign(row, await fetchRankMathSeo(row.link))
  }
  return row
}
