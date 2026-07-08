<script setup lang="ts">
/**
 * Salary Benchmarking Tool — ported from the user's WordPress plugin,
 * styled with the site's "Salary & Compensation Benchmarking CSS" (verbatim
 * class names and rules). Data converted from the plugin's SQL to JSON;
 * FX conversion via frankfurter.dev, matching the plugin's external FX API.
 */
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip)

type Bucket = { low: number; median: number; high: number; currency: string }
type SalaryData = {
  countries: { code: string; name: string }[]
  jobTitles: string[]
  benchmarks: Record<string, Record<string, Record<'annual' | 'monthly', Bucket>>>
}

const COLORS = ['#3B8949', '#1B3838', '#2d6b38']
const CURRENCIES = ['AED', 'AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'ILS', 'SAR', 'SGD', 'USD', 'ZAR']
const CURRENCY_SYMBOLS: Record<string, string> = {
  AED: 'AED', AUD: 'A$', CAD: 'C$', CHF: 'Fr', CNY: '¥', EUR: '€', GBP: '£',
  ILS: '₪', SAR: 'SAR', SGD: 'S$', USD: '$', ZAR: 'R',
}
const USD_PEGS: Record<string, number> = { AED: 3.6725, SAR: 3.75 }

const data = ref<SalaryData | null>(null)
const country = ref('ZA')
const jobTitle = ref('')
const currency = ref('GBP')
const period = ref<'monthly' | 'annual'>('annual') // defaults to annual; user can switch to monthly
const compare1 = ref('ZA')
const compare2 = ref('GB') // second compare country defaults to United Kingdom
const searched = ref(false)

// Country 1 always mirrors the main location field (updated plugin behaviour)
watch(country, (c) => {
  compare1.value = c
})

// Nicely formatted country names via Intl.DisplayNames (UK → GB handled)
function countryDisplayName(code: string, fallback?: string) {
  let cc = code ? code.toUpperCase().trim() : ''
  if (cc === 'UK') cc = 'GB'
  const fb = (fallback || '').trim()
  const fallbackLooksLikeCode = fb && fb.length <= 3 && /^[A-Z]+$/i.test(fb)
  if (fb && !fallbackLooksLikeCode) return fb
  if (/^[A-Z]{2}$/.test(cc) && typeof Intl !== 'undefined' && typeof Intl.DisplayNames === 'function') {
    try {
      const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(cc)
      if (name) return name
    } catch { /* fall through */ }
  }
  return fb || cc
}

const countryOptions = computed(() =>
  (data.value?.countries ?? []).map((c) => ({ code: c.code, name: countryDisplayName(c.code, c.name) })),
)
const loading = ref(false)
const errorMsg = ref('')
const legendItems = ref<{ color: string; label: string }[]>([])
const fxNote = ref(false)

const chartEl = ref<HTMLCanvasElement | null>(null)
let chart: Chart | null = null
let fxRates: Record<string, Record<string, number>> = {}

onMounted(async () => {
  data.value = await $fetch<SalaryData>('/data/salary-data.json')
})

function fmt(value: number, cur: string) {
  const symbol = CURRENCY_SYMBOLS[cur]
  const formatted = Math.round(value).toLocaleString()
  return symbol ? `${symbol} ${formatted}` : `${formatted} ${cur}`
}

async function getRate(from: string, to: string): Promise<number | null> {
  if (from === to) return 1
  const cached = fxRates[from]?.[to]
  if (cached) return cached
  try {
    const f = USD_PEGS[from] ? 'USD' : from
    const t = USD_PEGS[to] ? 'USD' : to
    let rate = 1
    if (f !== t) {
      const res = await $fetch<{ rates: Record<string, number> }>(
        `https://api.frankfurter.dev/v1/latest?base=${f}&symbols=${t}`,
      )
      rate = res.rates[t] ?? 1
    }
    if (USD_PEGS[from]) rate /= USD_PEGS[from]
    if (USD_PEGS[to]) rate *= USD_PEGS[to]
    fxRates[from] = fxRates[from] || {}
    fxRates[from][to] = rate
    return rate
  } catch {
    return null
  }
}

const canSearch = computed(() =>
  !!(data.value && country.value && jobTitle.value && currency.value),
)

async function runSearch() {
  if (!data.value) return
  errorMsg.value = ''
  fxNote.value = false

  const countries = [compare1.value, compare2.value].filter(Boolean)
  if (countries.length === 0) countries.push(country.value)
  if (countries.length === 2 && countries[0] === countries[1]) {
    errorMsg.value = 'Please select two different countries to compare.'
    renderChart([])
    return
  }
  if (!jobTitle.value) {
    errorMsg.value = 'Please select a job title, then click Search.'
    renderChart([])
    return
  }

  loading.value = true
  const datasets: any[] = []
  const legend: { color: string; label: string }[] = []

  for (const [idx, cc] of countries.entries()) {
    const bucket =
      data.value.benchmarks[cc]?.[jobTitle.value]?.[period.value] ||
      data.value.benchmarks[cc]?.[jobTitle.value]?.annual
    const name = countryDisplayName(cc, data.value.countries.find((c) => c.code === cc)?.name)
    if (!bucket) {
      datasets.push({ label: name, data: [0, 0, 0], backgroundColor: COLORS[idx % COLORS.length], borderRadius: 4, borderSkipped: false })
      legend.push({ color: COLORS[idx % COLORS.length], label: `${name} (no data)` })
      continue
    }
    let { low, median, high } = bucket
    if (period.value === 'monthly' && !data.value.benchmarks[cc]?.[jobTitle.value]?.monthly) {
      low /= 12; median /= 12; high /= 12
    }
    const rate = await getRate(bucket.currency, currency.value)
    if (rate === null) {
      fxNote.value = true
    } else {
      low *= rate; median *= rate; high *= rate
    }
    datasets.push({
      label: name,
      data: [low, median, high],
      backgroundColor: COLORS[idx % COLORS.length],
      borderRadius: 4,
      borderSkipped: false,
    })
    legend.push({ color: COLORS[idx % COLORS.length], label: name })
  }

  legendItems.value = legend
  renderChart(datasets)
  searched.value = true
  loading.value = false
}

function renderChart(datasets: any[]) {
  if (!chartEl.value) return
  if (chart) chart.destroy()
  const cur = currency.value
  chart = new Chart(chartEl.value, {
    type: 'bar',
    data: { labels: ['Junior', 'Intermediate', 'Senior'], datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx: any) => fmt(ctx.parsed.y, cur),
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Salary range', font: { family: 'Poppins', size: 12 } },
          grid: { display: false },
          ticks: { font: { family: 'Poppins', size: 12 } },
        },
        y: {
          title: { display: true, text: `${period.value === 'annual' ? 'Annual' : 'Monthly'} Salary`, font: { family: 'Poppins', size: 12 } },
          beginAtZero: true,
          grid: { color: '#e2e2e2' },
          ticks: {
            callback: (v: any) => fmt(Number(v), cur),
            font: { family: 'Poppins', size: 11 },
          },
        },
      },
      datasets: { bar: { barPercentage: 0.8, categoryPercentage: 0.9 } },
    },
  })
}

