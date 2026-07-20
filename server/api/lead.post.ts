/**
 * Lead submission endpoint.
 * Phase 1: validates and logs. Once Supabase keys + Gravity Forms API keys
 * are in .env this stores the lead in the `leads` table and forwards it to
 * the existing WordPress Gravity Forms (IDs 28/29/31) so the current lead
 * flow is uninterrupted.
 */
/**
 * Zapier delivery is done HERE, not by WordPress: the WP host's background
 * feed queue is broken (diagnosed 2026-07-20 — GF emails send inline but no
 * Zapier feed ever fires). Each form posts straight to its Zap's hook after
 * GF accepts the entry. Keys mirror what the GF Zapier add-on would send
 * (field labels) so existing Zap field mappings keep working.
 */
const ZAP_HOOKS: Record<number, { hook: string; title: string; labels: Record<string, string> }> = {
  29: {
    hook: 'https://hooks.zapier.com/hooks/standard/2683347/0f86e91401d24644b8e225f19ee060de/',
    title: '2026 Header Contact Form',
    labels: { name: 'Full name', email: 'Email', phone: 'Phone', radio: 'What brings you here?', company: 'Company name', message: 'message' },
  },
  28: {
    hook: 'https://hooks.zapier.com/hooks/standard/2683347/fb99e67ba84c4535be16c8c0e217062c/',
    title: '2026 Footer Contact Form',
    labels: { name: 'Full Name', email: 'Email Address', phone: 'Mobile Number', radio: 'What brings you here?', company: 'company name', message: 'message' },
  },
  31: {
    hook: 'https://hooks.zapier.com/hooks/standard/2683347/a20dbc02eaa446f88d1bc2bd238cfd82/',
    title: '2026 Pop Up Contact Form',
    labels: { name: 'full name', email: 'work Email', phone: 'Phone', radio: 'What brings you here?', company: 'Company name *', message: 'message' },
  },
}

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

        const zap = ZAP_HOOKS[gfFormId]
        if (zap) {
          await $fetch(zap.hook, {
            method: 'POST',
            body: {
              id: String(res.entry_id),
              form_id: String(gfFormId),
              form_title: zap.title,
              date_created: new Date().toISOString().slice(0, 19).replace('T', ' '),
              [zap.labels.name!]: lead.full_name,
              [zap.labels.email!]: lead.email,
              [zap.labels.phone!]: lead.phone,
              [zap.labels.radio!]: radioValue,
              [zap.labels.company!]: companyValue,
              [zap.labels.message!]: messageValue,
              source_page: lead.source,
            },
          }).then(
            () => console.log(`[lead] Zapier hook fired for form ${gfFormId}, entry ${res.entry_id}`),
            (err: any) => console.error('[lead] Zapier hook failed:', err?.message),
          )
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
