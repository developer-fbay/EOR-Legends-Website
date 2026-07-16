import { serverSupabaseUser } from '#supabase/server'

/**
 * Start a new monthly CTA set: archives the current experiment (its stats
 * freeze into the changelog) and creates 3 variants at 33/33/33.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const texts: unknown = body?.texts
  if (
    !Array.isArray(texts) ||
    texts.length !== 3 ||
    !texts.every((t) => typeof t === 'string' && t.trim().length > 0 && t.trim().length <= 60)
  ) {
    throw createError({ statusCode: 400, statusMessage: 'Provide exactly 3 CTA texts (1-60 characters each)' })
  }
  if (!ctaConfigured()) throw createError({ statusCode: 503, statusMessage: 'Supabase not configured' })

  // archive whatever is currently running
  await ctaRest('cta_experiments?phase=neq.archived', {
    method: 'PATCH',
    body: { phase: 'archived', archived_at: new Date().toISOString(), needs_attention: null },
    headers: { Prefer: 'return=minimal' },
  })

  const created = await ctaRest<{ id: string }[]>('cta_experiments', {
    method: 'POST',
    body: { month: londonMonth() },
    headers: { Prefer: 'return=representation' },
  })
  const experimentId = created?.[0]?.id
  if (!experimentId) throw createError({ statusCode: 502, statusMessage: 'Could not create the experiment' })

  const weights = [33.3333, 33.3333, 33.3334]
  const variants = await ctaRest('cta_variants', {
    method: 'POST',
    body: (texts as string[]).map((t, i) => ({
      experiment_id: experimentId,
      text: t.trim(),
      weight: weights[i],
      sort_order: i,
    })),
    headers: { Prefer: 'return=representation' },
  })
  if (!variants) throw createError({ statusCode: 502, statusMessage: 'Could not create the variants' })

  invalidateCtaCache()
  return { ok: true, experimentId }
})
