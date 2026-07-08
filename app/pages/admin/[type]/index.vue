<script setup lang="ts">
import { CMS_TYPES } from '~/composables/useCmsTypes'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const typeKey = computed(() => String(route.params.type))
const cmsType = computed(() => CMS_TYPES[typeKey.value])

if (!cmsType.value) {
  throw createError({ statusCode: 404, statusMessage: 'Unknown content type' })
}

const supabase = useSupabaseClient()
const configured = useCmsConfigured()
const items = ref<any[]>([])
const loading = ref(true)

async function load() {
  if (!configured.value || !cmsType.value) { loading.value = false; return }
  loading.value = true
  const { data } = await supabase
    .from(cmsType.value.table)
    .select('id, title, slug, status, noindex, updated_at, published_at')
    .order('updated_at', { ascending: false })
    .limit(500)
  items.value = data ?? []
  loading.value = false
}

async function remove(item: any) {
  if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return
  await supabase.from(cmsType.value!.table).delete().eq('id', item.id)
  items.value = items.value.filter((i) => i.id !== item.id)
}

onMounted(load)
watch(typeKey, load)
</script>

<template>
  <div>
    <div class="list-head">
      <h1 class="admin-title">{{ cmsType?.label }}</h1>
      <NuxtLink :to="`/admin/${typeKey}/new`" class="brand-btn brand-btn--orange">+ New</NuxtLink>
    </div>

    <p v-if="!configured" class="admin-note">Connect Supabase to manage content (see Dashboard).</p>
    <p v-else-if="loading" class="admin-note">Loading…</p>
    <table v-else-if="items.length" class="admin-table">
      <thead>
        <tr><th>Title</th><th>Slug</th><th>Status</th><th>SEO</th><th>Updated</th><th /></tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>
            <NuxtLink :to="`/admin/${typeKey}/${item.id}`" class="row-title">{{ item.title }}</NuxtLink>
          </td>
          <td class="row-slug">/{{ item.slug }}</td>
          <td>
            <span class="status" :class="item.status">{{ item.status }}</span>
          </td>
          <td>
            <span v-if="item.noindex" class="noindex">noindex</span>
            <span v-else class="indexed">indexed</span>
          </td>
          <td>{{ new Date(item.updated_at).toLocaleDateString() }}</td>
          <td class="row-actions">
            <a
              v-if="item.status === 'published'"
              :href="`${cmsType!.publicPath}/${item.slug}`"
              target="_blank"
              rel="noopener"
            >View</a>
            <button class="row-delete" @click="remove(item)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p v-else class="admin-note">Nothing here yet — create the first one.</p>
  </div>
</template>

<style scoped>
.list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.admin-title { font-family: var(--serif); font-size: 1.7rem; margin: 0; }
.admin-note { color: var(--grey-mid); }
.row-title { color: var(--body); font-weight: 500; text-decoration: none; }
.row-title:hover { color: var(--green); }
.row-slug { color: var(--grey-mid); font-size: 0.8rem; }
.status {
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}
.status.published { background: rgba(1, 69, 32, 0.1); color: var(--green); }
.status.draft { background: #f3f0e8; color: var(--grey-mid); }
.noindex { color: var(--accent); font-size: 0.78rem; font-weight: 600; }
.indexed { color: var(--grey-mid); font-size: 0.78rem; }
.row-actions { display: flex; gap: 12px; align-items: center; }
.row-actions a { color: var(--green); font-size: 0.82rem; }
.row-delete {
  background: none;
  border: none;
  color: var(--accent);
  font-family: var(--sans);
  font-size: 0.82rem;
  cursor: pointer;
  padding: 0;
}
.row-delete:hover { text-decoration: underline; }
</style>
