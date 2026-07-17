import { serverSupabaseUser } from '#supabase/server'

/**
 * Stop the current experiment without starting a new one: the set is
 * archived (stats stay in the changelog) and every CTA on the site reverts
 * to its hardcoded default text within the 60s config cache window.
 */
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event).catch(() => null)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const res = await ctaRest<any[]>('cta_experiments?phase=neq.archived', {
    method: 'PATCH',
    body: { phase: 'archived', archived_at: new Date().toISOString(), needs_attention: null },
    headers: { Prefer: 'return=representation' },
  })
  invalidateCtaCache()
  return { ok: true, stopped: Array.isArray(res) ? res.length : 0 }
})
