<script setup lang="ts">
// Problem Pillar single — hero (intro + estimate form, per the WP layout).
// The full data-heavy body will be extracted 1:1 once the WP page is published.
import { getPillar } from '~/data/staffing-insights'

const route = useRoute()
const slug = String(route.params.slug)
const pillar = getPillar(slug)
if (!pillar) throw createError({ statusCode: 404, statusMessage: 'Insight not found' })

// Full article body + FAQs, extracted from the published WP page (cached)
const { data: body } = await useAsyncData(`pillar-body-${slug}`, () =>
  $fetch<{ title: string; bodyHtml: string; faqs: { q: string; a: string }[] }>(`/api/pillar/${slug}`).catch(() => null),
)

usePageSeo({
  title: pillar.title,
  description: pillar.excerpt,
  ogType: 'article',
})

// FAQPage structured data from the extracted (real) FAQs
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: (body.value?.faqs || []).map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }),
      ),
    },
  ],
})
</script>

<template>
  <main v-if="pillar">
    <section class="pi-hero band-cream section">
      <div class="container pi-hero__grid">
        <div class="pi-hero__copy">
          <NuxtLink to="/staffing-insights" class="pi-back">← Staffing Insights</NuxtLink>
          <h1>{{ pillar.title }}</h1>
          <p v-for="(p, i) in pillar.intro" :key="i" :class="{ 'pi-lead': i === 0 }">{{ p }}</p>
          <ul v-if="pillar.bullets">
            <li v-for="(b, i) in pillar.bullets" :key="i">{{ b }}</li>
          </ul>
        </div>
        <div class="pi-hero__form">
          <UiLeadForm :gf-form-id="29" :source="`pillar-${pillar.slug}`" title="Get a free cost estimate" />
        </div>
      </div>
    </section>

    <!-- Full article body extracted from the published WP page -->
    <section v-if="body?.bodyHtml" class="band-cream section" style="padding-top: 0">
      <div class="container">
        <article class="pi-body" v-html="body.bodyHtml" />
      </div>
    </section>

    <section v-if="body?.faqs?.length" class="band-cream section" style="padding-top: 0">
      <div class="container">
        <h2 class="pi-cl-title">Frequently asked questions</h2>
        <UiFaqAccordion :faqs="body.faqs" />
      </div>
    </section>

    <HomeCtaBand />

    <section v-if="pillar.clusters.length" class="band-cream section">
      <div class="container">
        <h2 class="pi-cl-title">Explore this topic further</h2>
        <div class="pi-cl-grid">
          <UiPostCard
            v-for="c in pillar.clusters"
            :key="c.slug"
            :title="c.title"
            :excerpt="c.intro[0]"
            image="/assets/backgrounds/find-out-more-card.png"
            :to="`/staffing-insights/${pillar.slug}/${c.slug}`"
          />
        </div>
      </div>
    </section>

    <HomeFinalCta />
  </main>
</template>

<style scoped>
.pi-hero__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(28px, 5vw, 80px);
  align-items: start;
}
.pi-back {
  display: inline-block;
  color: var(--grey-mid);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 12px;
}
.pi-back:hover { color: var(--green); }
.pi-hero__copy h1 {
  margin-bottom: 0.6em;
  max-width: 24ch;
}
.pi-lead {
  font-size: 1.1rem;
  font-weight: 400;
}
.pi-hero__copy p {
  line-height: 1.75;
  max-width: 64ch;
}
.pi-hero__copy ul {
  padding-left: 1.3em;
  line-height: 1.8;
  max-width: 64ch;
}
.pi-hero__form {
  position: sticky;
  top: 96px;
}

/* Extracted article body — site prose styling over the raw Oxygen markup */
.pi-body {
  max-width: 1080px;
  margin-inline: auto;
}
.pi-body :deep(h2) {
  font-family: var(--sans);
  font-weight: 700;
  font-size: clamp(1.35rem, 1.8vw, 1.7rem);
  margin: 1.8em 0 0.6em;
}
.pi-body :deep(h3) {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 1.15rem;
  margin: 1.4em 0 0.5em;
}
.pi-body :deep(p) { line-height: 1.75; margin-bottom: 1em; }
.pi-body :deep(ul),
.pi-body :deep(ol) { padding-left: 1.4em; margin-bottom: 1.1em; line-height: 1.75; }
.pi-body :deep(a) { color: var(--green); }
.pi-body :deep(img) { border-radius: 12px; height: auto; max-width: 100%; }
.pi-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
  font-size: 0.92rem;
  background: var(--white);
}
.pi-body :deep(th),
.pi-body :deep(td) { border: 1px solid #e2ded4; padding: 10px 12px; text-align: left; }
.pi-body :deep(th) { background: rgba(1, 69, 32, 0.05); }
/* Oxygen numbered rows — number chip beside the text */
.pi-body :deep(div:has(> .pi-num)) {
  display: grid;
  grid-template-columns: 28px 1fr;
  column-gap: 14px;
  align-items: start;
  margin-bottom: 0.9em;
}
.pi-body :deep(.pi-num) {
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(1, 69, 32, 0.08);
  color: var(--green);
  font-weight: 600;
  font-size: 0.85rem;
}
.pi-body :deep(div:has(> .pi-num) > div) { grid-column: 2; }
.pi-body :deep(div:has(> .pi-num--card) > div:first-of-type) { font-weight: 600; }
/* embedded WP widgets that can't run here (forms, the WP copy of the calculator) */
.pi-body :deep(.gform_wrapper),
.pi-body :deep(#sbt-tool),
.pi-body :deep(.sbt-tool) { display: none; }

.pi-cl-title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.pi-cl-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2.6vw, 34px);
}

@media (max-width: 900px) {
  .pi-hero__grid { grid-template-columns: 1fr; }
  .pi-hero__form { position: static; max-width: 480px; }
  .pi-cl-grid { grid-template-columns: 1fr; }
}
</style>
