/**
 * CTA A/B rotation — shared server utilities.
 *
 * Monthly experiments: 3 CTA texts start at 33/33/33 across visitors; the
 * best converter is promoted to 80/10/10 (manually from the dashboard, or
 * automatically on the 1st of the month, Europe/London). All Supabase access
 * goes through the service key here — public traffic never touches the
 * tables directly. Every read/write is best-effort: if Supabase is missing
 * or down, callers fall back and the site keeps its hardcoded CTA texts.
 */

export type CtaVariant = { id: string; text: string; weight: number }
export type CtaActive = { experimentId: string; month: string; phase: string; variants: CtaVariant[] }
export type CtaStats = {
  variant_id: string
  experiment_id: string
  text: string
  weight: number
  is_winner: boolean
  sort_order: number
  impressions: number
  conversions: number
}
export type CtaSettings = { mode: 'manual' | 'auto'; minImpressionsPerVariant: number }

function sbUrl() {
  return process.env.SUPABASE_URL
}
function sbKey() {
  return process.env.SUPABASE_SERVICE_KEY
}

export function ctaConfigured(): boolean {
  return !!(sbUrl() && sbKey())
}

/** Thin PostgREST wrapper. Returns null on any failure (incl. 409 conflicts). */
export async function ctaRest<T = any>(
  path: string,
  opts: { method?: string; body?: unknown; headers?: Record<string, string> } = {},
): Promise<T | null> {
  if (!ctaConfigured()) return null
  try {
    const res = await fetch(`${sbUrl()}/rest/v1/${path}`, {
      method: opts.method || 'GET',
      headers: {
        apikey: sbKey()!,
        Authorization: `Bearer ${sbKey()}`,
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
      },
      body: opts.body === undefined ? undefined : JSON.stringify(opts.body),
    })
    if (!res.ok) return null
    const text = await res.text()
    return text ? (JSON.parse(text) as T) : ({} as T)
  } catch {
    return null
  }
}

/** 'YYYY-MM' in Europe/London — the calendar the rotation runs on. */
export function londonMonth(d = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
  }).formatToParts(d)
  const y = parts.find((p) => p.type === 'year')!.value
  const m = parts.find((p) => p.type === 'month')!.value
  return `${y}-${m}`
}

function monthsBetween(a: string, b: string): number {
  const [ay, am] = a.split('-').map(Number)
  const [by, bm] = b.split('-').map(Number)
  return (by! - ay!) * 12 + (bm! - am!)
}

/** Rank by CVR and assign 80/10/10. Blocks (ok:false) below the sample floor. */
export function computePromotion(stats: CtaStats[], minImpressions: number) {
  const ranked = [...stats].sort((a, b) => {
    const cvrA = Number(a.impressions) ? Number(a.conversions) / Number(a.impressions) : 0
    const cvrB = Number(b.impressions) ? Number(b.conversions) / Number(b.impressions) : 0
    if (cvrB !== cvrA) return cvrB - cvrA
    if (Number(b.conversions) !== Number(a.conversions)) return Number(b.conversions) - Number(a.conversions)
    return a.sort_order - b.sort_order
  })
  const WEIGHTS = [80, 10, 10]
  const under = stats.filter((s) => Number(s.impressions) < minImpressions)
  return {
    ok: under.length === 0,
    reason: under.length ? ('min_sample' as const) : undefined,
    underSampled: under.map((s) => ({ text: s.text, impressions: Number(s.impressions) })),
    ranking: ranked.map((s, i) => ({ variantId: s.variant_id, text: s.text, weight: WEIGHTS[i] ?? 0 })),
  }
}

export async function getCtaSettings(): Promise<CtaSettings> {
  const rows = await ctaRest<{ key: string; value: any }[]>('cta_settings?select=key,value')
  const mode = rows?.find((r) => r.key === 'promotion_mode')?.value?.mode === 'auto' ? 'auto' : 'manual'
  const min = Number(rows?.find((r) => r.key === 'min_sample')?.value?.impressions_per_variant) || 100
  return { mode, minImpressionsPerVariant: min }
}

export async function getVariantStats(experimentId: string): Promise<CtaStats[]> {
  return (
    (await ctaRest<CtaStats[]>(
      `cta_variant_stats?experiment_id=eq.${experimentId}&select=*&order=sort_order.asc`,
    )) || []
  )
}

/** Promote: write 80/10/10 weights + winner flag, flip phase to exploiting. */
export async function applyPromotion(
  experimentId: string,
  ranking: { variantId: string; weight: number }[],
) {
  for (const [i, r] of ranking.entries()) {
    await ctaRest(`cta_variants?id=eq.${r.variantId}`, {
      method: 'PATCH',
      body: { weight: r.weight, is_winner: i === 0 },
      headers: { Prefer: 'return=minimal' },
    })
  }
  await ctaRest(`cta_experiments?id=eq.${experimentId}`, {
    method: 'PATCH',
    body: { phase: 'exploiting', promoted_at: new Date().toISOString(), needs_attention: null },
    headers: { Prefer: 'return=minimal' },
  })
  invalidateCtaCache()
}

