<script setup lang="ts">
/**
 * A/B CTA Testing — run 3 CTA texts against each other, watch live analytics,
 * finish with per-section winners (forms by conversions, buttons by clicks),
 * and manage custom CTA texts per page/section through modals.
 */
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

definePageMeta({ layout: 'admin' })

// ---------------------------------------------------------------------------
// Sections + pages
// ---------------------------------------------------------------------------
const SURFACES: Record<string, { label: string; fallback: string }> = {
  'header': { label: 'Navbar button', fallback: 'Contact Us' },
  'footer': { label: 'Footer button', fallback: 'Contact Us' },
  'hero-form': { label: 'Hero form submit', fallback: 'Speak to our team' },
  'mobile-hero': { label: 'Mobile hero button', fallback: 'Speak to our team' },
  'footer-form': { label: 'Footer form submit', fallback: 'Speak to our team' },
  'popup-form': { label: 'Popup form submit', fallback: 'Speak to our team' },
  'page-forms': { label: 'Page form submit', fallback: 'Speak to our team' },
  'cta-band': { label: 'Consultation band', fallback: 'Schedule a free consultation' },
  'salary-tool': { label: 'Salary tool button', fallback: 'Speak to an Expert' },
  'service-buttons': { label: 'Service contact buttons', fallback: 'Contact us' },
  'tools-page': { label: 'Tools page buttons', fallback: 'Contact us' },
  'how-it-works': { label: 'How It Works button', fallback: 'Lets get started' },
}

const SERVICE_SLUGS = ['payroll', 'hr', 'employee-benefits', 'company-culture', 'contractor-management', 'eor-migration', 'onboarding-offboarding', 'office-space', 'it-support', 'it-equipment']

const PAGES: { path: string; label: string; sections: string[] }[] = [
  { path: 'all', label: 'All pages (site-wide)', sections: ['footer', 'footer-form', 'popup-form', 'cta-band'] },
  { path: '/', label: 'Home page', sections: ['hero-form', 'mobile-hero', 'salary-tool', 'how-it-works', 'cta-band'] },
  ...SERVICE_SLUGS.map((s) => ({ path: `/services/${s}`, label: `Service: ${s}`, sections: ['page-forms', 'service-buttons', 'cta-band'] })),
  { path: '/tools/salary-benchmarking', label: 'Salary benchmarking tool page', sections: ['tools-page', 'salary-tool', 'cta-band'] },
  { path: '/contact', label: 'Contact page', sections: ['popup-form'] },
  { path: '/staffing-insights/true-cost-of-an-employee-in-the-uk', label: 'Pillar: True cost of an employee', sections: ['page-forms', 'cta-band'] },
  { path: '/staffing-insights/permanent-establishment-guide', label: 'Pillar: Permanent establishment', sections: ['page-forms', 'cta-band'] },
  { path: '/staffing-insights/true-cost-of-an-employee-in-the-uk/employee-on-costs', label: 'Cluster: Employee on-costs', sections: ['page-forms', 'cta-band'] },
  { path: '/staffing-insights/permanent-establishment-guide/what-is-an-employer-of-record', label: 'Cluster: What is an EOR', sections: ['page-forms', 'cta-band'] },
  { path: '/about', label: 'About page', sections: ['cta-band'] },
  { path: '/case-studies', label: 'Case studies archive', sections: ['cta-band'] },
  { path: '/blog', label: 'Blog archive', sections: ['cta-band'] },
  { path: '/news', label: 'News archive', sections: ['cta-band'] },
  { path: '/learn', label: 'Learn archive', sections: ['cta-band'] },
  { path: '/hr-glossary', label: 'HR glossary', sections: ['cta-band'] },
  { path: '/guides', label: 'Guides archive', sections: ['cta-band'] },
]

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
type VariantRow = { variantId: string; text: string; weight: number; isWinner: boolean; sortOrder: number; impressions: number; conversions: number; cvr: number }
type SectionLeader = { surface: string; metric: string; winnerVariantId: string; winnerText: string; score: number }
type ExperimentBlock = {
  experiment: { id: string; month: string; phase: string; needs_attention?: string | null; started_at: string; promoted_at?: string | null; archived_at?: string | null }
  variants: VariantRow[]
  sectionLeaders?: SectionLeader[]
  endsAt?: string
}
type Overview = {
  settings: { mode: 'manual' | 'auto'; minImpressionsPerVariant: number; durationDays: number }
  surfaceOverrides: Record<string, string>
  currentMonth: string
  current: ExperimentBlock | null
  changelog: ExperimentBlock[]
}

