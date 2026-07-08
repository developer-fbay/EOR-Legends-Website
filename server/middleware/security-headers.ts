/** Security headers on every response. */
const HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  // Effective only over HTTPS (which DO/Cloudflare terminates); harmless locally.
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-DNS-Prefetch-Control': 'off',
}

export default defineEventHandler((event) => {
  for (const [k, v] of Object.entries(HEADERS)) setResponseHeader(event, k, v)
})
