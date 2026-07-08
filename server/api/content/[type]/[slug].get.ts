/**
 * Cached single article from headless WordPress (body + FAQs + SEO fields).
 */
export default defineCachedEventHandler(
  async (event) => {
    const type = String(getRouterParam(event, 'type'))
    const slug = String(getRouterParam(event, 'slug'))
    const row = await fetchWpSingle(type, slug)
    if (!row) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return row
  },
  {
    maxAge: 300,
    staleMaxAge: 60 * 60 * 24,
    swr: true,
    getKey: (event) => `wp-single-${getRouterParam(event, 'type')}-${getRouterParam(event, 'slug')}`,
  },
)
