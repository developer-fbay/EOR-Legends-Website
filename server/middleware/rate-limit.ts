/**
 * In-memory sliding-window rate limiter (per IP, per minute).
 *   POST/PUT/DELETE /api/*  → 10/min  (form abuse, brute force)
 *   GET /api/*              → 120/min (scraping floods)
 * Network-level DDoS protection belongs in front of the app (Cloudflare or
 * the DigitalOcean load balancer/firewall) — this guards the app itself.
 * Single-instance in-memory state is correct for a single DO droplet/app;
 * if the site ever scales horizontally, move the buckets to Redis.
 */
type Bucket = { count: number; reset: number }
const buckets = new Map<string, Bucket>()
const WINDOW_MS = 60_000

const RULES = [
  { key: 'api-write', limit: 10, match: (p: string, m: string) => p.startsWith('/api/') && m !== 'GET' && m !== 'HEAD' },
  { key: 'api-read', limit: 120, match: (p: string, m: string) => p.startsWith('/api/') && (m === 'GET' || m === 'HEAD') },
]

let lastSweep = 0
function sweep(now: number) {
  if (now - lastSweep < WINDOW_MS) return
  lastSweep = now
  for (const [k, b] of buckets) if (b.reset <= now) buckets.delete(k)
}

export default defineEventHandler((event) => {
  const path = event.path || ''
  if (!path.startsWith('/api/')) return

  const method = event.method || 'GET'
  const rule = RULES.find((r) => r.match(path, method))
  if (!rule) return

  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const now = Date.now()
  sweep(now)

  const key = `${rule.key}:${ip}`
  const bucket = buckets.get(key)
  if (!bucket || bucket.reset <= now) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS })
    return
  }
  bucket.count++
  if (bucket.count > rule.limit) {
    setResponseHeader(event, 'Retry-After', String(Math.ceil((bucket.reset - now) / 1000)))
    throw createError({ statusCode: 429, statusMessage: 'Too many requests' })
  }
})
