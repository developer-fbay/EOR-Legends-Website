<script setup lang="ts">
// Tools archive — cards for every calculator/tool (Supabase `tools` entries
// merge with the built-in salary benchmarking tool).
usePageSeo({
  title: 'EOR & Payroll Tools',
  description:
    'Get instant insights into employment costs, tax implications, and budget planning for your South African team.',
})

const { data: cmsTools } = useContentList('tools')

const builtIn = [
  {
    id: 'salary-benchmarking',
    title: 'Salary Benchmarking Tool',
    excerpt:
      'Compare salaries across countries and see how your hiring budget can go further — real market data from an EOR operating on the ground.',
    featured_image: '/assets/backgrounds/service-card.webp',
    to: '/tools/salary-benchmarking',
  },
]

const allTools = computed(() => [
  ...builtIn,
  ...(cmsTools.value ?? []).map((t) => ({
    id: t.id,
    title: t.title,
    excerpt: t.excerpt,
    featured_image: t.featured_image,
    to: (t as any).tool_url || `/tools/${t.slug}`,
  })),
])
</script>

<template>
  <main>
    <UiArchiveHero
      title="EOR & Payroll Tools"
      sub="Get instant insights into employment costs, tax implications, and budget planning for your South African team"
    />

    <section class="band-cream section">
      <div class="container">
        <div class="arch-grid">
          <UiPostCard
            v-for="t in allTools"
            :key="t.id"
            :title="t.title"
            :excerpt="t.excerpt"
            :image="t.featured_image"
            :to="t.to"
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
