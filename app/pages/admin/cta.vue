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
const SURFACES: Record<string, { label: string; fallback: string; hint: string }> = {
  'header': { label: 'Navbar button', fallback: 'Contact Us', hint: 'The orange button in the site header, visible on every page. Clicking it OPENS the contact popup (the button inside the popup is "Contact popup submit").' },
  'footer': { label: 'Footer button', fallback: 'Contact Us', hint: 'The contact button in the site footer, visible on every page. Clicking it opens the contact popup.' },
  'hero-form': { label: 'Home hero form submit', fallback: 'Speak to our team', hint: 'The submit button inside the estimate form at the top of the home page (desktop/tablet only; phones show the mobile hero button instead).' },
  'mobile-hero': { label: 'Mobile hero button (opens popup)', fallback: 'Speak to our team', hint: 'The orange button on the home hero on PHONES. It OPENS the contact popup; the button inside the popup is controlled separately by "Contact popup submit".' },
  'footer-form': { label: 'Footer form submit', fallback: 'Speak to our team', hint: 'The submit button inside the big form at the bottom of most pages ("Ready To Hire Smarter?").' },
  'popup-form': { label: 'Contact popup submit', fallback: 'Speak to our team', hint: 'The submit button INSIDE the popup contact form (opened by the navbar/footer/mobile-hero buttons) and on the contact page form. Separate from the buttons that open the popup.' },
  'page-forms': { label: 'Service/insight page form submit', fallback: 'Speak to our team', hint: 'The submit button inside the estimate forms on service pages and staffing-insight pages.' },
  'cta-band': { label: 'Consultation band', fallback: 'Schedule a free consultation', hint: 'The outlined button in the green "Ready to cut hiring costs by up to 60%?" band that appears across most pages. Links to the contact page.' },
  'salary-tool': { label: 'Salary tool button', fallback: 'Speak to an Expert', hint: 'The orange button under the salary benchmarking results (home page and tools page). Links to the contact page.' },
  'service-buttons': { label: 'Service page contact buttons', fallback: 'Contact us', hint: 'The outlined buttons inside the Overview cards on each service page. They open the contact popup.' },
  'tools-page': { label: 'Tools page buttons', fallback: 'Contact us', hint: 'The contact buttons on the salary benchmarking tool page. They open the contact popup.' },
  'how-it-works': { label: 'How It Works button', fallback: 'Lets get started', hint: 'The outlined button at the bottom of the How It Works card on the home page. Links to the contact page.' },
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
const showChangelog = ref(false)
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
      datasets: [{
        label: 'Conversion rate',
        data: rows.map((v) => Math.round(v.cvr * 10000) / 100),
        // the current CVR leader carries the live accent
        backgroundColor: (() => {
          const top = Math.max(...rows.map((v) => v.cvr))
          return rows.map((v) => (v.cvr === top && top > 0 ? '#eb3d00' : '#3B8949'))
        })(),
        borderRadius: 4,
      }],
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

const banner = computed(() => overview.value?.current?.experiment.needs_attention || null)

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
    <section v-if="overview?.current" class="cta-card cta-card--live">
      <div class="cta-card__head">
        <h2><span class="cta-live-dot" aria-hidden="true" /> Running Test</h2>
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
        <span v-for="l in overview.current.sectionLeaders" :key="l.surface" class="cta-leader">
          <span>{{ SURFACES[l.surface]?.label || l.surface }}</span>
          <strong>{{ l.winnerText }}</strong>
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
      </div>
      <div v-if="!overview?.current" class="cta-empty">
        <p>No A/B test is running. Start one to rotate three texts across every CTA on the site.</p>
        <button class="cta-btn cta-btn--primary" @click="showStart = true">Start new A/B test</button>
      </div>
      <div class="cta-divider" />
      <div class="cta-settings">
        <label>
          <span class="cta-label">Finish mode</span>
          <select v-model="mode">
            <option value="manual">Manual (I press Finish)</option>
            <option value="auto">Automatic (after the test length)</option>
          </select>
        </label>
        <label>
          <span class="cta-label">Test length (days)</span>
          <input v-model.number="durationDays" type="number" min="1" max="90" />
        </label>
        <label>
          <span class="cta-label">Min impressions per text</span>
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
      <div class="cta-toolbar">
        <button class="cta-btn" @click="openNavbarModal">Change navbar CTA</button>
        <span class="cta-toolbar__or">or</span>
        <select v-model="selectedPagePath">
          <option v-for="p in PAGES" :key="p.path" :value="p.path">{{ p.label }}</option>
        </select>
        <button class="cta-btn" @click="openPageModal">Change CTAs on this page</button>
      </div>

      <div class="cta-divider" />
      <h3 class="cta-subhead">Active Custom CTAs</h3>
      <p v-if="!activeCustom.length" class="cta-meta">None: everything follows the test / defaults.</p>
      <div v-for="row in activeCustom" :key="row.key" class="cta-rule">
        <span>
          <strong>{{ row.sectionLabel }}</strong>
          · {{ row.pageLabel }} → "{{ row.text }}"
        </span>
        <button class="cta-rule__remove" title="Remove and revert" :disabled="busy" @click="deleteCustom(row.key)">×</button>
      </div>
    </section>

    <!-- Changelog -->
    <section class="cta-card">
      <div class="cta-card__head">
        <h2>Changelog</h2>
        <button class="cta-btn" @click="showChangelog = true">View changelog</button>
      </div>
      <p class="cta-meta">
        {{ overview?.changelog?.length
          ? `${overview.changelog.length} finished test${overview.changelog.length === 1 ? '' : 's'} with final results.`
          : 'No finished tests yet.' }}
      </p>
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
        <p class="cta-meta">{{ SURFACES['header']!.hint }} Default: "{{ SURFACES['header']!.fallback }}". Leave blank to follow the test / default.</p>
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

    <div v-if="showChangelog" class="cta-modal-backdrop" @click.self="showChangelog = false">
      <div class="cta-modal">
        <h2>Changelog</h2>
        <p class="cta-meta">Every finished A/B test with its final numbers, newest first.</p>
        <p v-if="!overview?.changelog?.length" class="cta-meta">No finished tests yet.</p>
        <div v-for="block in overview?.changelog || []" :key="block.experiment.id" class="cta-log">
          <p class="cta-log__head">
            <strong>{{ block.experiment.month }}</strong>
            · {{ day(block.experiment.started_at) }} to {{ day(block.experiment.archived_at) }}
          </p>
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
        </div>
        <div class="cta-modal__actions">
          <button class="cta-btn" @click="showChangelog = false">Close</button>
        </div>
      </div>
    </div>

    <div v-if="showPage" class="cta-modal-backdrop" @click.self="showPage = false">
      <div class="cta-modal">
        <h2>{{ selectedPage.label }}</h2>
        <p class="cta-meta">Every CTA section on this page. Fill in only what you want to change; blank fields follow the test / default.</p>
        <div v-for="s in selectedPage.sections" :key="s" class="cta-input-row">
          <label class="cta-surface-label">
            <span>{{ SURFACES[s]?.label || s }}</span>
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
/* ============================================================
   A/B CTA Testing — design tokens
   canvas #f6f4ee · card #fff · hairline #e7e2d4 · ink #1c2520
   muted #71786f · green #014520 · tint #eef3ea · live #eb3d00
   column 920px · card pad 24 · card gap 20 · rhythm 16 · controls 38px
   ============================================================ */
.cta-admin {
  max-width: 920px;
  margin-inline: auto;
}
.cta-admin h1 {
  font-family: var(--serif);
  font-size: 1.9rem;
  margin-bottom: 8px;
  color: #1c2520;
}
.cta-intro { color: #71786f; margin-bottom: 24px; max-width: 62ch; line-height: 1.6; }

.cta-banner {
  background: #fff8ea;
  border: 1px solid #ecdcb2;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 0.92rem;
}
.cta-banner--error { background: #fdf3f2; border-color: #ecccc9; }
.cta-notice {
  background: #eef3ea;
  border: 1px solid #cfe0c8;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 0.92rem;
}

/* ---- cards ---- */
.cta-card {
  background: #fff;
  border: 1px solid #e7e2d4;
  border-radius: 14px;
  padding: 24px;
  margin-bottom: 20px;
}
/* the one loud thing on the page: the live test */
.cta-card--live { border-top: 3px solid #eb3d00; }
.cta-live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #eb3d00;
  margin-right: 2px;
  vertical-align: 2px;
}
.cta-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}
.cta-card h2 {
  font-family: var(--serif);
  font-size: 1.25rem;
  font-weight: 400;
  margin: 0;
  color: #1c2520;
}
.cta-phase {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 5px 12px;
  border-radius: 999px;
  background: #eef3ea;
  color: #014520;
}
.cta-meta { color: #71786f; font-size: 0.88rem; margin: 6px 0 16px; line-height: 1.55; }
.cta-subhead {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #71786f;
  margin: 0 0 10px;
}
.cta-divider { height: 1px; background: #eee9dc; margin: 20px 0; }

/* ---- empty state ---- */
.cta-empty {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.cta-empty p { margin: 0; color: #71786f; font-size: 0.92rem; max-width: 48ch; line-height: 1.55; }

/* ---- data table ---- */
.cta-table { width: 100%; border-collapse: collapse; margin: 0 0 20px; font-size: 0.92rem; }
.cta-table th, .cta-table td { border-bottom: 1px solid #eee9dc; padding: 10px 12px; text-align: left; }
.cta-table th:not(:first-child), .cta-table td:not(:first-child) { text-align: right; width: 120px; }
.cta-table td:not(:first-child) { font-variant-numeric: tabular-nums; }
.cta-table td:last-child { font-weight: 600; color: #014520; }
.cta-table th {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9aa094;
  font-weight: 600;
  padding-bottom: 8px;
}
.cta-table tbody tr:last-child td { border-bottom: none; }

.cta-chart { height: 180px; margin-bottom: 20px; }

/* ---- per-section leaders: aligned two-column ledger, not wrapping pills ---- */
.cta-leaders {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 32px;
  margin-bottom: 20px;
}
.cta-leader {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px dashed #eee9dc;
  font-size: 0.85rem;
  color: #71786f;
}
.cta-leader strong { color: #1c2520; font-weight: 600; text-align: right; }

/* ---- controls ---- */
.cta-controls { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.cta-toolbar { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
.cta-toolbar__or { color: #9aa094; font-size: 0.82rem; }
.cta-settings { display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap; }
.cta-settings label { display: flex; flex-direction: column; gap: 6px; }
.cta-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #71786f;
}

/* every interactive control is exactly 38px tall */
.cta-btn,
.cta-settings select,
.cta-settings input,
.cta-toolbar select,
.cta-input-row input {
  height: 38px;
  box-sizing: border-box;
  font: inherit;
  font-size: 0.9rem;
}
.cta-settings select, .cta-settings input, .cta-toolbar select {
  border: 1px solid #ddd6c6;
  border-radius: 10px;
  padding: 0 12px;
  background: #fff;
  min-width: 130px;
}
.cta-toolbar select { max-width: 320px; }
.cta-settings select:focus, .cta-settings input:focus, .cta-toolbar select:focus, .cta-input-row input:focus {
  outline: 2px solid rgba(1, 69, 32, 0.35);
  outline-offset: 1px;
}

/* one button family: green fill for primary, green outline otherwise */
.cta-btn {
  border: 1px solid #014520;
  background: #fff;
  color: #014520;
  border-radius: 999px;
  padding: 0 20px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}
.cta-btn:hover:not(:disabled) { background: #eef3ea; }
.cta-btn--primary { background: #014520; border-color: #014520; color: #fffcf6; }
.cta-btn--primary:hover:not(:disabled) { background: #0a5c30; }
.cta-btn--danger { border-color: #c26a6a; color: #b91c1c; }
.cta-btn--danger:hover:not(:disabled) { background: #fdf3f2; }
.cta-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.cta-btn:focus-visible { outline: 2px solid rgba(1, 69, 32, 0.45); outline-offset: 2px; }

/* ---- inputs in modals ---- */
.cta-input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
.cta-input-row input {
  flex: 1;
  border: 1px solid #ddd6c6;
  border-radius: 10px;
  padding: 0 12px;
}
.cta-count { font-size: 0.75rem; color: #9aa094; width: 44px; text-align: right; font-variant-numeric: tabular-nums; }
.cta-surface-label { display: flex; flex-direction: column; gap: 2px; width: 230px; flex: none; font-size: 0.86rem; font-weight: 600; color: #1c2520; }
.cta-surface-label small { font-weight: 400; color: #9aa094; font-size: 0.75rem; }
.cta-preview { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 4px 0 16px; }
.cta-preview-btn { pointer-events: none; }

/* ---- active custom CTA rows ---- */
.cta-rule {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #faf8f1;
  border: 1px solid #eee9dc;
  border-radius: 10px;
  padding: 10px 14px;
  margin-bottom: 8px;
  font-size: 0.9rem;
}
.cta-rule strong { color: #1c2520; }
.cta-rule__remove {
  border: none;
  background: none;
  color: #b91c1c;
  font-size: 1.15rem;
  cursor: pointer;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 6px;
}
.cta-rule__remove:hover { background: #fdf3f2; }

/* ---- changelog (inside the modal) ---- */
.cta-log { border-top: 1px solid #eee9dc; padding: 14px 0; }
.cta-log:first-of-type { border-top: none; padding-top: 4px; }
.cta-log__head { font-size: 0.92rem; color: #71786f; margin: 0 0 10px; }
.cta-log__head strong { color: #1c2520; }

/* ---- modals ---- */
.cta-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 400;
  background: rgba(22, 30, 25, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.cta-modal {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  width: min(100%, 620px);
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 56px rgba(0, 0, 0, 0.22);
}
.cta-modal h2 {
  font-family: var(--serif);
  font-weight: 400;
  margin: 0 0 4px;
  font-size: 1.3rem;
  color: #1c2520;
}
.cta-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee9dc;
}
</style>
