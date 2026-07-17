<script setup lang="ts">
/**
 * CTA Experiments dashboard — monthly CTA text rotation (A/B).
 * Current experiment with live stats, promote controls (manual/auto),
 * a form to start next month's 3 CTAs, and the changelog of past sets.
 */
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

definePageMeta({ layout: 'admin' })

type VariantRow = {
  variantId: string
  text: string
  weight: number
  isWinner: boolean
  sortOrder: number
  impressions: number
  conversions: number
  cvr: number
}
type ExperimentBlock = {
  experiment: { id: string; month: string; phase: string; needs_attention?: string | null; started_at: string; promoted_at?: string | null; archived_at?: string | null }
  variants: VariantRow[]
}
type Overview = {
  settings: { mode: 'manual' | 'auto'; minImpressionsPerVariant: number }
  currentMonth: string
  current: ExperimentBlock | null
  changelog: ExperimentBlock[]
}

const overview = ref<Overview | null>(null)
const loadError = ref('')
const busy = ref(false)
const notice = ref('')

// controls state
const mode = ref<'manual' | 'auto'>('manual')
const minSample = ref(100)

// start-new-set form
const newTexts = ref(['', '', ''])
const startConfirm = ref(false)

// promote flow
const promoteBlocked = ref<{ minimum: number; underSampled: { text: string; impressions: number }[] } | null>(null)

const chartEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null

async function load() {
  loadError.value = ''
  try {
    const data = await $fetch<Overview>('/api/cta/admin/overview')
    overview.value = data
    mode.value = data.settings.mode
    minSample.value = data.settings.minImpressionsPerVariant
    await nextTick()
    renderChart()
  } catch (err: any) {
    loadError.value = err?.statusMessage || 'Could not load the CTA overview.'
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
      datasets: [
        {
          label: 'Conversion rate',
          data: rows.map((v) => Math.round(v.cvr * 10000) / 100),
          backgroundColor: rows.map((v) => (v.isWinner ? '#eb3d00' : '#3B8949')),
          borderRadius: 4,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (ctx: any) => `${ctx.parsed.x}% CVR` } },
      },
      scales: {
        x: { beginAtZero: true, ticks: { callback: (v: any) => `${v}%` } },
        y: { ticks: { font: { size: 11 } } },
      },
    },
  })
}

const banner = computed(() => {
  const o = overview.value
  if (!o) return null
  if (!o.current) return 'No CTA experiment is running: the site is showing its default button texts. Enter 3 CTAs below to start.'
  if (o.current.experiment.needs_attention) return o.current.experiment.needs_attention
  if (o.current.experiment.month < o.currentMonth && o.current.experiment.phase !== 'exploring') {
    return `This set started in ${o.current.experiment.month}. Enter this month's 3 new CTAs when ready.`
  }
  return null
})

const phaseLabel = computed(() => {
  const p = overview.value?.current?.experiment.phase
  if (p === 'exploring') return 'EXPLORING 33/33/33'
  if (p === 'exploiting') return 'EXPLOITING 80/10/10'
  if (p === 'carryover') return 'CARRYOVER (winner at 100%)'
  return p?.toUpperCase() || ''
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
    await $fetch('/api/cta/admin/settings', {
      method: 'PUT',
      body: { mode: mode.value, minImpressionsPerVariant: minSample.value },
    })
    notice.value = 'Settings saved.'
    await load()
  } catch {
    notice.value = 'Saving settings failed.'
  } finally {
    busy.value = false
  }
}

async function promote(force = false) {
  busy.value = true
  notice.value = ''
  promoteBlocked.value = null
  try {
    const res: any = await $fetch('/api/cta/admin/promote', { method: 'POST', body: { force } })
    if (res.ok) {
      notice.value = 'Winner promoted: weights are now 80/10/10.'
      await load()
    } else if (res.reason === 'min_sample') {
      promoteBlocked.value = res.detail
    }
  } catch (err: any) {
    notice.value = err?.statusMessage || 'Promotion failed.'
  } finally {
    busy.value = false
  }
}

async function stopExperiment() {
  if (!window.confirm('Stop this experiment? Every CTA on the site reverts to its default text, and this set moves to the changelog.')) return
  busy.value = true
  notice.value = ''
  try {
    await $fetch('/api/cta/admin/stop', { method: 'POST' })
    notice.value = 'Experiment stopped: the site is showing its default CTA texts again.'
    await load()
  } catch (err: any) {
    notice.value = err?.statusMessage || 'Stopping the experiment failed.'
  } finally {
    busy.value = false
  }
}

const canStart = computed(() => newTexts.value.every((t) => t.trim().length > 0 && t.trim().length <= 60))

