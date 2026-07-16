/**
 * Active CTA experiment for the public site. Never 500s: any failure returns
 * { active: null } and every button falls back to its hardcoded text.
 * Also hosts the lazy lifecycle check (no cron on DO App Platform).
 */
export default defineEventHandler(async () => {
  try {
    // fire-and-forget: throttled internally to one real run per hour
    evaluateCtaLifecycle().catch(() => {})
    return await getActiveCtaConfig()
  } catch {
    return { active: null }
  }
})
