<script setup lang="ts">
// Blogs archive — "Insights on Global Hiring & South African Employment".
usePageSeo({
  title: 'Insights on Global Hiring & South African Employment',
  description:
    'Practical articles covering Employer of Record services, South African labour compliance, payroll, onboarding, and managing remote teams.',
})

const { data: posts } = useContentList('blogs')
const visible = ref(12)
</script>

<template>
  <main>
    <UiArchiveHero
      title="Insights on Global Hiring & South African Employment"
      sub="Practical articles covering Employer of Record services, South African labour compliance, payroll, onboarding, and managing remote teams. Built for international businesses hiring in South Africa who want clarity, not complexity."
    />

    <section class="band-cream section">
      <div class="container">
        <div class="arch-grid">
          <UiPostCard
            v-for="p in (posts ?? []).slice(0, visible)"
            :key="p.id"
            :title="p.title"
            :excerpt="p.excerpt"
            :image="p.featured_image"
            :to="`/blog/${p.slug}`"
          />
        </div>
        <div v-if="(posts?.length ?? 0) > visible" class="arch-more">
          <button class="brand-btn brand-btn--orange" @click="visible += 12">Load More</button>
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
.arch-more {
  text-align: center;
  margin-top: clamp(1.6rem, 4vh, 2.6rem);
}
@media (max-width: 992px) { .arch-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .arch-grid { grid-template-columns: 1fr; } }
</style>
