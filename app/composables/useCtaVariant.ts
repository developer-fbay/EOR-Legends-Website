/**
 * CTA A/B rotation — client side.
 *
 * The default layout fetches /api/cta/config once per request into the
 * 'cta-active' state; every CTA surface calls useCtaVariant() and renders
 * ctaText(fallback). Assignment is a weighted random pick stored in a
 * cookie during SSR, so the correct text is in the first HTML response
 * (no flash, no hydration mismatch). When anything is missing — no
 * experiment, Supabase down, cookies blocked — every button shows its
 * hardcoded fallback text.
 */

export type CtaActiveConfig = {
  experimentId: string
  month: string
  phase: string
  variants: { id: string; text: string; weight: number }[]
}

export function useCtaVariant() {
  const config = useState<CtaActiveConfig | null>('cta-active', () => null)
  const overrides = useState<Record<string, string>>('cta-overrides', () => ({}))
  const cookie = useCookie<{ e: string; v: string } | null>('cta_ab', {
    maxAge: 60 * 60 * 24 * 180,
    sameSite: 'lax',
    path: '/',
  })

  // (Re)assign when there is an active experiment and the cookie doesn't
  // match it (first visit, new experiment, or a deleted variant).
  const active = config.value
  if (active && active.variants.length) {
    const ok =
      cookie.value &&
      cookie.value.e === active.experimentId &&
      active.variants.some((v) => v.id === cookie.value!.v)
    if (!ok) {
      const total = active.variants.reduce((s, v) => s + (Number(v.weight) || 0), 0)
      let pick = active.variants[0]!
      if (total > 0) {
        let r = Math.random() * total
        for (const v of active.variants) {
          r -= Number(v.weight) || 0
          if (r <= 0) {
            pick = v
            break
          }
        }
      }
      cookie.value = { e: active.experimentId, v: pick.id }
    }
  }

  const experimentId = computed(() => {
    const a = config.value
    return a && cookie.value?.e === a.experimentId ? a.experimentId : null
  })
  const variantId = computed(() => {
    const a = config.value
    if (!a || cookie.value?.e !== a.experimentId) return null
    const v = a.variants.find((x) => x.id === cookie.value!.v)
    return v ? v.id : null
  })

  const route = useRoute()

  /**
   * Resolution order (dashboard-controlled, most specific wins):
   *   1. page-scoped rule for this surface ('surface@/current/path')
   *   2. site-wide section rule ('surface')
   *   3. the visitor's experiment variant
   *   4. the surface's own hardcoded fallback
   * Overridden buttons don't rotate.
   */
  function ctaText(fallback: string, surface?: string): string {
    if (surface) {
      const path = route.path.length > 1 ? route.path.replace(/\/+$/, '') : route.path
      const pageRule = overrides.value[`${surface}@${path}`]
      if (pageRule) return pageRule
      if (overrides.value[surface]) return overrides.value[surface]!
    }
    const a = config.value
    if (!a || cookie.value?.e !== a.experimentId) return fallback
    const v = a.variants.find((x) => x.id === cookie.value!.v)
    return v?.text || fallback
  }

  /** Anonymous per-browser-session id (client only). */
  function sessionId(): string | null {
    if (import.meta.server) return null
    try {
      let id = sessionStorage.getItem('cta_sid')
      if (!id) {
        id = crypto.randomUUID()
        sessionStorage.setItem('cta_sid', id)
      }
      return id
    } catch {
      return null
    }
  }

  /** CTA click ping — once per session per section; powers per-section winners. */
  function trackClick(surface: string) {
    if (import.meta.server) return
    const a = config.value
    const sid = sessionId()
    if (!a || !sid || !variantId.value) return
    try {
      const flag = `cta_clk_${a.experimentId}_${surface}`
      if (sessionStorage.getItem(flag)) return
      sessionStorage.setItem(flag, '1')
      $fetch('/api/cta/click', {
        method: 'POST',
        body: { sessionId: sid, experimentId: a.experimentId, variantId: variantId.value, surface },
      }).catch(() => {})
    } catch {
      /* tracking must never surface errors */
    }
  }

  /** Fire-and-forget, once per session per experiment. */
  function trackImpression() {
    if (import.meta.server) return
    const a = config.value
    const sid = sessionId()
    if (!a || !sid || !variantId.value) return
    try {
      const flag = `cta_imp_${a.experimentId}`
      if (sessionStorage.getItem(flag)) return
      sessionStorage.setItem(flag, '1')
      $fetch('/api/cta/impression', {
        method: 'POST',
        body: { sessionId: sid, experimentId: a.experimentId, variantId: variantId.value },
      }).catch(() => {})
    } catch {
      /* tracking must never surface errors */
    }
  }

  return { ctaText, experimentId, variantId, sessionId, trackImpression, trackClick }
}
