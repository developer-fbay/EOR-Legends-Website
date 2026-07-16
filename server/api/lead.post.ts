/**
 * Lead submission endpoint.
 * Phase 1: validates and logs. Once Supabase keys + Gravity Forms API keys
 * are in .env this stores the lead in the `leads` table and forwards it to
 * the existing WordPress Gravity Forms (IDs 28/29/31) so the current lead
 * flow is uninterrupted.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Honeypot: hidden "website" field filled → bot; fake success and drop.
  if (typeof body?.website === 'string' && body.website.trim()) {
    return { ok: true }
  }

  const required = ['fullName', 'email', 'phone']
  for (const field of required) {
    if (!body?.[field] || typeof body[field] !== 'string') {
      throw createError({ statusCode: 400, statusMessage: `Missing field: ${field}` })
    }
  }

  // Size caps against abusive payloads
  for (const f of ['fullName', 'email', 'phone', 'company', 'message', 'source']) {
    if (typeof body[f] === 'string' && body[f].length > 3000) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid submission' })
    }
  }

  // Which Gravity Form this submission maps to: header 29, footer 28, popup 31
  const gfFormId = [28, 29, 31].includes(Number(body.gfFormId)) ? Number(body.gfFormId) : 28

  const lead = {
    full_name: body.fullName,
    email: body.email,
    phone: body.phone,
    audience: body.audience === 'jobseeker' ? 'jobseeker' : 'employer',
    company: body.company || null,
    message: body.message || null,
    source: typeof body.source === 'string' ? body.source.slice(0, 60) : `gf-${gfFormId}`,
    created_at: new Date().toISOString(),
  }

  // --- Supabase (enabled once SUPABASE_URL / SUPABASE_SERVICE_KEY exist) ---
  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (supabaseUrl && serviceKey) {
    await $fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: lead,
    })
  } else {
    console.log('[lead] Supabase not configured yet — lead received:', lead)
  }

  // --- Gravity Forms forwarding (enabled once GF keys exist) ---
  const gfBase = process.env.GF_BASE_URL // e.g. https://legendseor.com
  const gfKey = process.env.GF_CONSUMER_KEY
  const gfSecret = process.env.GF_CONSUMER_SECRET
  if (gfBase && gfKey && gfSecret) {
    // Field IDs per form, read from the live GF configuration:
    //   28 (footer), 29 (header), 31 (popup)
    const FIELD_MAP: Record<number, Record<string, number>> = {
      28: { name: 12, email: 13, phone: 14, radio: 15, company: 16, message: 17 },
      29: { name: 1, email: 5, phone: 6, radio: 7, company: 8, message: 9 },
      31: { name: 10, email: 8, phone: 9, radio: 11, company: 13, message: 12 },
    }
    const f = FIELD_MAP[gfFormId]!
    const radioValue = lead.audience === 'jobseeker' ? "I'm a job seeker" : "I'm an employer / business"
    const companyValue = lead.company || ''
    const messageValue = lead.message || ''

    try {
      const res: any = await $fetch(`${gfBase}/wp-json/gf/v2/forms/${gfFormId}/submissions`, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${gfKey}:${gfSecret}`).toString('base64'),
          'Content-Type': 'application/json',
        },
        body: {
          [`input_${f.name}`]: lead.full_name,
          [`input_${f.email}`]: lead.email,
          [`input_${f.phone}`]: lead.phone,
          [`input_${f.radio}`]: radioValue,
          [`input_${f.company}`]: companyValue,
          [`input_${f.message}`]: messageValue,
        },
      })
      console.log(`[lead] Gravity Forms ${gfFormId}: forwarded OK, entry ${res?.entry_id ?? '?'} (valid: ${res?.is_valid})`)

      // CTA A/B conversion — every GF-validated submission counts (Codi's
      // decision), idempotent on the GF entry id. Best-effort: tracking can
      // never break a lead.
      if (res?.entry_id && res.is_valid !== false) {
        try {
          const { ctaExperimentId, ctaVariantId, ctaSessionId } = body || {}
          if ([ctaExperimentId, ctaVariantId, ctaSessionId].every((v: unknown) => typeof v === 'string' && CTA_UUID_RE.test(v as string))) {
            await ctaRest('cta_events', {
              method: 'POST',
              body: {
                experiment_id: ctaExperimentId,
                variant_id: ctaVariantId,
                session_id: ctaSessionId,
                type: 'conversion',
                gf_form_id: gfFormId,
                gf_entry_id: Number(res.entry_id),
                source: lead.source,
              },
              headers: { Prefer: 'return=minimal' },
            })
          }
        } catch (err: any) {
          console.error('[lead] CTA conversion insert failed:', err?.message)
        }
      }
      if (res && res.is_valid === false) {
        // 1:1 with GF: relay its field messages to the browser so the visitor
        // can fix the field — never pretend success when no entry was created.
        console.error('[lead] GF rejected the submission:', JSON.stringify(res.validation_messages))
        const nameById: Record<string, string> = {
          [f.name]: 'fullName',
          [f.email]: 'email',
          [f.phone]: 'phone',
          [f.radio]: 'audience',
          [f.company]: 'company',
          [f.message]: 'message',
        }
        const validation: Record<string, string> = {}
        for (const [id, msg] of Object.entries(res.validation_messages || {})) {
          validation[nameById[id] || id] = String(msg)
        }
        return { ok: false, validation }
      }

      // The radio field's conditional logic ("phone contains 0") makes GF discard
      // the radio value whenever the international number happens to lack a literal
      // zero. Rewrite the entry afterwards — entry updates bypass conditional logic.
      // NOTE: GF's entry PUT replaces ALL fields, so send the complete set.
      if (res?.entry_id) {
        await $fetch(`${gfBase}/wp-json/gf/v2/entries/${res.entry_id}`, {
          method: 'PUT',
          headers: {
            Authorization: 'Basic ' + Buffer.from(`${gfKey}:${gfSecret}`).toString('base64'),
            'Content-Type': 'application/json',
          },
          body: {
            form_id: String(gfFormId),
            [String(f.name)]: lead.full_name,
            [String(f.email)]: lead.email,
            [String(f.phone)]: lead.phone,
            [String(f.radio)]: radioValue,
            [String(f.company)]: companyValue,
            [String(f.message)]: messageValue,
          },
        }).catch((err: any) => {
          console.error('[lead] GF entry radio patch failed:', err?.message)
        })
      }
    } catch (err: any) {
      // GF answers validation failures with HTTP 400, which lands here.
      const data = err?.data
      if (data?.is_valid === false) {
        console.error('[lead] GF rejected the submission:', JSON.stringify(data.validation_messages))
        const nameById: Record<string, string> = {
          [f.name]: 'fullName',
          [f.email]: 'email',
          [f.phone]: 'phone',
          [f.radio]: 'audience',
          [f.company]: 'company',
          [f.message]: 'message',
        }
        const validation: Record<string, string> = {}
        for (const [id, msg] of Object.entries(data.validation_messages || {})) {
          validation[nameById[id] || id] = String(msg)
        }
        return { ok: false, validation }
      }
      // GF unreachable — without a Supabase store the lead would be lost, so
      // tell the visitor it failed rather than silently dropping it.
      console.error('[lead] Gravity Forms forward failed:', err?.message)
      if (!(supabaseUrl && serviceKey)) {
        throw createError({ statusCode: 502, statusMessage: 'Submission failed, please try again' })
      }
    }
  } else {
    console.warn(`[lead] GF forwarding SKIPPED — missing env (GF_BASE_URL/KEY/SECRET). Lead stored in Supabase only.`)
  }

  return { ok: true }
})
