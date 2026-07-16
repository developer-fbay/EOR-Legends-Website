<script setup lang="ts">
import type { CtaActiveConfig } from '~/composables/useCtaVariant'

// CTA A/B rotation: fetch the active experiment ONCE per request (all CTA
// surfaces read the shared 'cta-active' state), then record one impression
// per browser session. Internal pages don't count as exposure.
const ctaActive = useState<CtaActiveConfig | null>('cta-active', () => null)
const { data: ctaConfig } = await useAsyncData(
  'cta-config',
  () => $fetch<{ active: CtaActiveConfig | null }>('/api/cta/config').catch(() => ({ active: null })),
)
ctaActive.value = ctaConfig.value?.active || null

const route = useRoute()
onMounted(() => {
  if (route.path.startsWith('/admin') || route.path === '/lead-input-form') return
  useCtaVariant().trackImpression()
})
</script>

<template>
  <div class="app-shell">
    <LayoutAppHeader />
    <slot />
    <LayoutAppFooter />
    <UiContactModal />
  </div>
</template>