async function startNewSet() {
  if (!canStart.value) return
  busy.value = true
  notice.value = ''
  try {
    await $fetch('/api/cta/admin/start', { method: 'POST', body: { texts: newTexts.value.map((t) => t.trim()) } })
    notice.value = 'New experiment started at 33/33/33. The previous set is archived in the changelog.'
    newTexts.value = ['', '', '']
    startConfirm.value = false
    await load()
  } catch (err: any) {
    notice.value = err?.statusMessage || 'Starting the experiment failed.'
  } finally {
    busy.value = false
  }
}

onMounted(load)
onBeforeUnmount(() => chart?.destroy())
</script>

<template>
  <div class="cta-admin">
    <h1>CTA Experiments</h1>
    <p class="cta-intro">
      Three CTA texts rotate across every contact button on the site. Visitors split 33/33/33;
      the best converter gets promoted to 80% (manually below, or automatically on the 1st of the month).
    </p>

    <p v-if="loadError" class="cta-banner cta-banner--error">{{ loadError }}</p>
    <p v-else-if="banner" class="cta-banner">{{ banner }}</p>
    <p v-if="notice" class="cta-notice">{{ notice }}</p>

    <!-- Current experiment -->
    <section v-if="overview?.current" class="cta-card">
      <div class="cta-card__head">
        <h2>Current experiment — {{ overview.current.experiment.month }}</h2>
        <span class="cta-phase" :data-phase="overview.current.experiment.phase">{{ phaseLabel }}</span>
      </div>
      <p class="cta-meta">
        Started {{ day(overview.current.experiment.started_at) }}
        <template v-if="overview.current.experiment.promoted_at"> · promoted {{ day(overview.current.experiment.promoted_at) }}</template>
      </p>

      <table class="cta-table">
        <thead>
          <tr><th>CTA text</th><th>Weight</th><th>Impressions</th><th>Conversions</th><th>CVR</th></tr>
        </thead>
        <tbody>
          <tr v-for="v in overview.current.variants" :key="v.variantId" :class="{ 'is-winner': v.isWinner }">
            <td>{{ v.text }} <span v-if="v.isWinner" title="Current winner">★</span></td>
            <td>{{ Math.round(v.weight * 100) / 100 }}%</td>
            <td>{{ v.impressions }}</td>
            <td>{{ v.conversions }}</td>
            <td>{{ pct(v.cvr) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="cta-chart"><canvas ref="chartEl" aria-label="Conversion rate per CTA variant" /></div>

      <div class="cta-controls">
        <button
          v-if="overview.current.experiment.phase === 'exploring'"
          class="cta-btn cta-btn--primary"
          :disabled="busy"
          @click="promote(false)"
        >
          Promote winner now
        </button>
        <button class="cta-btn cta-btn--danger" :disabled="busy" @click="stopExperiment">
          Stop &amp; revert to default texts
        </button>
        <div class="cta-settings">
          <label>
            Promotion mode
            <select v-model="mode">
              <option value="manual">Manual (I press the button)</option>
              <option value="auto">Automatic (1st of the month)</option>
            </select>
          </label>
          <label>
            Min impressions per variant
            <input v-model.number="minSample" type="number" min="0" max="100000" />
          </label>
          <button class="cta-btn" :disabled="busy" @click="saveSettings">Save settings</button>
        </div>
      </div>

      <div v-if="promoteBlocked" class="cta-banner cta-banner--error">
        <p>
          Promotion blocked: minimum is {{ promoteBlocked.minimum }} impressions per variant.
          <span v-for="u in promoteBlocked.underSampled" :key="u.text">"{{ u.text }}" has {{ u.impressions }}. </span>
        </p>
        <button class="cta-btn" :disabled="busy" @click="promote(true)">Promote anyway</button>
      </div>
    </section>

    <!-- Start a new set -->
    <section class="cta-card">
      <h2>Start {{ overview?.current ? 'next' : 'the first' }} CTA set</h2>
      <p class="cta-meta">
        Exactly 3 texts, 60 characters max. The same text shows on form submit buttons, the header
        button and the consultation band, so keep it neutral (e.g. "Book a free consultation").
      </p>
      <div v-for="(t, i) in newTexts" :key="i" class="cta-input-row">
        <input v-model="newTexts[i]" type="text" maxlength="60" :placeholder="`CTA text ${i + 1}`" />
        <span class="cta-count">{{ (newTexts[i] || '').trim().length }}/60</span>
      </div>
      <div v-if="newTexts.some((t) => t.trim())" class="cta-preview">
        <span class="cta-meta">Preview:</span>
        <button v-for="(t, i) in newTexts.filter((x) => x.trim())" :key="i" type="button" class="brand-btn brand-btn--orange cta-preview-btn">
          {{ t.trim() }}
        </button>
      </div>
      <div class="cta-start">
        <label v-if="overview?.current" class="cta-confirm">
          <input v-model="startConfirm" type="checkbox" />
          I understand this archives the current experiment
        </label>
        <button
          class="cta-btn cta-btn--primary"
          :disabled="busy || !canStart || (!!overview?.current && !startConfirm)"
          @click="startNewSet"
        >
          Start experiment (33/33/33)
        </button>
      </div>
    </section>

    <!-- Changelog -->
    <section class="cta-card">
      <h2>Changelog</h2>
      <p v-if="!overview?.changelog?.length" class="cta-meta">No archived experiments yet.</p>
      <details v-for="block in overview?.changelog || []" :key="block.experiment.id" class="cta-log">
        <summary>
          <strong>{{ block.experiment.month }}</strong>
          · {{ day(block.experiment.started_at) }} to {{ day(block.experiment.archived_at) }}
          · winner: {{ block.variants.find((v) => v.isWinner)?.text || [...block.variants].sort((a, b) => b.cvr - a.cvr)[0]?.text || '-' }}
        </summary>
        <table class="cta-table">
          <thead>
            <tr><th>CTA text</th><th>Final weight</th><th>Impressions</th><th>Conversions</th><th>CVR</th></tr>
          </thead>
          <tbody>
            <tr v-for="v in block.variants" :key="v.variantId" :class="{ 'is-winner': v.isWinner }">
              <td>{{ v.text }} <span v-if="v.isWinner">★</span></td>
              <td>{{ Math.round(v.weight * 100) / 100 }}%</td>
              <td>{{ v.impressions }}</td>
              <td>{{ v.conversions }}</td>
              <td>{{ pct(v.cvr) }}</td>
            </tr>
          </tbody>
        </table>
      </details>
    </section>
  </div>
</template>

<style scoped>
.cta-admin h1 { margin-bottom: 6px; }
.cta-intro { color: #666; margin-bottom: 18px; max-width: 70ch; }

.cta-banner {
  background: #fff7e6;
  border: 1px solid #f0d9a8;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 14px;
}
.cta-banner--error { background: #fef2f2; border-color: #f5c2c2; }
.cta-notice {
  background: #eefaf0;
  border: 1px solid #bfe3c6;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 14px;
}

.cta-card {
  background: #fff;
  border: 1px solid #e8e5dd;
  border-radius: 12px;
  padding: 22px 24px;
  margin-bottom: 20px;
}
.cta-card__head { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.cta-card h2 { font-size: 1.2rem; margin: 0 0 4px; }
.cta-phase {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e8f0e4;
  color: #014520;
}
.cta-phase[data-phase='exploiting'] { background: #fdeee6; color: #b93000; }
.cta-phase[data-phase='carryover'] { background: #fff7e6; color: #8a6a1f; }
.cta-meta { color: #777; font-size: 0.88rem; margin: 2px 0 12px; }

.cta-table { width: 100%; border-collapse: collapse; margin: 8px 0 16px; font-size: 0.92rem; }
.cta-table th, .cta-table td { border-bottom: 1px solid #eee9df; padding: 8px 10px; text-align: left; }
.cta-table th { font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; color: #888; }
.cta-table tr.is-winner td { background: #fdf7ef; font-weight: 600; }

.cta-chart { height: 170px; margin-bottom: 16px; }

.cta-controls { display: flex; gap: 20px; align-items: flex-end; flex-wrap: wrap; }
.cta-settings { display: flex; gap: 14px; align-items: flex-end; flex-wrap: wrap; }
.cta-settings label { display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem; color: #555; }
.cta-settings select, .cta-settings input {
  border: 1px solid #ddd8cc;
  border-radius: 8px;
  padding: 8px 10px;
  font: inherit;
  min-width: 120px;
}

.cta-btn {
  border: 1px solid #cfc9bb;
  background: #fff;
  border-radius: 999px;
  padding: 9px 20px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}
.cta-btn--primary { background: #014520; border-color: #014520; color: #fffcf6; }
.cta-btn--danger { border-color: #d9a1a1; color: #b91c1c; }
.cta-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.cta-input-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.cta-input-row input {
  flex: 1;
  border: 1px solid #ddd8cc;
  border-radius: 8px;
  padding: 10px 12px;
  font: inherit;
}
.cta-count { font-size: 0.78rem; color: #999; width: 46px; text-align: right; }
.cta-preview { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin: 6px 0 14px; }
.cta-preview-btn { pointer-events: none; }
.cta-start { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; }
.cta-confirm { display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: #555; }

.cta-log { border-top: 1px solid #eee9df; padding: 10px 0; }
.cta-log summary { cursor: pointer; font-size: 0.95rem; }
</style>
