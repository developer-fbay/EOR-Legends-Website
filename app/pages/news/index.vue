<script setup lang="ts">
// News archive — "Inside the News".
usePageSeo({
  title: 'Inside the News',
  description: 'News and developments related to employment, compliance, and global hiring.',
})

const { data: posts } = useContentList('news_articles')
const visible = ref(12)
</script>

<template>
  <main>
    <UiArchiveHero
      title="Inside the News"
      sub="News and developments related to employment, compliance, and global hiring."
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
            :to="`/news/${p.slug}`"
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
