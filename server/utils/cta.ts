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
export type CtaSettings = { mode: 'manual' | 'auto'; minImpressionsPerVariant: number; durationDays: number }

/** Every rotating section on the site. Forms are judged by conversions, the rest by clicks. */
export const CTA_SURFACES = [
  'header',
  'footer',
  'hero-form',
  'mobile-hero',
  'footer-form',
  'popup-form',
  'page-forms',
  'cta-band',
  'salary-tool',
  'service-buttons',
  'tools-page',
  'how-it-works',
] as const
const FORM_SURFACES = new Set(['hero-form', 'footer-form', 'popup-form', 'page-forms'])

/** Mirror of LeadForm's source -> surface mapping (conversion attribution). */
export function sourceToFormSurface(source: string | null | undefined): string {
  const s = source || ''
  if (s === 'header') return 'hero-form'
  if (s === 'footer') return 'footer-form'
  if (s === 'popup' || s === 'contact-page') return 'popup-form'
  return 'page-forms'
}

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

/**
 * Custom CTA texts. Keys are either a plain surface ('header') or a
 * page-scoped surface ('page-forms@/services/payroll'). Page-scoped rules
 * beat section rules; overridden buttons don't rotate.
 */
export type CtaOverrides = Record<string, string>

export async function getCtaOverrides(): Promise<CtaOverrides> {
  const rows = await ctaRest<{ value: any }[]>('cta_settings?key=eq.surface_overrides&select=value')
  const v = rows?.[0]?.value
  if (!v || typeof v !== 'object' || Array.isArray(v)) return {}
  const clean: CtaOverrides = {}
  for (const [k, t] of Object.entries(v)) {
    if (typeof t === 'string' && t.trim()) clean[String(k).slice(0, 120)] = t.trim().slice(0, 60)
  }
  return clean
}

export async function getCtaSettings(): Promise<CtaSettings> {
  const rows = await ctaRest<{ key: string; value: any }[]>('cta_settings?select=key,value')
  const mode = rows?.find((r) => r.key === 'promotion_mode')?.value?.mode === 'auto' ? 'auto' : 'manual'
  const min = Number(rows?.find((r) => r.key === 'min_sample')?.value?.impressions_per_variant) || 100
  const days = Number(rows?.find((r) => r.key === 'test_duration')?.value?.days) || 10
  return { mode, minImpressionsPerVariant: min, durationDays: Math.min(90, Math.max(1, days)) }
}

export async function getVariantStats(experimentId: string): Promise<CtaStats[]> {
  return (
    (await ctaRest<CtaStats[]>(
      `cta_variant_stats?experiment_id=eq.${experimentId}&select=*&order=sort_order.asc`,
    )) || []
  )
}

export type SectionLeader = {
  surface: string
  metric: 'conversions' | 'clicks' | 'overall'
  winnerVariantId: string
  winnerText: string
  score: number
}

/**
 * Per-section winners: form sections by conversions-per-impression on THAT
 * form; other sections by clicked-sessions-per-impression on THAT button;
 * sections with no signal fall back to the overall winner.
 */
export async function computeSectionWinners(experimentId: string): Promise<{
  leaders: SectionLeader[]
  overall: { variantId: string; text: string }
} | null> {
  const stats = await getVariantStats(experimentId)
  if (!stats.length) return null
  const breakdown =
    (await ctaRest<{ variant_id: string; type: string; surface: string | null; source: string | null; n: number }[]>(
      `cta_event_breakdown?experiment_id=eq.${experimentId}&select=variant_id,type,surface,source,n`,
    )) || []

  const impressions: Record<string, number> = {}
  for (const s of stats) impressions[s.variant_id] = Number(s.impressions)
  const textById: Record<string, string> = {}
  for (const s of stats) textById[s.variant_id] = s.text

  // overall winner: total CVR, tiebreak conversions then clicks
  const totals: Record<string, { conv: number; clicks: number }> = {}
  for (const s of stats) totals[s.variant_id] = { conv: Number(s.conversions), clicks: 0 }
  for (const b of breakdown) {
    if (b.type === 'click') totals[b.variant_id] = totals[b.variant_id] || { conv: 0, clicks: 0 }
    if (b.type === 'click') totals[b.variant_id]!.clicks += Number(b.n)
  }
  const overallRanked = [...stats].sort((a, b) => {
    const ra = impressions[a.variant_id] ? totals[a.variant_id]!.conv / impressions[a.variant_id]! : 0
    const rb = impressions[b.variant_id] ? totals[b.variant_id]!.conv / impressions[b.variant_id]! : 0
    if (rb !== ra) return rb - ra
    if (totals[b.variant_id]!.conv !== totals[a.variant_id]!.conv) return totals[b.variant_id]!.conv - totals[a.variant_id]!.conv
    if (totals[b.variant_id]!.clicks !== totals[a.variant_id]!.clicks) return totals[b.variant_id]!.clicks - totals[a.variant_id]!.clicks
    return a.sort_order - b.sort_order
  })
  const overall = { variantId: overallRanked[0]!.variant_id, text: overallRanked[0]!.text }

  // per-surface signal: surface -> variant -> count
  const bySurface: Record<string, Record<string, number>> = {}
  for (const b of breakdown) {
    let surface: string | null = null
    if (b.type === 'click' && b.surface) surface = b.surface
    if (b.type === 'conversion') surface = sourceToFormSurface(b.source)
    if (!surface) continue
    bySurface[surface] = bySurface[surface] || {}
    bySurface[surface][b.variant_id] = (bySurface[surface][b.variant_id] || 0) + Number(b.n)
  }

  const leaders: SectionLeader[] = []
  for (const surface of CTA_SURFACES) {
    const counts = bySurface[surface]
    if (!counts || !Object.values(counts).some((n) => n > 0)) {
      leaders.push({ surface, metric: 'overall', winnerVariantId: overall.variantId, winnerText: overall.text, score: 0 })
      continue
    }
    const ranked = Object.entries(counts).sort((a, b) => {
      const ra = impressions[a[0]] ? a[1] / impressions[a[0]]! : 0
      const rb = impressions[b[0]] ? b[1] / impressions[b[0]]! : 0
      if (rb !== ra) return rb - ra
      return b[1] - a[1]
    })
    const [variantId, n] = ranked[0]!
    leaders.push({
      surface,
      metric: FORM_SURFACES.has(surface) ? 'conversions' : 'clicks',
      winnerVariantId: variantId,
      winnerText: textById[variantId] || overall.text,
      score: impressions[variantId] ? n / impressions[variantId]! : 0,
    })
  }
  return { leaders, overall }
}

