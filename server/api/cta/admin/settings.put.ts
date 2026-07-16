import { serverSupabaseUser } from '#supabase/server'

/** Promotion mode (manual | auto) and the min-sample floor. */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  const updates: { key: string; value: unknown }[] = []
  if (body?.mode === 'manual' || body?.mode === 'auto') {
    updates.push({ key: 'promotion_mode', value: { mode: body.mode } })
  }
  const min = Number(body?.minImpressionsPerVariant)
  if (Number.isFinite(min) && min >= 0 && min <= 100000) {
    updates.push({ key: 'min_sample', value: { impressions_per_variant: Math.round(min) } })
  }
  if (!updates.length) throw createError({ statusCode: 400, statusMessage: 'Nothing to update' })

  for (const u of updates) {
    const res = await ctaRest('cta_settings', {
      method: 'POST',
      body: { ...u, updated_at: new Date().toISOString() },
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    })
    if (res === null) throw createError({ statusCode: 502, statusMessage: 'Settings update failed' })
  }
  return { ok: true }
})
