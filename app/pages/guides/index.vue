<script setup lang="ts">
// Guides archive — same structure as the tools archive.
import { GUIDES } from '~/data/guides'
import { coverFor } from '~/utils/coverImage'

usePageSeo({
  title: 'Download Your Essential EOR Guides',
  description: 'Free resources and checklists to streamline your expansion to South Africa.',
})
</script>

<template>
  <main>
    <UiArchiveHero
      title="Download Your Essential EOR Guides"
      sub="Free resources and checklists to streamline your expansion to South Africa"
    />

    <section class="band-cream section">
      <div class="container">
        <div class="arch-grid">
          <UiPostCard
            v-for="g in GUIDES"
            :key="g.slug"
            :title="g.title"
            :excerpt="g.excerpt"
            :image="coverFor(g.slug)"
            :to="`/guides/${g.slug}`"
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