const overview = ref<Overview | null>(null)
const loadError = ref('')
const busy = ref(false)
const notice = ref('')

const mode = ref<'manual' | 'auto'>('manual')
const minSample = ref(100)
const durationDays = ref(10)

// modals
const showStart = ref(false)
const showNavbar = ref(false)
const showPage = ref(false)
const selectedPagePath = ref('all')
const newTexts = ref(['', '', ''])
const navbarText = ref('')
const pageTexts = ref<Record<string, string>>({})
const finishBlocked = ref<{ minimum: number; underSampled: { text: string; impressions: number }[] } | null>(null)

const chartEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

const selectedPage = computed(() => PAGES.find((p) => p.path === selectedPagePath.value) || PAGES[0]!)

// active custom CTAs, parsed from the overrides map
const activeCustom = computed(() => {
  const rows: { key: string; sectionLabel: string; pageLabel: string; text: string }[] = []
  for (const [k, text] of Object.entries(overview.value?.surfaceOverrides || {})) {
    const at = k.indexOf('@')
    const surface = at === -1 ? k : k.slice(0, at)
    const path = at === -1 ? null : k.slice(at + 1)
    rows.push({
      key: k,
      sectionLabel: SURFACES[surface]?.label || surface,
      pageLabel: path ? PAGES.find((p) => p.path === path)?.label || path : 'All pages',
      text,
    })
  }
  return rows.sort((a, b) => a.pageLabel.localeCompare(b.pageLabel))
})

// ---------------------------------------------------------------------------
// Data + actions
// ---------------------------------------------------------------------------
async function load() {
  loadError.value = ''
  try {
    const data = await $fetch<Overview>('/api/cta/admin/overview')
    overview.value = data
    mode.value = data.settings.mode
    minSample.value = data.settings.minImpressionsPerVariant
    durationDays.value = data.settings.durationDays
    await nextTick()
    renderChart()
  } catch (err: any) {
    loadError.value = err?.statusMessage || 'Could not load the A/B testing overview.'
  }
}

