/**
 * Cached content list from headless WordPress.
 * SWR caching keeps the site fast and resilient if WP is slow or down.
 */
export default defineCachedEventHandler(
  async (event) => {
    const type = String(getRouterParam(event, 'type'))
    const { orderBy } = getQuery(event)
    return await fetchWpList(type, orderBy ? String(orderBy) : undefined)
  },
  {
    maxAge: 300, // fresh for 5 minutes
    staleMaxAge: 60 * 60 * 24 * 7, // serve stale up to a week while revalidating
    swr: true,
    getKey: (event) => `wp-list-${getRouterParam(event, 'type')}-${getQuery(event).orderBy ?? 'date'}`,
  },
)