function reset() {
  country.value = 'ZA'
  jobTitle.value = ''
  currency.value = 'GBP'
  period.value = 'annual'
  compare1.value = 'ZA'
  compare2.value = 'GB'
  searched.value = false
  errorMsg.value = ''
  legendItems.value = []
  renderChart([])
}

function setPeriod(p: 'monthly' | 'annual') {
  period.value = p
  if (searched.value) runSearch()
}

watch([compare1, compare2, currency, jobTitle], () => {
  if (searched.value) runSearch()
})

onBeforeUnmount(() => {
  chart?.destroy()
})
</script>

<template>
  <section id="salary-benchmarking" class="sbt band-green fill-screen">
    <div class="container">
      <header class="sbt-head">
        <h2>Salary Benchmarking</h2>
        <p>
          Compare employer costs side by side. Select a role and country to see the real
          difference in total employment cost.
        </p>
      </header>

      <div class="sbt-tool" :data-has-results="searched ? '1' : '0'" :class="{ 'sbt-loading': loading }">
        <div class="sbt-columns">
          <!-- LEFT column: tool form -->
          <div class="sbt-column-left">
            <div class="sbt-card sbt-card-form">
              <form class="sbt-form" @submit.prevent="runSearch">
                <h3 class="sbt-card-title">Salary Benchmarking Tool</h3>
                <p class="sbt-card-subtitle">Select role and country to explore salary insights.</p>

                <div class="sbt-field">
                  <label for="sbt-country">Which location are you considering?</label>
                  <select id="sbt-country" v-model="country" class="sbt-select">
                    <option value="">Select country</option>
                    <option v-for="c in countryOptions" :key="c.code" :value="c.code">{{ c.name }}</option>
                  </select>
                </div>

                <div class="sbt-field">
                  <label for="sbt-job-title">Job Title</label>
                  <select id="sbt-job-title" v-model="jobTitle" class="sbt-select">
                    <option value="">Select a Job Title</option>
                    <option v-for="t in data?.jobTitles" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>

                <div class="sbt-field">
                  <label for="sbt-currency">Currency</label>
                  <select id="sbt-currency" v-model="currency" class="sbt-select">
                    <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>

                <div class="sbt-field">
                  <div class="sbt-toggle" role="group" aria-label="Period">
                    <button type="button" class="sbt-toggle-btn" :class="{ active: period === 'monthly' }" @click="setPeriod('monthly')">Monthly</button>
                    <button type="button" class="sbt-toggle-btn" :class="{ active: period === 'annual' }" @click="setPeriod('annual')">Annual</button>
                  </div>
                </div>

                <p v-if="errorMsg && !searched" class="sbt-error-msg">{{ errorMsg }}</p>

                <div class="sbt-field sbt-field-actions">
                  <button type="submit" class="sbt-btn sbt-btn-primary" :disabled="!canSearch || loading">
                    {{ loading ? 'Loading…' : 'Search' }}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- RIGHT column: results card -->
          <div class="sbt-card sbt-card-results">
            <h3 class="sbt-card-title">Compare countries</h3>

            <div class="sbt-compare-row">
              <!-- Mobile-only filter (visible once results are shown, per the WP CSS) -->
              <div class="sbt-filter-item sbt-filter-job">
                <label class="sbt-compare-label" for="sbt-filter-job">Job title</label>
                <select id="sbt-filter-job" v-model="jobTitle" class="sbt-select">
                  <option value="">Select a Job Title</option>
                  <option v-for="t in data?.jobTitles" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <div class="sbt-compare-country-wrap">
                <label class="sbt-compare-label" for="sbt-compare-1">Country 1</label>
                <select id="sbt-compare-1" v-model="compare1" class="sbt-select sbt-compare-country" :disabled="!searched">
                  <option value="">Select country</option>
                  <option v-for="c in countryOptions" :key="c.code" :value="c.code">{{ c.name }}</option>
                </select>
              </div>

              <div class="sbt-compare-country-wrap">
                <label class="sbt-compare-label" for="sbt-compare-2">Country 2</label>
                <select id="sbt-compare-2" v-model="compare2" class="sbt-select sbt-compare-country" :disabled="!searched">
                  <option value="">Optional second country</option>
                  <option v-for="c in countryOptions" :key="c.code" :value="c.code">{{ c.name }}</option>
                </select>
              </div>

              <div class="sbt-currency-wrap">
                <label class="sbt-compare-label" for="sbt-results-currency">Currency</label>
                <select id="sbt-results-currency" v-model="currency" class="sbt-select sbt-currency-results" :disabled="!searched">
                  <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="sbt-filter-item sbt-filter-period">
                <label class="sbt-compare-label" for="sbt-results-period">Period</label>
                <select id="sbt-results-period" v-model="period" class="sbt-select" :disabled="!searched" @change="searched && runSearch()">
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>

            <p v-if="errorMsg && searched" class="sbt-error-msg">{{ errorMsg }}</p>

            <div v-if="legendItems.length" class="sbt-legend">
              <span v-for="item in legendItems" :key="item.label" class="sbt-legend-item">
                <span class="sbt-legend-color" :style="{ background: item.color }" />{{ item.label }}
              </span>
            </div>

            <div class="sbt-chart-wrap">
              <canvas ref="chartEl" aria-label="Salary benchmark chart" />
              <div v-if="!searched" class="sbt-chart-disabled-overlay">
                <p class="sbt-chart-disabled-msg">Fill out search details first, then click Search</p>
              </div>
            </div>

            <p v-if="fxNote" class="sbt-fx-note">
              Exchange rate unavailable for the selected currency; values shown in stored currency.
            </p>

            <div class="sbt-results-actions">
              <button type="button" class="sbt-btn sbt-btn-secondary" :disabled="!searched" @click="reset">Reset Calculator</button>
              <NuxtLink to="/contact" class="sbt-btn sbt-btn-expert">Speak to an Expert</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sbt {
  padding-block: var(--section-pad);
  background-image: url('/assets/backgrounds/BG_CALCULATOR.webp');
  /* Anchored to the top so the cream arch is always visible (cover crops bottom, never the arch) */
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: var(--green);
}
.sbt-head {
  text-align: center;
  max-width: 720px;
  margin: 0 auto clamp(1.5rem, 4vh, 2.5rem);
}
.sbt-head h2 { color: var(--cream); }
.sbt-head p { color: var(--green-soft-2); }