function renderChart() {
  if (!chartEl.value) return
  if (chart) chart.destroy()
  const rows = overview.value?.current?.variants || []
  if (!rows.length) return
  chart = new Chart(chartEl.value, {
    type: 'bar',
    data: {
      labels: rows.map((v) => `${v.text} (${v.impressions} views)`),
      datasets: [{ label: 'Conversion rate', data: rows.map((v) => Math.round(v.cvr * 10000) / 100), backgroundColor: rows.map((v) => (v.isWinner ? '#eb3d00' : '#3B8949')), borderRadius: 4 }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.x}% CVR` } } },
      scales: { x: { beginAtZero: true, ticks: { callback: (v: any) => `${v}%` } }, y: { ticks: { font: { size: 11 } } } },
    },
  })
}

const banner = computed(() => {
  const o = overview.value
  if (!o) return null
  if (!o.current) return 'No A/B test is running. The site shows its default texts plus any custom CTAs below.'
  if (o.current.experiment.needs_attention) return o.current.experiment.needs_attention
  return null
})

function pct(v: number) {
  return `${Math.round(v * 10000) / 100}%`
}
function day(d?: string | null) {
  return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

async function saveSettings() {
  busy.value = true
  notice.value = ''
  try {
    await $fetch('/api/cta/admin/settings', { method: 'PUT', body: { mode: mode.value, minImpressionsPerVariant: minSample.value, durationDays: durationDays.value } })
    notice.value = 'Settings saved.'
    await load()
  } catch {
    notice.value = 'Saving settings failed.'
  } finally {
    busy.value = false
  }
}

async function finishTest(force = false) {
  if (!force && !window.confirm('Finish the test now? Each section locks to its own winner and the test moves to the changelog.')) return
  busy.value = true
  notice.value = ''
  finishBlocked.value = null
  try {
    const res: any = await $fetch('/api/cta/admin/finish', { method: 'POST', body: { force } })
    if (res.ok) {
      notice.value = 'Test finished: every section now shows its winner (see Active custom CTAs; delete any to revert).'
      await load()
    } else if (res.reason === 'min_sample') {
      finishBlocked.value = res.detail
    }
  } catch (err: any) {
    notice.value = err?.statusMessage || 'Finishing the test failed.'
  } finally {
    busy.value = false
  }
}

async function stopTest() {
  if (!window.confirm('Stop the test WITHOUT winners? Every rotating section reverts to its default text.')) return
  busy.value = true
  notice.value = ''
  try {
    await $fetch('/api/cta/admin/stop', { method: 'POST' })
    notice.value = 'Test stopped: rotating sections show their default texts again.'
    await load()
  } catch (err: any) {
    notice.value = err?.statusMessage || 'Stopping the test failed.'
  } finally {
    busy.value = false
  }
}

const canStart = computed(() => newTexts.value.every((t) => t.trim().length > 0 && t.trim().length <= 60))

async function startTest() {
  if (!canStart.value) return
  busy.value = true
  notice.value = ''
  try {
    await $fetch('/api/cta/admin/start', { method: 'POST', body: { texts: newTexts.value.map((t) => t.trim()) } })
    notice.value = 'A/B test started: visitors now split 33/33/33 across the three texts.'
    newTexts.value = ['', '', '']
    showStart.value = false
    await load()
  } catch (err: any) {
    notice.value = err?.statusMessage || 'Starting the test failed.'
  } finally {
    busy.value = false
  }
}

async function saveOverridesMap(map: Record<string, string>) {
  await $fetch('/api/cta/admin/settings', { method: 'PUT', body: { surfaceOverrides: map } })
  await load()
}

function openNavbarModal() {
  navbarText.value = overview.value?.surfaceOverrides?.['header'] || ''
  showNavbar.value = true
}

async function saveNavbar() {
  busy.value = true
  try {
    const map = { ...(overview.value?.surfaceOverrides || {}) }
    if (navbarText.value.trim()) map['header'] = navbarText.value.trim()
    else delete map['header']
    await saveOverridesMap(map)
    notice.value = 'Navbar CTA saved.'
    showNavbar.value = false
  } catch {
    notice.value = 'Saving the navbar CTA failed.'
  } finally {
    busy.value = false
  }
}

function overrideKeyFor(surface: string) {
  return selectedPagePath.value === 'all' ? surface : `${surface}@${selectedPagePath.value}`
}

function openPageModal() {
  const o = overview.value?.surfaceOverrides || {}
  pageTexts.value = Object.fromEntries(selectedPage.value.sections.map((s) => [s, o[overrideKeyFor(s)] || '']))
  showPage.value = true
}

async function savePage() {
  busy.value = true
  try {
    const map = { ...(overview.value?.surfaceOverrides || {}) }
    for (const s of selectedPage.value.sections) {
      const key = overrideKeyFor(s)
      const text = (pageTexts.value[s] || '').trim()
      if (text) map[key] = text
      else delete map[key]
    }
    await saveOverridesMap(map)
    notice.value = `Custom CTAs saved for ${selectedPage.value.label}.`
    showPage.value = false
  } catch {
    notice.value = 'Saving the custom CTAs failed.'
  } finally {
    busy.value = false
  }
}

async function deleteCustom(key: string) {
  if (!window.confirm('Remove this custom CTA? The section reverts to the test / default text.')) return
  busy.value = true
  try {
    const map = { ...(overview.value?.surfaceOverrides || {}) }
    delete map[key]
    await saveOverridesMap(map)
    notice.value = 'Custom CTA removed: that section reverted.'
  } catch {
    notice.value = 'Removing the custom CTA failed.'
  } finally {
    busy.value = false
  }
}

onMounted(load)
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="cta-admin">
    <h1>A/B CTA Testing</h1>
    <p class="cta-intro">
      Test 3 CTA texts against each other. After {{ overview?.settings?.durationDays ?? 10 }} days
      (or whenever you finish manually), every section keeps the text that performed best on that
      exact section: forms by conversions, buttons by clicks.
    </p>

    <p v-if="loadError" class="cta-banner cta-banner--error">{{ loadError }}</p>
    <p v-else-if="banner" class="cta-banner">{{ banner }}</p>
    <p v-if="notice" class="cta-notice">{{ notice }}</p>

    <!-- Current test analytics -->
    <section v-if="overview?.current" class="cta-card">
      <div class="cta-card__head">
        <h2>Running Test</h2>
        <span class="cta-phase">33 / 33 / 33</span>
      </div>
      <p class="cta-meta">
        Started {{ day(overview.current.experiment.started_at) }} ·
        auto-finish {{ overview.settings.mode === 'auto' ? day(overview.current.endsAt) : 'off (manual)' }}
      </p>

      <table class="cta-table">
        <thead><tr><th>CTA text</th><th>Impressions</th><th>Conversions</th><th>CVR</th></tr></thead>
        <tbody>
          <tr v-for="v in overview.current.variants" :key="v.variantId">
            <td>{{ v.text }}</td>
            <td>{{ v.impressions }}</td>
            <td>{{ v.conversions }}</td>
            <td>{{ pct(v.cvr) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="cta-chart"><canvas ref="chartEl" aria-label="Conversion rate per CTA variant" /></div>

      <h3 class="cta-subhead">Current Leader Per Section</h3>
      <div class="cta-leaders">
        <span v-for="l in overview.current.sectionLeaders" :key="l.surface" class="cta-leader" :title="l.metric === 'overall' ? 'No section data yet: overall leader shown' : `by ${l.metric}`">
          {{ SURFACES[l.surface]?.label || l.surface }}: <strong>{{ l.winnerText }}</strong>
        </span>
      </div>

      <div class="cta-controls">
        <button class="cta-btn cta-btn--primary" :disabled="busy" @click="finishTest(false)">Finish test now</button>
        <button class="cta-btn cta-btn--danger" :disabled="busy" @click="stopTest">Stop without winners</button>
      </div>

      <div v-if="finishBlocked" class="cta-banner cta-banner--error">
        <p>
          Finish blocked: minimum is {{ finishBlocked.minimum }} impressions per variant.
          <span v-for="u in finishBlocked.underSampled" :key="u.text">"{{ u.text }}" has {{ u.impressions }}. </span>
        </p>
        <button class="cta-btn" :disabled="busy" @click="finishTest(true)">Finish anyway</button>
      </div>
    </section>

    <!-- Start / settings -->
    <section class="cta-card">
      <div class="cta-card__head">
        <h2>Test Controls</h2>
        <button v-if="!overview?.current" class="cta-btn cta-btn--primary" @click="showStart = true">Start new A/B test</button>
      </div>
      <div class="cta-settings">
        <label>
          Finish mode
          <select v-model="mode">
            <option value="manual">Manual (I press Finish)</option>
            <option value="auto">Automatic (after the test length)</option>
          </select>
        </label>
        <label>
          Test length (days)
          <input v-model.number="durationDays" type="number" min="1" max="90" />
        </label>
        <label>
          Min impressions per text
          <input v-model.number="minSample" type="number" min="0" max="100000" />
        </label>
        <button class="cta-btn" :disabled="busy" @click="saveSettings">Save settings</button>
      </div>
    </section>

    <!-- Custom CTAs -->
    <section class="cta-card">
      <h2>Custom CTA Texts</h2>
      <p class="cta-meta">
        Change individual CTAs without a test. Custom texts always win over the A/B test; delete one
        and that section reverts to the test / default.
      </p>
      <div class="cta-controls">
        <button class="cta-btn" @click="openNavbarModal">Change navbar CTA</button>
        <div class="cta-pagepick">
          <select v-model="selectedPagePath">
            <option v-for="p in PAGES" :key="p.path" :value="p.path">{{ p.label }}</option>
          </select>
          <button class="cta-btn" @click="openPageModal">Change CTAs on this page</button>
        </div>
      </div>

      <h3 class="cta-subhead">Active Custom CTAs</h3>
      <p v-if="!activeCustom.length" class="cta-meta">None: everything follows the test / defaults.</p>
      <div v-for="row in activeCustom" :key="row.key" class="cta-rule">
        <span><strong>{{ row.sectionLabel }}</strong> · {{ row.pageLabel }} → "{{ row.text }}"</span>
        <button class="cta-rule__remove" title="Remove and revert" :disabled="busy" @click="deleteCustom(row.key)">×</button>
      </div>
    </section>

    <!-- Changelog -->
    <section class="cta-card">
      <h2>Changelog</h2>
      <p v-if="!overview?.changelog?.length" class="cta-meta">No finished tests yet.</p>
      <details v-for="block in overview?.changelog || []" :key="block.experiment.id" class="cta-log">
        <summary>
          <strong>{{ block.experiment.month }}</strong>
          · {{ day(block.experiment.started_at) }} to {{ day(block.experiment.archived_at) }}
        </summary>
        <table class="cta-table">
          <thead><tr><th>CTA text</th><th>Impressions</th><th>Conversions</th><th>CVR</th></tr></thead>
          <tbody>
            <tr v-for="v in block.variants" :key="v.variantId">
              <td>{{ v.text }}</td>
              <td>{{ v.impressions }}</td>
              <td>{{ v.conversions }}</td>
              <td>{{ pct(v.cvr) }}</td>
            </tr>
          </tbody>
        </table>
      </details>
    </section>

    <!-- ============ MODALS ============ -->
    <div v-if="showStart" class="cta-modal-backdrop" @click.self="showStart = false">
      <div class="cta-modal">
        <h2>Start A/B Test</h2>
        <p class="cta-meta">3 texts, 60 characters max. They show on every rotating section, so keep them neutral.</p>
        <div v-for="(t, i) in newTexts" :key="i" class="cta-input-row">
          <input v-model="newTexts[i]" type="text" maxlength="60" :placeholder="`CTA text ${i + 1}`" />
          <span class="cta-count">{{ (newTexts[i] || '').trim().length }}/60</span>
        </div>
        <div v-if="newTexts.some((t) => t.trim())" class="cta-preview">
          <button v-for="(t, i) in newTexts.filter((x) => x.trim())" :key="i" type="button" class="brand-btn brand-btn--orange cta-preview-btn">{{ t.trim() }}</button>
        </div>
        <div class="cta-modal__actions">
          <button class="cta-btn" @click="showStart = false">Cancel</button>
          <button class="cta-btn cta-btn--primary" :disabled="busy || !canStart" @click="startTest">Start test (33/33/33)</button>
        </div>
      </div>
    </div>

    <div v-if="showNavbar" class="cta-modal-backdrop" @click.self="showNavbar = false">
      <div class="cta-modal">
        <h2>Navbar CTA</h2>
        <p class="cta-meta">The button in the site header, on every page. Default: "{{ SURFACES['header']!.fallback }}". Leave blank to follow the test / default.</p>
        <div class="cta-input-row">
          <input v-model="navbarText" type="text" maxlength="60" placeholder="Custom navbar text" />
          <span class="cta-count">{{ navbarText.trim().length }}/60</span>
        </div>
        <div v-if="navbarText.trim()" class="cta-preview">
          <button type="button" class="brand-btn brand-btn--orange cta-preview-btn">{{ navbarText.trim() }}</button>
        </div>
        <div class="cta-modal__actions">
          <button class="cta-btn" @click="showNavbar = false">Cancel</button>
          <button class="cta-btn cta-btn--primary" :disabled="busy" @click="saveNavbar">Save</button>
        </div>
      </div>
    </div>

    <div v-if="showPage" class="cta-modal-backdrop" @click.self="showPage = false">
      <div class="cta-modal">
        <h2>{{ selectedPage.label }}</h2>
        <p class="cta-meta">Every CTA section on this page. Fill in only what you want to change; blank fields follow the test / default.</p>
        <div v-for="s in selectedPage.sections" :key="s" class="cta-input-row">
          <label class="cta-surface-label">
            {{ SURFACES[s]?.label || s }}
            <small>default: {{ SURFACES[s]?.fallback }}</small>
          </label>
          <input v-model="pageTexts[s]" type="text" maxlength="60" placeholder="Follows test / default" />
        </div>
        <div class="cta-modal__actions">
          <button class="cta-btn" @click="showPage = false">Cancel</button>
          <button class="cta-btn cta-btn--primary" :disabled="busy" @click="savePage">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cta-admin h1 { margin-bottom: 6px; }
.cta-intro { color: #666; margin-bottom: 18px; max-width: 72ch; }

.cta-banner { background: #fff7e6; border: 1px solid #f0d9a8; border-radius: 10px; padding: 12px 16px; margin-bottom: 14px; }
.cta-banner--error { background: #fef2f2; border-color: #f5c2c2; }
.cta-notice { background: #eefaf0; border: 1px solid #bfe3c6; border-radius: 10px; padding: 10px 16px; margin-bottom: 14px; }

.cta-card { background: #fff; border: 1px solid #e8e5dd; border-radius: 12px; padding: 22px 24px; margin-bottom: 20px; }
.cta-card__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 4px; }
.cta-card h2 { font-size: 1.2rem; margin: 0; }
.cta-phase { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; padding: 4px 10px; border-radius: 999px; background: #e8f0e4; color: #014520; }
.cta-meta { color: #777; font-size: 0.88rem; margin: 4px 0 12px; }
.cta-subhead { font-size: 1rem; margin: 18px 0 8px; }

.cta-table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 0.92rem; }
.cta-table th, .cta-table td { border-bottom: 1px solid #eee9df; padding: 8px 10px; text-align: left; }
.cta-table th { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: #888; }

.cta-chart { height: 170px; margin-bottom: 8px; }

.cta-leaders { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.cta-leader { background: #faf8f2; border: 1px solid #eee9df; border-radius: 999px; padding: 5px 12px; font-size: 0.82rem; color: #555; }

.cta-controls { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 6px; }
.cta-settings { display: flex; gap: 14px; align-items: flex-end; flex-wrap: wrap; margin-top: 10px; }
.cta-settings label { display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem; color: #555; }
.cta-settings select, .cta-settings input { border: 1px solid #ddd8cc; border-radius: 8px; padding: 8px 10px; font: inherit; min-width: 120px; }

.cta-btn { border: 1px solid #cfc9bb; background: #fff; border-radius: 999px; padding: 9px 20px; font: inherit; font-weight: 600; cursor: pointer; }
.cta-btn--primary { background: #014520; border-color: #014520; color: #fffcf6; }
.cta-btn--danger { border-color: #d9a1a1; color: #b91c1c; }
.cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.cta-pagepick { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.cta-pagepick select { border: 1px solid #ddd8cc; border-radius: 8px; padding: 8px 10px; font: inherit; max-width: 320px; }

.cta-input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cta-input-row input { flex: 1; border: 1px solid #ddd8cc; border-radius: 8px; padding: 10px 12px; font: inherit; }
.cta-count { font-size: 0.78rem; color: #999; width: 46px; text-align: right; }
.cta-surface-label { display: flex; flex-direction: column; width: 220px; flex: none; font-size: 0.86rem; font-weight: 600; }
.cta-surface-label small { font-weight: 400; color: #999; }
.cta-preview { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 6px 0 14px; }
.cta-preview-btn { pointer-events: none; }

.cta-rule { display: flex; align-items: center; justify-content: space-between; gap: 10px; background: #faf8f2; border: 1px solid #eee9df; border-radius: 8px; padding: 8px 12px; margin-bottom: 6px; font-size: 0.9rem; }
.cta-rule__remove { border: none; background: none; color: #b91c1c; font-size: 1.1rem; cursor: pointer; line-height: 1; }

.cta-log { border-top: 1px solid #eee9df; padding: 10px 0; }
.cta-log summary { cursor: pointer; font-size: 0.95rem; }

.cta-modal-backdrop { position: fixed; inset: 0; z-index: 400; background: rgba(20, 30, 24, 0.45); display: flex; align-items: center; justify-content: center; padding: 20px; }
.cta-modal { background: #fff; border-radius: 14px; padding: 24px 26px; width: min(100%, 640px); max-height: 90vh; overflow-y: auto; box-shadow: 0 18px 42px rgba(0, 0, 0, 0.2); }
.cta-modal h2 { margin: 0 0 4px; font-size: 1.15rem; }
.cta-modal__actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 16px; }
</style>
