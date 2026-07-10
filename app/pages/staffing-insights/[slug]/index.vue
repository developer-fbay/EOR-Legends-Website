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

const articleEl = ref<HTMLElement | null>(null)

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

    <!-- Full article body extracted from the published WP page, with the
         sticky table of contents from the WP design -->
    <section v-if="body?.bodyHtml" class="band-cream section" style="padding-top: 0">
      <div class="container pi-grid">
        <aside class="pi-aside">
          <UiTocSidebar :article-el="articleEl" />
        </aside>
        <article ref="articleEl" class="pi-body" v-html="body.bodyHtml" />
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
            :image="coverFor(c.slug)"
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

/* ToC + body grid (matches the WP pillar layout) */
.pi-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}
.pi-aside {
  position: sticky;
  top: 110px;
}

/* Extracted article body — site prose styling over the raw Oxygen markup */
.pi-body {
  min-width: 0;
}
.pi-body :deep(h2) {
  font-family: var(--serif);
  font-weight: 400;
  font-size: clamp(1.5rem, 2vw, 1.9rem);
  margin: 1.8em 0 0.6em;
  scroll-margin-top: 120px;
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

/* ===== WP pillar design styles (per the live page) ===== */
/* section-number badge beside the heading */
.pi-body :deep(div:has(> .pi-h2-badge)) {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 2.2em 0 0.6em;
}
.pi-body :deep(.pi-h2-badge) {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 10px;
  background: var(--green);
  color: var(--cream);
  font-family: var(--serif);
  font-size: 17px;
}
.pi-body :deep(div:has(> .pi-h2-badge) h2) { margin: 0; }

/* cost-stack: two-column white cards with the orange left accent */
.pi-body :deep(div:has(> div > .pi-num--card)) {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin: 1.2em 0 1.6em;
}
.pi-body :deep(div:has(> .pi-num--card)) {
  display: block;
  background: var(--white);
  border: 1px solid #ece9e2;
  border-left: 3px solid var(--accent);
  border-radius: 12px;
  padding: 18px 22px;
  margin-bottom: 0;
}
.pi-body :deep(.pi-num--card) {
  display: block;
  width: auto;
  height: auto;
  background: none;
  border-radius: 0;
  color: var(--accent);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}
.pi-body :deep(div:has(> .pi-num--card) > div:first-of-type) {
  font-family: var(--serif);
  font-size: 1.05rem;
}

/* tables: dark green header, zebra rows, highlighted key column */
.pi-body :deep(.lgx-table) {
  border-radius: 12px;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
}
.pi-body :deep(.lgx-table thead th) {
  background: var(--green);
  color: var(--cream);
  border-color: var(--green);
  font-weight: 600;
}
.pi-body :deep(.lgx-table tbody tr:nth-child(even) td) { background: rgba(1, 69, 32, 0.045); }
.pi-body :deep(.lgx-table td.col-key) {
  background: #e8f0e4;
  color: var(--green);
  font-weight: 600;
}

/* note/callout box (deeper-guide references) */
.pi-body :deep(div:has(> .ct-fancy-icon)) {
  background: var(--white);
  border: 1px solid #e6e2d6;
  border-left: 3px solid var(--green);
  border-radius: 12px;
  padding: 18px 22px;
  margin: 1.4em 0;
  color: #5b6c63;
}
/* WP's icon sprite isn't loaded here — hide the empty svg */
.pi-body :deep(.ct-fancy-icon) { display: none; }

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
  .pi-grid { grid-template-columns: 1fr; }
  .pi-aside { position: static; }
  .pi-body :deep(div:has(> div > .pi-num--card)) { grid-template-columns: 1fr; }
}
</style>
