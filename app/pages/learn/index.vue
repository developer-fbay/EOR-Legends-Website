<script setup lang="ts">
// Learn hub — "Resources & Knowledge Hub": gateway to About, News, Blogs, HR Glossary.
usePageSeo({
  title: 'Resources & Knowledge Hub',
  description: 'Everything you need to know about hiring, compliance, and managing teams in South Africa.',
})

const sections = [
  { title: 'Blogs', text: 'Expert guidance on South African employment and global team management.', to: '/blog', image: '/assets/learn/blog-cover.webp' },
  { title: 'News Articles', text: 'Company updates and industry developments that impact your workforce strategy.', to: '/news', image: '/assets/learn/news-article-cover.webp' },
  { title: 'HR Glossary', text: 'A straightforward guide to employment, payroll, and compliance terminology.', to: '/hr-glossary', image: '/assets/learn/hr-glossary-cover.webp' },
  { title: 'About Us', text: 'Who we are, why we exist, and how we work on the ground in South Africa.', to: '/about', image: '/assets/learn/about-us-cover.webp' },
  { title: 'Case Studies', text: 'Real examples of how international businesses hire and operate in South Africa.', to: '/case-studies', image: '/assets/learn/case-studies-cover.webp' },
  { title: 'Guides', text: 'Free resources and checklists to streamline your expansion to South Africa.', to: '/guides', image: '/assets/learn/guides-cover.webp' },
  { title: 'Staffing Insights', text: 'Analytics and trends to guide your hiring strategy and workforce planning in South Africa.', to: '/staffing-insights', image: '/assets/learn/staffing-insights-cover.webp' },
]

// Latest posts strip
const { data: latest } = useContentList('blogs', { limit: 3 })
</script>

<template>
  <main>
    <UiArchiveHero
      title="Resources & Knowledge Hub"
      sub="Everything you need to know about hiring, compliance, and managing teams in South Africa"
    />

    <section class="band-cream section">
      <div class="container">
        <div class="learn-grid">
          <article v-for="s in sections" :key="s.to" class="learn-card">
            <img :src="s.image" :alt="s.title" loading="lazy" />
            <h2>{{ s.title }}</h2>
            <p>{{ s.text }}</p>
            <NuxtLink :to="s.to" class="brand-btn brand-btn--orange">Explore</NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <section v-if="latest?.length" class="band-cream section">
      <div class="container">
        <h2 class="learn-latest__title">Latest insights</h2>
        <div class="learn-grid">
          <UiPostCard
            v-for="p in latest"
            :key="p.id"
            :title="p.title"
            :excerpt="p.excerpt"
            :image="coverFor(p.slug)"
            :to="`/blog/${p.slug}`"
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
.learn-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2.6vw, 34px);
}
.learn-card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 16px 16px 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.learn-card img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.35s ease, transform 0.35s ease;
}
.learn-card:hover img {
  filter: grayscale(0%);
  transform: scale(1.02);
}
.learn-card h2 {
  font-family: var(--serif);
  font-size: 1.35rem;
  margin: 6px 0 0;
}
.learn-card p {
  font-size: 0.88rem;
  color: var(--grey-text);
  margin: 0;
  flex: 1;
}
.learn-latest__title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
@media (max-width: 992px) { .learn-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .learn-grid { grid-template-columns: 1fr; } }
</style>
