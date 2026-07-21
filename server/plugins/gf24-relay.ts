/**
 * SDRs still submit the New Lead Input form on the OLD WordPress page
 * (legendseor.com/new-lead-input-form/), where WP's broken background feed
 * delivery means those entries never reach Zapier. This watcher polls form
 * 24 every 5 minutes and posts any unseen WP-native entry to the New Lead
 * Input Zap hook. API submissions from this server are skipped — gf-submit
 * already delivers those directly. Last-seen state lives in Supabase
 * (cta_settings key gf24_relay) so restarts never replay old entries.
 */
export default defineNitroPlugin(() => {
  if (process.env.NODE_ENV === 'development') return
  const gfBase = process.env.GF_BASE_URL
  const gfKey = process.env.GF_CONSUMER_KEY
  const gfSecret = process.env.GF_CONSUMER_SECRET
  if (!gfBase || !gfKey || !gfSecret) return

  const auth = 'Basic ' + Buffer.from(`${gfKey}:${gfSecret}`).toString('base64')
  let running = false

  async function saveLastSeen(lastEntryId: number) {
    await ctaRest('cta_settings', {
      method: 'POST',
      body: { key: 'gf24_relay', value: { lastEntryId }, updated_at: new Date().toISOString() },
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    })
  }

  async function sweep() {
    if (running) return
    running = true
    try {
      const state = await ctaRest<{ value: any }[]>('cta_settings?key=eq.gf24_relay&select=value')
      if (state === null) return // Supabase unreachable — try again next tick
      const lastSeen = Number(state?.[0]?.value?.lastEntryId ?? NaN)

      const res: any = await $fetch(
        `${gfBase}/wp-json/gf/v2/forms/24/entries?sorting%5Bkey%5D=id&sorting%5Bdirection%5D=DESC&paging%5Bpage_size%5D=20`,
        { headers: { Authorization: auth } },
      )
      const entries: any[] = (res?.entries ?? []).slice().reverse() // oldest first
      if (!entries.length) return
      const maxId = Math.max(...entries.map((e: any) => Number(e.id)))

      if (!Number.isFinite(lastSeen)) {
        // First ever run: start from the current newest entry, never replay history.
        await saveLastSeen(maxId)
        console.log(`[gf24-relay] initialised at entry ${maxId}`)
        return
      }

      for (const e of entries) {
        const id = Number(e.id)
        if (id <= lastSeen) continue
        const fromWpPage = !String(e.source_url || '').includes('/wp-json/')
        if (fromWpPage) {
          const payload: Record<string, string> = {
            id: String(e.id),
            form_id: '24',
            form_title: GF24_ZAP.title,
            date_created: e.date_created,
          }
          for (const [fid, label] of Object.entries(GF24_ZAP.labels)) payload[label] = String(e[fid] ?? '')
          await $fetch(GF24_ZAP.hook, { method: 'POST', body: payload })
          console.log(`[gf24-relay] entry ${id} relayed to Zapier`)
        }
        // persist per entry so a mid-loop failure never re-sends what succeeded
        await saveLastSeen(id)
      }
    } catch (err: any) {
      console.error('[gf24-relay] sweep failed:', err?.message)
    } finally {
      running = false
    }
  }

  setTimeout(sweep, 15_000)
  setInterval(sweep, 5 * 60_000)
})
