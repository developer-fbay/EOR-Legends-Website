<script setup lang="ts">
import { CMS_TYPES } from '~/composables/useCmsTypes'

definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const configured = useCmsConfigured()

const counts = ref<Record<string, number>>({})
const recentLeads = ref<any[]>([])

onMounted(async () => {
  if (!configured.value) return
  for (const [key, type] of Object.entries(CMS_TYPES)) {
    const { count } = await supabase
      .from(type.table)
      .select('*', { count: 'exact', head: true })
    counts.value[key] = count ?? 0
  }
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
      <div class="admin-cards">
        <NuxtLink v-for="(t, key) in CMS_TYPES" :key="key" :to="`/admin/${key}`" class="admin-card">
          <span class="admin-card__count">{{ counts[key] ?? '…' }}</span>
          <span class="admin-card__label">{{ t.label }}</span>
        </NuxtLink>
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

.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 14px;
  margin-bottom: 32px;
}
.admin-card {
  background: var(--white);
  border-radius: 14px;
  padding: 18px;
  text-decoration: none;
  color: var(--body);
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid transparent;
  transition: border-color 0.15s ease;
}
.admin-card:hover { border-color: var(--green); }
.admin-card__count {
  font-family: var(--serif);
  font-size: 1.9rem;
  color: var(--green);
  line-height: 1;
}
.admin-card__label { font-size: 0.85rem; color: var(--grey-mid); }

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
