<script setup lang="ts">
/**
 * Resources — all editorial content types in one place. Click a card to
 * manage that type's entries.
 */
import { CMS_TYPES, RESOURCE_TYPE_KEYS } from '~/composables/useCmsTypes'

definePageMeta({ layout: 'admin' })

const supabase = useSupabaseClient()
const configured = useCmsConfigured()
const counts = ref<Record<string, number>>({})

onMounted(async () => {
  if (!configured.value) return
  for (const key of RESOURCE_TYPE_KEYS) {
    const type = CMS_TYPES[key]
    if (!type) continue
    const { count } = await supabase.from(type.table).select('*', { count: 'exact', head: true })
    counts.value[key] = count ?? 0
  }
})
</script>

<template>
  <div>
    <h1 class="admin-title">Resources</h1>
    <p class="res-intro">All editorial content in one place. Click a type to view and edit its entries.</p>

    <div class="admin-cards">
      <NuxtLink v-for="key in RESOURCE_TYPE_KEYS" :key="key" :to="`/admin/${key}`" class="admin-card">
        <span class="admin-card__count">{{ counts[key] ?? '…' }}</span>
        <span class="admin-card__label">{{ CMS_TYPES[key]?.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.admin-title {
  font-family: var(--serif);
  font-size: 1.7rem;
  margin-bottom: 8px;
}
.res-intro { color: var(--grey-mid); margin-bottom: 22px; }
.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
}
.admin-card {
  background: var(--white);
  border-radius: 14px;
  padding: 20px;
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
.admin-card__label { font-size: 0.88rem; color: var(--grey-mid); }
</style>
