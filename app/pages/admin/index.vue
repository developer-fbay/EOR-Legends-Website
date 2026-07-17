<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const configured = useCmsConfigured()

type LeadPeriod = 'all' | 'day' | 'week' | 'month'
const period = ref<LeadPeriod>('all')
const leadCount = ref<number | null>(null)
const recentLeads = ref<any[]>([])

const PERIODS: { key: LeadPeriod; label: string }[] = [
  { key: 'all', label: 'All time' },
  { key: 'day', label: 'Today' },
  { key: 'week', label: 'This week' },
  { key: 'month', label: 'This month' },
]

function periodStart(p: LeadPeriod): string | null {
  const now = new Date()
  if (p === 'day') return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  if (p === 'week') {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dow = (d.getDay() + 6) % 7 // Monday start
    d.setDate(d.getDate() - dow)
    return d.toISOString()
  }
  if (p === 'month') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  return null
}

async function loadCount() {
  leadCount.value = null
  let q = supabase.from('leads').select('*', { count: 'exact', head: true })
  const start = periodStart(period.value)
  if (start) q = q.gte('created_at', start)
  const { count } = await q
  leadCount.value = count ?? 0
}

watch(period, loadCount)

onMounted(async () => {
  if (!configured.value) return
  await loadCount()
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  recentLeads.value = data ?? []
})
</script>

<template>
  <div>
    <h1 class="admin-title">Dashboard</h1>

    <div v-if="!configured" class="admin-setup">
      <h2>Connect Supabase to finish CMS setup</h2>
      <ol>
        <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noopener">supabase.com</a>.</li>
        <li>Copy <code>.env.example</code> to <code>.env</code> and fill in <code>SUPABASE_URL</code>, <code>SUPABASE_KEY</code> and <code>SUPABASE_SERVICE_KEY</code> from Project Settings → API.</li>
        <li>Open the SQL Editor in Supabase and run the contents of <code>supabase/schema.sql</code>.</li>
        <li>Create your admin login under Authentication → Users → Add user.</li>
        <li>Restart the dev server.</li>
      </ol>
    </div>

    <template v-else>
      <div class="lead-box">
        <div class="lead-box__top">
          <span class="lead-box__label">Leads</span>
          <div class="lead-box__filters">
            <button
              v-for="p in PERIODS"
              :key="p.key"
              class="lead-box__filter"
              :class="{ active: period === p.key }"
              @click="period = p.key"
            >
              {{ p.label }}
            </button>
          </div>
        </div>
        <span class="lead-box__count">{{ leadCount ?? '…' }}</span>
        <NuxtLink to="/admin/leads" class="lead-box__link">View all leads →</NuxtLink>
      </div>

      <section class="admin-recent">
        <div class="admin-recent__head">
          <h2>Recent leads</h2>
          <NuxtLink to="/admin/leads">View all</NuxtLink>
        </div>
        <table v-if="recentLeads.length" class="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Type</th><th>Received</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in recentLeads" :key="l.id">
              <td>{{ l.full_name }}</td>
              <td>{{ l.email }}</td>
              <td>{{ l.audience }}</td>
              <td>{{ new Date(l.created_at).toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="admin-empty">No leads yet.</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.admin-title {
  font-family: var(--serif);
  font-size: 1.7rem;
  margin-bottom: 24px;
}
.admin-setup {
  background: var(--white);
  border-radius: 14px;
  padding: 28px;
  max-width: 640px;
}
.admin-setup h2 { font-family: var(--serif); font-size: 1.25rem; }
.admin-setup ol { padding-left: 1.3em; line-height: 1.9; }
.admin-setup a { color: var(--green); }

.lead-box {
  background: var(--white);
  border-radius: 14px;
  padding: 22px 24px;
  max-width: 520px;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.lead-box__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.lead-box__label { font-weight: 700; }
.lead-box__filters { display: flex; gap: 6px; flex-wrap: wrap; }
.lead-box__filter {
  border: 1px solid #e2ddd1;
  background: none;
  border-radius: 999px;
  padding: 4px 12px;
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  color: var(--grey-mid);
}
.lead-box__filter.active {
  background: var(--green);
  border-color: var(--green);
  color: #fffcf6;
}
.lead-box__count {
  font-family: var(--serif);
  font-size: 2.6rem;
  color: var(--green);
  line-height: 1;
}
.lead-box__link { color: var(--green); font-size: 0.85rem; text-decoration: none; }

.admin-recent__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 10px;
}
.admin-recent__head h2 { font-family: var(--serif); font-size: 1.2rem; margin: 0; }
.admin-recent__head a { color: var(--green); font-size: 0.85rem; }
.admin-empty { color: var(--grey-mid); font-size: 0.9rem; }
</style>

<style>
/* shared admin table styles (unscoped, reused by list pages) */
.admin-table {
  width: 100%;
  background: var(--white);
  border-radius: 12px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  font-size: 0.88rem;
}
.admin-table th {
  text-align: left;
  padding: 12px 16px;
  background: rgba(1, 69, 32, 0.05);
  font-weight: 600;
}
.admin-table td {
  padding: 11px 16px;
  border-top: 1px solid #f0ede6;
}
</style>
