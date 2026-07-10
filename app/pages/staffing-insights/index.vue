<script setup lang="ts">
// Staffing Insights archive — problem pillars.
import { PILLARS } from '~/data/staffing-insights'

usePageSeo({
  title: 'South African Staffing Insights',
  description: 'Analytics and trends to guide your hiring strategy and workforce planning in South Africa.',
})
</script>

<template>
  <main>
    <UiArchiveHero
      title="South African Staffing Insights"
      sub="Analytics and trends to guide your hiring strategy and workforce planning in South Africa"
    />

    <section class="band-cream section">
      <div class="container">
        <div class="arch-grid">
          <UiPostCard
            v-for="p in PILLARS"
            :key="p.slug"
            :title="p.title"
            :excerpt="p.excerpt"
            :image="coverFor(p.slug)"
            :to="`/staffing-insights/${p.slug}`"
          />
        </div>
      </div>
    </section>

    <HomeCtaBand />
    <HomeWhyEor />
    <HomeFinalCta />
  </main>
</template>

<style scoped>
.arch-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2.6vw, 34px);
}
@media (max-width: 992px) { .arch-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .arch-grid { grid-template-columns: 1fr; } }
</style>
