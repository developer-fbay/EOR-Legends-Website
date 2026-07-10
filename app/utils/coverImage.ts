/**
 * Designer cover pool for blog + staffing-insights imagery.
 * Deterministic "random" pick: the slug always maps to the same cover, so
 * server and client render identically and a post keeps its image between
 * visits, while the set looks varied across cards.
 */
const POOL_SIZE = 33

export function coverFor(slug: string): string {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  const n = (h % POOL_SIZE) + 1
  return `/assets/covers/cover-${String(n).padStart(2, '0')}.webp`
}
