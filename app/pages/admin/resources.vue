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
  <div class="admin-page">
    <h1 class="admin-title">Resources</h1>
    <p class="admin-intro">All editorial content in one place. Click a type to view and edit its entries.</p>

    <div class="admin-cards">
      <NuxtLink v-for="key in RESOURCE_TYPE_KEYS" :key="key" :to="`/admin/${key}`" class="admin-card">
        <span class="admin-card__count">{{ counts[key] ?? '…' }}</span>
        <span class="admin-card__label">{{ CMS_TYPES[key]?.label }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.admin-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.admin-card {
  background: #fff;
  border: 1px solid #e7e2d4;
  border-radius: 14px;
  padding: 22px;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.admin-card:hover { border-color: var(--green); transform: translateY(-2px); }
.admin-card__count {
  font-family: var(--serif);
  font-size: 2.2rem;
  color: var(--green);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.admin-card__label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #71786f;
}
</style>
