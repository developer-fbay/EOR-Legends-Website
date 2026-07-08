<script setup lang="ts">
// Case Studies archive.
usePageSeo({
  title: 'Case Studies',
  description:
    'Real examples of how we support international businesses hiring in South Africa. From payroll compliance to full team setup, these case studies outline the challenge, our approach, and the operational outcomes delivered.',
})

const { data: posts } = useContentList('case_studies')

// Designer's 2026 archive cards use the client logo blocks, not photos.
const LOGO_BLOCKS: Record<string, string> = {
  thinkworkforce: '/assets/case-studies/block-thinkworkforce.webp',
  'funding-bay': '/assets/case-studies/block-funding-bay.webp',
  'effer-ventures': '/assets/case-studies/block-effer-ventures.webp',
}
</script>

<template>
  <main>
    <UiArchiveHero
      title="Case Studies"
      sub="Real examples of how we support international businesses hiring in South Africa. From payroll compliance to full team setup, these case studies outline the challenge, our approach, and the operational outcomes delivered."
    />

    <section class="band-cream section">
      <div class="container">
        <div class="arch-grid">
          <UiPostCard
            v-for="p in posts ?? []"
            :key="p.id"
            :title="p.title"
            :excerpt="p.excerpt"
            :image="LOGO_BLOCKS[p.slug] || p.featured_image"
            :to="`/case-studies/${p.slug}`"
          />
        </div>
      </div>
    </section>

    <HomeCtaBand />
    <HomeTalentShowcase />
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
