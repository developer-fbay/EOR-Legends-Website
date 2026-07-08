/**
 * Generic Gravity Forms submission proxy for special-purpose forms:
 *   30 — guide download ("Legends EOR 2026 Download Guide")
 *   24 — internal New Lead Input form (GF → Zapier → Close CRM on the WP side)
 * The client sends { formId, values: { "<fieldId>": value } }.
 */
const ALLOWED_FORMS = [24, 30]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const formId = Number(body?.formId)
  const values = body?.values

  if (!ALLOWED_FORMS.includes(formId) || !values || typeof values !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }

  // Honeypot: the hidden "website" field is invisible to humans — a filled
  // value means a bot. Pretend success so it doesn't learn and retry.
  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  // Size caps — reject obviously abusive payloads before touching GF
  const entries = Object.entries(values)
  if (entries.length > 40 || entries.some(([, v]) => String(v ?? '').length > 5000)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
  }

  const gfBase = process.env.GF_BASE_URL
  const gfKey = process.env.GF_CONSUMER_KEY
  const gfSecret = process.env.GF_CONSUMER_SECRET
  if (!gfBase || !gfKey || !gfSecret) {
    console.error('[gf-submit] GF env missing — submission dropped')
    throw createError({ statusCode: 503, statusMessage: 'Form service unavailable' })
  }

  const payload: Record<string, string> = {}
  for (const [id, value] of Object.entries(values)) {
    if (!/^\d+$/.test(id)) continue
    payload[`input_${id}`] = String(value ?? '')
  }

  try {
    const res: any = await $fetch(`${gfBase}/wp-json/gf/v2/forms/${formId}/submissions`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${gfKey}:${gfSecret}`).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: payload,
    })
    console.log(`[gf-submit] form ${formId}: entry ${res?.entry_id ?? '?'} (valid: ${res?.is_valid})`)
    return { ok: true, entryId: res?.entry_id }
  } catch (err: any) {
    const data = err?.data
    if (data?.is_valid === false) {
      // pass field-level validation messages back to the client
      return { ok: false, validation: data.validation_messages }
    }
    console.error(`[gf-submit] form ${formId} failed:`, err?.message)
    throw createError({ statusCode: 502, statusMessage: 'Submission failed' })
  }
})
