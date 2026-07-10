/**
 * Cache pre-warmer. The WordPress backend takes 1.5–3s per request, so the
 * first visitor to any post/term/article pays that cost. This walks every
 * content list and single shortly after boot (throttled), so the SWR cache is
 * populated before real traffic hits it — after this, every content request
 * is served from cache instantly and refreshed in the background.
 * Re-runs every 6 hours as a safety net; SWR handles freshness in between.
 */
const CONTENT_TYPES = ['blogs', 'news_articles', 'case_studies', 'hr_glossary']
const PILLAR_SLUGS = [
  'true-cost-of-an-employee-in-the-uk',
  'permanent-establishment-guide',
  'employee-on-costs',
  'what-is-an-employer-of-record',
]
const THROTTLE_MS = 150

export default defineNitroPlugin(() => {
  if (process.env.PREWARM === 'off' || process.env.NODE_ENV === 'development') return

  async function warm() {
    const t0 = Date.now()
    let warmed = 0
    for (const type of CONTENT_TYPES) {
      try {
        const rows = await $fetch<{ slug: string }[]>(`/api/content/${type}`)
        for (const row of rows) {
          try {
            await $fetch(`/api/content/${type}/${row.slug}`)
            warmed++
          } catch {
            /* 404s etc. — skip */
          }
          await new Promise((r) => setTimeout(r, THROTTLE_MS))
        }
      } catch (err: any) {
        console.error(`[prewarm] list ${type} failed:`, err?.message)
      }
    }
    for (const slug of PILLAR_SLUGS) {
      await $fetch(`/api/pillar/${slug}`).catch(() => {})
    }
    await $fetch('/sitemap.xml').catch(() => {})
    console.log(`[prewarm] ${warmed} entries warmed in ${Math.round((Date.now() - t0) / 1000)}s`)
  }

  // let the server start serving traffic first
  setTimeout(warm, 5_000)
  setInterval(warm, 6 * 60 * 60 * 1000)
})