// ---------------------------------------------------------------------------
// Active-config cache (single DO instance, same assumption as rate-limit.ts)
// ---------------------------------------------------------------------------
let cache: { data: { active: CtaActive | null }; at: number } | null = null

export function invalidateCtaCache() {
  cache = null
}

export async function getActiveCtaConfig(): Promise<{ active: CtaActive | null }> {
  if (cache && Date.now() - cache.at < 60_000) return cache.data
  const exps = await ctaRest<{ id: string; month: string; phase: string }[]>(
    'cta_experiments?phase=neq.archived&select=id,month,phase&limit=1',
  )
  const exp = exps?.[0]
  let data: { active: CtaActive | null } = { active: null }
  if (exp) {
    const variants = await ctaRest<{ id: string; text: string; weight: number }[]>(
      `cta_variants?experiment_id=eq.${exp.id}&select=id,text,weight&order=sort_order.asc`,
    )
    if (variants?.length) {
      data = {
        active: {
          experimentId: exp.id,
          month: exp.month,
          phase: exp.phase,
          variants: variants.map((v) => ({ id: v.id, text: v.text, weight: Number(v.weight) })),
        },
      }
    }
  }
  cache = { data, at: Date.now() }
  return data
}

// ---------------------------------------------------------------------------
// Lazy lifecycle — DO App Platform has no cron, so month rollovers are
// evaluated on traffic, at most once an hour.
// ---------------------------------------------------------------------------
let lifecycleAt = 0
let lifecycleRunning = false

export async function evaluateCtaLifecycle() {
  if (lifecycleRunning || Date.now() - lifecycleAt < 60 * 60 * 1000) return
  lifecycleRunning = true
  lifecycleAt = Date.now()
  try {
    const exps = await ctaRest<{ id: string; month: string; phase: string }[]>(
      'cta_experiments?phase=neq.archived&select=id,month,phase&limit=1',
    )
    const exp = exps?.[0]
    if (!exp) return
    const nowMonth = londonMonth()
    if (nowMonth <= exp.month) return

    const settings = await getCtaSettings()

    if (exp.phase === 'exploring') {
      if (settings.mode === 'auto') {
        const stats = await getVariantStats(exp.id)
        const p = computePromotion(stats, settings.minImpressionsPerVariant)
        if (p.ok) {
          await applyPromotion(exp.id, p.ranking)
          console.log(`[cta] auto-promoted experiment ${exp.id} (${exp.month}) to 80/10/10`)
        } else {
          await ctaRest(`cta_experiments?id=eq.${exp.id}`, {
            method: 'PATCH',
            body: {
              needs_attention: `Auto-promotion skipped: fewer than ${settings.minImpressionsPerVariant} impressions per variant`,
            },
            headers: { Prefer: 'return=minimal' },
          })
          invalidateCtaCache()
        }
      } else {
        await ctaRest(`cta_experiments?id=eq.${exp.id}`, {
          method: 'PATCH',
          body: { needs_attention: 'New month: promote the winner or start a new CTA set' },
          headers: { Prefer: 'return=minimal' },
        })
        invalidateCtaCache()
      }
    } else if (exp.phase === 'exploiting' && monthsBetween(exp.month, nowMonth) >= 2) {
      // second rollover with no new set: winner carries at 100%
      const stats = await getVariantStats(exp.id)
      const winner = stats.find((s) => s.is_winner) || computePromotion(stats, 0).ranking[0]
      if (winner) {
        const winnerId = 'variant_id' in winner ? winner.variant_id : winner.variantId
        for (const s of stats) {
          await ctaRest(`cta_variants?id=eq.${s.variant_id}`, {
            method: 'PATCH',
            body: { weight: s.variant_id === winnerId ? 100 : 0 },
            headers: { Prefer: 'return=minimal' },
          })
        }
        await ctaRest(`cta_experiments?id=eq.${exp.id}`, {
          method: 'PATCH',
          body: { phase: 'carryover', needs_attention: 'Winner carrying over at 100%: enter 3 new CTAs' },
          headers: { Prefer: 'return=minimal' },
        })
        invalidateCtaCache()
        console.log(`[cta] experiment ${exp.id} moved to carryover (winner at 100%)`)
      }
    }
  } catch (err: any) {
    console.error('[cta] lifecycle evaluation failed:', err?.message)
  } finally {
    lifecycleRunning = false
  }
}

export const CTA_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
