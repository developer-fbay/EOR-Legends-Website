<script setup lang="ts">
// Problem Cluster single — hero + full article body extracted from the
// published WP page.
import { getPillar } from '~/data/staffing-insights'

const route = useRoute()
const pillar = getPillar(String(route.params.slug))
const cluster = pillar?.clusters.find((c) => c.slug === String(route.params.cluster))
if (!pillar || !cluster) throw createError({ statusCode: 404, statusMessage: 'Insight not found' })

const { data: body } = await useAsyncData(`pillar-body-${cluster.slug}`, () =>
  $fetch<{ title: string; bodyHtml: string; faqs: { q: string; a: string }[] }>(`/api/pillar/${cluster!.slug}`).catch(() => null),
)

const title = computed(() => body.value?.title || cluster!.title)
const articleEl = ref<HTMLElement | null>(null)

usePageSeo({
  title: () => title.value,
  description: cluster.intro[0] || pillar.excerpt,
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
  <main v-if="cluster">
    <section class="pi-hero band-cream section">
      <div class="container pi-hero__grid">
        <div class="pi-hero__copy">
          <NuxtLink :to="`/staffing-insights/${pillar!.slug}`" class="pi-back">← Back to pillar</NuxtLink>
          <h1>{{ title }}</h1>
          <p v-for="(p, i) in cluster.intro" :key="i" :class="{ 'pi-lead': i === 0 }">{{ p }}</p>
        </div>
        <div class="pi-hero__form">
          <UiLeadForm :gf-form-id="29" :source="`cluster-${cluster.slug}`" title="Get a free cost estimate" />
        </div>
      </div>
    </section>

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
        <h2 class="pi-faq-title">Frequently asked questions</h2>
        <UiFaqAccordion :faqs="body.faqs" />
      </div>
    </section>

    <HomeCtaBand />
    <HomeWhyEor />
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
  max-width: 26ch;
}
.pi-lead { font-size: 1.1rem; }
.pi-hero__copy p { line-height: 1.75; max-width: 64ch; }
.pi-hero__form { position: sticky; top: 96px; }

.pi-faq-title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
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

/* Extracted article body — same prose treatment as the pillar page */
.pi-body { min-width: 0; }
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

.pi-body :deep(div:has(> .ct-fancy-icon)) {
  background: var(--white);
  border: 1px solid #e6e2d6;
  border-left: 3px solid var(--green);
  border-radius: 12px;
  padding: 18px 22px;
  margin: 1.4em 0;
  color: #5b6c63;
}
.pi-body :deep(.ct-fancy-icon) { display: none; }

.pi-body :deep(.gform_wrapper),
.pi-body :deep(#sbt-tool),
.pi-body :deep(.sbt-tool) { display: none; }

@media (max-width: 850px) {
  .pi-hero__grid { grid-template-columns: 1fr; justify-items: center; }
  .pi-hero__copy { text-align: center; }
  .pi-hero__copy p, .pi-hero__copy ul { margin-inline: auto; }
  .pi-hero__form { position: static; width: 100%; max-width: 480px; margin-inline: auto; }
  .pi-grid { grid-template-columns: 1fr; }
  .pi-aside { position: static; }
  .pi-body :deep(div:has(> div > .pi-num--card)) { grid-template-columns: 1fr; }
}
</style>