/* ===== "Salary & Compensation Benchmarking CSS" (user's file, scoped) ===== */
.sbt-tool {
  font-family: var(--sans);
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  color: #1a1a1a;
}

.sbt-tool select {
  scrollbar-width: thin;
  scrollbar-color: #014520 #f0f0f0;
}

/* Two-column layout – 40 / 60 split */
.sbt-columns {
  display: flex;
  flex-direction: row;
  gap: 24px;
  align-items: stretch;
}
.sbt-column-left {
  flex: 0 0 40%;
  width: 40%;
  display: flex;
  flex-direction: column;
  min-height: 0;
  box-sizing: border-box;
}
.sbt-card-results {
  flex: 1 1 0%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.sbt-column-left .sbt-card-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}
.sbt-column-left .sbt-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 7px 0;
}
.sbt-card-results .sbt-chart-wrap {
  flex: 1;
  min-height: 260px;
}

/* Cards – both WHITE */
.sbt-card {
  border-radius: 16px;
  padding: 40px;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  min-width: 0;
}

/* Card titles & subtitles */
.sbt-card-title {
  font-family: var(--serif);
  font-size: 1.5rem;
  font-weight: 400;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  text-align: left;
}
.sbt-card-subtitle {
  font-size: 0.875rem;
  color: #666666;
  margin: 0 0 20px 0;
  text-align: left;
}

