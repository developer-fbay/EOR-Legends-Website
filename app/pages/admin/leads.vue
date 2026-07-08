<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const configured = useCmsConfigured()
const leads = ref<any[]>([])
const loading = ref(true)

onMounted(async () => {
  if (!configured.value) { loading.value = false; return }
  const { data } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  leads.value = data ?? []
  loading.value = false
})
</script>

<template>
  <div>
    <h1 class="admin-title">Leads</h1>
    <p v-if="!configured" class="admin-note">Connect Supabase to see leads (see Dashboard).</p>
    <p v-else-if="loading" class="admin-note">Loading…</p>
    <table v-else-if="leads.length" class="admin-table">
      <thead>
        <tr><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Company</th><th>Message</th><th>Source</th><th>Received</th></tr>
      </thead>
      <tbody>
        <tr v-for="l in leads" :key="l.id">
          <td>{{ l.full_name }}</td>
          <td><a :href="`mailto:${l.email}`">{{ l.email }}</a></td>
          <td>{{ l.phone }}</td>
          <td>{{ l.audience }}</td>
          <td>{{ l.company || '—' }}</td>
          <td class="lead-msg">{{ l.message || '—' }}</td>
          <td>{{ l.source }}</td>
          <td>{{ new Date(l.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-note">No leads yet.</p>
  </div>
</template>

<style scoped>
.admin-title { font-family: var(--serif); font-size: 1.7rem; margin-bottom: 24px; }
.admin-note { color: var(--grey-mid); }
.lead-msg { max-width: 280px; }
</style>
