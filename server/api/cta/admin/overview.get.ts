import { serverSupabaseUser } from '#supabase/server'

/**
 * One round trip for the dashboard: settings + the current experiment with
 * live stats + the changelog of archived experiments with final stats.
 * CVR math stays server-side so it always matches the promotion logic.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const settings = await getCtaSettings()

  function withCvr(stats: CtaStats[]) {
    return stats.map((s) => ({
      variantId: s.variant_id,
      text: s.text,
      weight: Number(s.weight),
      isWinner: s.is_winner,
      sortOrder: s.sort_order,
      impressions: Number(s.impressions),
      conversions: Number(s.conversions),
      cvr: Number(s.impressions) ? Number(s.conversions) / Number(s.impressions) : 0,
    }))
  }

  const currentRows = await ctaRest<any[]>(
    'cta_experiments?phase=neq.archived&select=id,month,phase,needs_attention,started_at,promoted_at&limit=1',
  )
  let current = null
  if (currentRows?.[0]) {
    const exp = currentRows[0]
    current = { experiment: exp, variants: withCvr(await getVariantStats(exp.id)) }
  }

  const archivedRows =
    (await ctaRest<any[]>(
      'cta_experiments?phase=eq.archived&select=id,month,phase,started_at,promoted_at,archived_at&order=started_at.desc&limit=24',
    )) || []
  const changelog = []
  for (const exp of archivedRows) {
    changelog.push({ experiment: exp, variants: withCvr(await getVariantStats(exp.id)) })
  }

  return { settings, currentMonth: londonMonth(), current, changelog }
})