/* Form fields */
.sbt-field {
  margin-bottom: 18px;
  text-align: left;
}
.sbt-field label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
  text-align: left;
}

/* Inputs & selects – white bg, 8px radius, custom chevron */
.sbt-select {
  width: 100%;
  max-width: 100%;
  padding: 14px 12px;
  font-size: 0.9375rem;
  font-family: inherit;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background-color: #ffffff;
  color: #333333;
  box-sizing: border-box;
  text-overflow: ellipsis;
  overflow: hidden;
  line-height: 20px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M2.5 4.5L6 8l3.5-3.5H2.5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
  padding-right: 32px;
  padding-top: 0;
  padding-bottom: 0;
  min-height: 44px;
}
.sbt-select:focus {
  outline: none;
  border-color: #014520 !important;
  box-shadow: 0 0 0 2px rgba(1, 69, 32, 0.45) !important;
}

/* Disabled selects – light grey (results card locked until first search) */
.sbt-select:disabled {
  background-color: #e8e8e8 !important;
  color: #999999 !important;
  cursor: not-allowed;
  opacity: 0.7;
  border-color: #d0d0d0 !important;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888888' d='M2.5 4.5L6 8l3.5-3.5H2.5z'/%3E%3C/svg%3E") !important;
  background-repeat: no-repeat !important;
  background-position: right 12px center !important;
  background-size: 12px !important;
}