/**
 * Finish the test: lock each section to its winner (written as overrides so
 * they show in Active custom CTAs and can be deleted/reverted one by one),
 * then archive the experiment. Existing manual overrides are preserved.
 */
export async function finishCtaExperiment(experimentId: string): Promise<{ ok: boolean; leaders?: SectionLeader[] }> {
  const winners = await computeSectionWinners(experimentId)
  if (!winners) return { ok: false }
  const existing = await getCtaOverrides()
  const merged: CtaOverrides = { ...existing }
  for (const l of winners.leaders) {
    if (!merged[l.surface]) merged[l.surface] = l.winnerText
  }
  await ctaRest('cta_settings', {
    method: 'POST',
    body: { key: 'surface_overrides', value: merged, updated_at: new Date().toISOString() },
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  })
  await ctaRest(`cta_experiments?id=eq.${experimentId}`, {
    method: 'PATCH',
    body: { phase: 'archived', archived_at: new Date().toISOString(), promoted_at: new Date().toISOString(), needs_attention: null },
    headers: { Prefer: 'return=minimal' },
  })
  invalidateCtaCache()
  return { ok: true, leaders: winners.leaders }
}

// ---------------------------------------------------------------------------
// Active-config cache (single DO instance, same assumption as rate-limit.ts)
// ---------------------------------------------------------------------------
let cache: { data: { active: CtaActive | null; overrides: CtaOverrides }; at: number } | null = null

export function invalidateCtaCache() {
  cache = null
}

export async function getActiveCtaConfig(): Promise<{ active: CtaActive | null; overrides: CtaOverrides }> {
  if (cache && Date.now() - cache.at < 60_000) return cache.data
  const exps = await ctaRest<{ id: string; month: string; phase: string }[]>(
    'cta_experiments?phase=neq.archived&select=id,month,phase&limit=1',
  )
  const exp = exps?.[0]
  let active: CtaActive | null = null
  if (exp) {
    const variants = await ctaRest<{ id: string; text: string; weight: number }[]>(
      `cta_variants?experiment_id=eq.${exp.id}&select=id,text,weight&order=sort_order.asc`,
    )
    if (variants?.length) {
      active = {
        experimentId: exp.id,
        month: exp.month,
        phase: exp.phase,
        variants: variants.map((v) => ({ id: v.id, text: v.text, weight: Number(v.weight) })),
      }
    }
  }
  const overrides = await getCtaOverrides()
  const data = { active, overrides }
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
    const exps = await ctaRest<{ id: string; phase: string; started_at: string; needs_attention: string | null }[]>(
      'cta_experiments?phase=neq.archived&select=id,phase,started_at,needs_attention&limit=1',
    )
    const exp = exps?.[0]
    if (!exp) return

    const settings = await getCtaSettings()
    const endsAt = new Date(exp.started_at).getTime() + settings.durationDays * 24 * 60 * 60 * 1000
    if (Date.now() < endsAt) return

    if (settings.mode === 'auto') {
      const stats = await getVariantStats(exp.id)
      const p = computePromotion(stats, settings.minImpressionsPerVariant)
      if (p.ok) {
        await finishCtaExperiment(exp.id)
        console.log(`[cta] auto-finished experiment ${exp.id}: per-section winners locked in`)
      } else if (!exp.needs_attention) {
        await ctaRest(`cta_experiments?id=eq.${exp.id}`, {
          method: 'PATCH',
          body: {
            needs_attention: `Auto-finish skipped: fewer than ${settings.minImpressionsPerVariant} impressions per variant. Finish manually or wait for more traffic.`,
          },
          headers: { Prefer: 'return=minimal' },
        })
        invalidateCtaCache()
      }
    } else if (!exp.needs_attention) {
      await ctaRest(`cta_experiments?id=eq.${exp.id}`, {
        method: 'PATCH',
        body: { needs_attention: `This test has run its ${settings.durationDays} days: finish it to lock in the winners, or keep it running.` },
        headers: { Prefer: 'return=minimal' },
      })
      invalidateCtaCache()
    }
  } catch (err: any) {
    console.error('[cta] lifecycle evaluation failed:', err?.message)
  } finally {
    lifecycleRunning = false
  }
}

export const CTA_UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
