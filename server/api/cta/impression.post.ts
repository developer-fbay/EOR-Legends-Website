/**
 * Impression ping — one per browser session per experiment (enforced by a
 * partial unique index; conflicts are silently ignored). Fired client-side
 * only, so JS-less bots never count. Always answers ok.
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { sessionId, experimentId, variantId } = body || {}
    if (![sessionId, experimentId, variantId].every((v) => typeof v === 'string' && CTA_UUID_RE.test(v))) {
      return { ok: true }
    }
    // validate against the cached active experiment — no extra DB read
    const cfg = await getActiveCtaConfig()
    const active = cfg.active
    if (!active || active.experimentId !== experimentId || !active.variants.some((v) => v.id === variantId)) {
      return { ok: true }
    }
    await ctaRest('cta_events', {
      method: 'POST',
      body: { experiment_id: experimentId, variant_id: variantId, session_id: sessionId, type: 'impression' },
      headers: { Prefer: 'return=minimal' },
    })
    return { ok: true }
  } catch {
    return { ok: true }
  }
})