/* Period toggle */
.sbt-toggle {
  display: inline-flex;
  border: 1px solid #dddddd;
  border-radius: 10px;
  overflow: hidden;
}
.sbt-toggle-btn {
  padding: 12px 18px;
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 500;
  border: none;
  background: #ffffff;
  color: #1a1a1a;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.sbt-toggle-btn:hover {
  background: #f5f5f5;
  color: #1a1a1a;
}
.sbt-toggle-btn.active {
  background: #6e6e6e;
  color: #ffffff;
}

/* Buttons – pill with expanding-circle hover */
.sbt-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 30px;
  border: 2px solid transparent;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  border-radius: 100px;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
}
.sbt-btn::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  opacity: 0;
  z-index: -1;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.sbt-btn:hover {
  border-radius: 12px;
  box-shadow: 0 0 0 12px transparent;
}
.sbt-btn:hover::before {
  width: 500px;
  height: 500px;
  opacity: 1;
}
.sbt-btn:active {
  scale: 0.95;
}
.sbt-btn:focus-visible {
  outline: 3px solid #eb3d00;
  outline-offset: 3px;
}

/* Primary (Search) – green outline, fills on hover */
.sbt-btn-primary {
  background: transparent;
  color: #014520;
  border: 2px solid #014520;
  width: 100%;
}
.sbt-btn-primary:hover:not(:disabled) {
  background: #014520;
  color: #ffffff;
}
.sbt-btn-primary:disabled {
  background: transparent;
  color: #b3b3b3;
  border: 2px solid #d8d8d8;
  cursor: not-allowed;
  opacity: 1;
}

/* Reset Calculator – secondary outline button in the results card */
.sbt-btn-secondary {
  background: #ffffff;
  color: #014520;
  border: 2px solid #014520;
}
.sbt-btn-secondary:hover:not(:disabled) {
  background: #014520;
  color: #ffffff;
  border-color: #014520;
}
.sbt-btn-secondary:disabled {
  background: #ffffff;
  color: #b3b3b3;
  border: 2px solid #d8d8d8;
  cursor: not-allowed;
}

/* Speak to an Expert – solid orange, floods darker orange on hover (premium) */
.sbt-btn-expert {
  background-color: #eb3d00;
  color: #fffcf6;
  box-shadow: 0 0 0 0 #eb3d00;
}
.sbt-btn-expert::before { background-color: #cf3600; }

/* Search row: extra breathing room, pinned to the card bottom, full width */
.sbt-field-actions {
  margin-top: 27px;
  margin-bottom: 0;
}
.sbt-form .sbt-field-actions { margin-top: auto; }
.sbt-form .sbt-field-actions .sbt-btn { width: 100%; }

/* Results card – compare row, currency, legend */
.sbt-compare-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-top: 19px;
  margin-bottom: 16px;
}
.sbt-compare-country {
  flex: 1;
  min-width: 120px;
  text-overflow: ellipsis;
  overflow: hidden;
}
.sbt-compare-country-wrap {
  flex: 1;
  min-width: 120px;
}
.sbt-compare-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #666666;
  margin-bottom: 4px;
  text-align: left;
}
.sbt-currency-wrap {
  width: 110px;
  flex-shrink: 0;
}
.sbt-currency-results { width: 100%; }

