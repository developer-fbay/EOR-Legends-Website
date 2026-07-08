/** Cached pillar/cluster body extracted from the published Oxygen pages. */
export default defineCachedEventHandler(
  async (event) => {
    const slug = String(getRouterParam(event, 'slug'))
    const data = await fetchPillarBody(slug)
    if (!data) throw createError({ statusCode: 404, statusMessage: 'Not found' })
    return data
  },
  {
    maxAge: 300,
    staleMaxAge: 60 * 60 * 24,
    swr: true,
    getKey: (event) => `pillar-${getRouterParam(event, 'slug')}`,
  },
)
