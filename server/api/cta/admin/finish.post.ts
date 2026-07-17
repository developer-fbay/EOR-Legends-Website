import { serverSupabaseUser } from '#supabase/server'

/**
 * Finish the current test: each section locks to its own winner (forms by
 * conversions, buttons by clicks, no-signal sections get the overall
 * winner), written as deletable overrides; the experiment is archived.
 * Blocks below the min-sample floor unless { force: true }.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event).catch(() => ({}))
  const force = body?.force === true

  const exps = await ctaRest<{ id: string }[]>('cta_experiments?phase=neq.archived&select=id&limit=1')
  const exp = exps?.[0]
  if (!exp) throw createError({ statusCode: 404, statusMessage: 'No active test' })

  const settings = await getCtaSettings()
  const stats = await getVariantStats(exp.id)
  if (!stats.length) throw createError({ statusCode: 502, statusMessage: 'No variant stats available' })

  const guard = computePromotion(stats, settings.minImpressionsPerVariant)
  if (!guard.ok && !force) {
    return { ok: false, reason: 'min_sample', detail: { minimum: settings.minImpressionsPerVariant, underSampled: guard.underSampled } }
  }

  const res = await finishCtaExperiment(exp.id)
  if (!res.ok) throw createError({ statusCode: 502, statusMessage: 'Finishing the test failed' })
  return { ok: true, leaders: res.leaders }
})