.sbt-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  color: #444444;
  text-align: center;
  justify-content: center;
  width: 100%;
}
.sbt-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sbt-legend-color {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

/* Chart area – light grey background */
.sbt-chart-wrap {
  position: relative;
  height: 280px;
  min-height: 260px;
  margin-bottom: 24px;
  background: #f0f0f0;
  border-radius: 10px;
  min-width: 0;
}
.sbt-chart-wrap canvas {
  max-height: 100%;
  max-width: 100%;
}
.sbt-chart-disabled-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(240, 240, 240, 0.92);
  border-radius: 10px;
  pointer-events: none;
}
.sbt-chart-disabled-msg {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: max-content;
  max-width: calc(100% - 32px);
  font-size: 0.875rem;
  color: #666666;
  text-align: center;
  padding: 16px;
  margin: 0;
}

/* Results actions row */
.sbt-results-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  text-align: left;
}

/* Loading & error states */
.sbt-loading {
  opacity: 0.7;
  pointer-events: none;
}
.sbt-error-msg {
  background: #fef2f2;
  color: #b91c1c;
  padding: 12px;
  border-radius: 10px;
  font-size: 0.875rem;
  margin-bottom: 16px;
  text-align: left;
}
.sbt-fx-note {
  font-size: 0.78rem;
  color: #666666;
  margin: -12px 0 16px;
}

/* Mobile filter items: hidden by default */
.sbt-filter-item { display: none; }

/* ===== Mobile (≤768px): stack; once results show, collapse the form card ===== */
@media (max-width: 768px) {
  .sbt-columns { flex-direction: column; }
  .sbt-column-left {
    flex: 0 0 auto;
    width: 100%;
    transition: opacity 0.35s ease, max-height 0.4s ease;
    overflow: hidden;
    max-height: 2000px;
    opacity: 1;
  }
  .sbt-card-results { flex: 0 0 auto; }
  .sbt-card { padding: 30px; }

  .sbt-tool[data-has-results="1"] .sbt-column-left {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }
  .sbt-tool[data-has-results="1"] .sbt-columns { gap: 0; }
  .sbt-tool[data-has-results="1"] .sbt-card-results { flex: 1 1 100%; }

  .sbt-tool[data-has-results="1"] .sbt-filter-job {
    display: block;
    flex: 1 1 100%;
    margin-bottom: 0;
  }
  .sbt-tool[data-has-results="1"] .sbt-compare-country-wrap {
    flex: 1 1 calc(50% - 5px);
    min-width: 0;
  }
  .sbt-tool[data-has-results="1"] .sbt-currency-wrap {
    flex: 1 1 0%;
    width: auto;
  }
  .sbt-tool[data-has-results="1"] .sbt-filter-period {
    display: block;
    flex: 1 1 0%;
    margin-bottom: 0;
  }
}

/* Short laptop viewports (1280×587) */
@media (min-width: 769px) and (max-height: 650px) {
  .sbt-chart-wrap { height: 240px; min-height: 220px; }
}
/* Laptop screens (short viewports): the tool was eating too much vertical
   space — tighten cards, chart and rhythm so it sits comfortably in view */
@media (min-width: 993px) and (max-height: 820px) {
  .sbt-head { margin-bottom: 1.1rem; }
  .sbt-card { padding: 24px 28px; }
  .sbt-card-title { font-size: 20px; }
  .sbt-field { margin-bottom: 12px; }
  .sbt-chart-wrap { height: 220px; min-height: 200px; margin-bottom: 16px; }
  .sbt-columns { gap: 18px; }
}

</style>
