/**
 * CTA click ping — one per browser session per section (partial unique
 * index; conflicts silently ignored). Powers per-section winner selection
 * for non-form sections. Always answers ok.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { sessionId, experimentId, variantId, surface } = body || {}
    if (![sessionId, experimentId, variantId].every((v) => typeof v === 'string' && CTA_UUID_RE.test(v))) {
      return { ok: true }
    }
    if (typeof surface !== 'string' || !(CTA_SURFACES as readonly string[]).includes(surface)) {
      return { ok: true }
    }
    const cfg = await getActiveCtaConfig()
    const active = cfg.active
    if (!active || active.experimentId !== experimentId || !active.variants.some((v) => v.id === variantId)) {
      return { ok: true }
    }
    await ctaRest('cta_events', {
      method: 'POST',
      body: { experiment_id: experimentId, variant_id: variantId, session_id: sessionId, type: 'click', surface },
      headers: { Prefer: 'return=minimal' },
    })
    return { ok: true }
  } catch {
    return { ok: true }
  }
})
