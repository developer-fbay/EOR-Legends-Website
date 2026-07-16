import { serverSupabaseUser } from '#supabase/server'

/**
 * Promote the current experiment to 80/10/10 by conversion rate.
 * Blocks below the min-sample floor unless { force: true }.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event).catch(() => ({}))
  const force = body?.force === true

  const exps = await ctaRest<{ id: string; phase: string }[]>(
    'cta_experiments?phase=neq.archived&select=id,phase&limit=1',
  )
  const exp = exps?.[0]
  if (!exp) throw createError({ statusCode: 404, statusMessage: 'No active experiment' })

  const settings = await getCtaSettings()
  const stats = await getVariantStats(exp.id)
  if (stats.length === 0) throw createError({ statusCode: 502, statusMessage: 'No variant stats available' })

  const p = computePromotion(stats, settings.minImpressionsPerVariant)
  if (!p.ok && !force) {
    return { ok: false, reason: 'min_sample', detail: { minimum: settings.minImpressionsPerVariant, underSampled: p.underSampled } }
  }

  await applyPromotion(exp.id, p.ranking)
  return { ok: true, weights: p.ranking }
})
