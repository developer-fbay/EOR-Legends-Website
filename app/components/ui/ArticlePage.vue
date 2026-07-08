<script setup lang="ts">
/**
 * Shared article single template — blogs, news articles, HR glossary,
 * problem pillars/clusters. Matches the WP single design:
 * header card (title/category/date/author) beside the featured image,
 * press logos strip, sticky ToC + body, CTA band, per-article FAQ accordion.
 */
import type { ContentRow } from '~/composables/useContent'

const props = defineProps<{
  article: ContentRow
  backTo: string
  backLabel: string
  category?: string
}>()

const articleEl = ref<HTMLElement | null>(null)

const dateLabel = computed(() =>
  props.article.published_at
    ? new Date(props.article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : '',
)

// Per-article FAQs are stored as an HTML comment appended to the body:
// <!--FAQS:[{"q":"…","a":"…"}]-->
const faqs = computed<{ q: string; a: string }[]>(() => {
  const m = (props.article.body || '').match(/<!--FAQS:([\s\S]*?)-->/)
  if (!m) return []
  try {
    return JSON.parse(m[1]!)
  } catch {
    return []
  }
})

const bodyHtml = computed(() => (props.article.body || '').replace(/<!--FAQS:[\s\S]*?-->/g, ''))

// Structured data: Article (+ FAQPage when the article has FAQs)
const route = useRoute()
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        const graph: any[] = [
          {
            '@type': 'Article',
            headline: props.article.title,
            description: props.article.excerpt || undefined,
            image: props.article.featured_image || undefined,
            datePublished: props.article.published_at || undefined,
            dateModified: props.article.updated_at || props.article.published_at || undefined,
            author: { '@type': 'Person', name: 'Michael van Niekerk' },
            publisher: { '@id': 'https://legendseor.com/#organization' },
            mainEntityOfPage: `https://legendseor.com${route.path}`,
          },
        ]
        if (faqs.value.length) {
          graph.push({
            '@type': 'FAQPage',
            mainEntity: faqs.value.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })
        }
        return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })
      }),
    },
  ],
})
</script>

<template>
  <main id="top">
    <!-- Header: white card over/beside the featured image -->
    <section class="art-hero band-cream">
      <div class="container">
        <div class="art-hero__wrap" :class="{ 'art-hero__wrap--no-img': !article.featured_image }">
          <div class="art-hero__card">
            <NuxtLink :to="backTo" class="art-back">← {{ backLabel }}</NuxtLink>
            <h1>{{ article.title }}</h1>
            <div class="art-meta">
              <p v-if="dateLabel"><strong>Date Published:</strong> {{ dateLabel }}</p>
            </div>
            <p class="art-meta__author"><strong>Written By:</strong> Michael van Niekerk</p>
          </div>
          <div v-if="article.featured_image" class="art-hero__img">
            <img :src="article.featured_image" :alt="article.title" />
          </div>
        </div>
      </div>
    </section>

    <section class="art-body band-cream">
      <div class="container art-grid">
        <aside class="art-aside">
          <UiTocSidebar :article-el="articleEl" />
        </aside>
        <article ref="articleEl" class="art-content" v-html="bodyHtml" />
      </div>
    </section>

    <HomeCtaBand />

    <!-- Per-article FAQ -->
    <section v-if="faqs.length" class="art-faq band-cream section">
      <div class="container">
        <h2 class="art-faq__title">Frequently asked questions</h2>
        <UiFaqAccordion :faqs="faqs" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.art-hero {
  padding-block: clamp(2rem, 6vh, 3.5rem) clamp(1rem, 3vh, 2rem);
}
.art-hero__wrap {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  min-height: 300px;
  align-items: center;
}
.art-hero__img {
  grid-area: 1 / 1;
  justify-self: end;
  width: min(62%, 900px);
  border-radius: 14px;
  overflow: hidden;
}
.art-hero__img img {
  width: 100%;
  aspect-ratio: 2.3;
  object-fit: cover;
  display: block;
}
.art-hero__card {
  grid-area: 1 / 1;
  z-index: 1;
  align-self: center;
  width: min(46%, 560px);
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: clamp(20px, 2.6vw, 36px);
}
.art-hero__wrap--no-img .art-hero__card {
  width: 100%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}
.art-back {
  display: inline-block;
  color: var(--grey-mid);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 10px;
}
.art-back:hover { color: var(--green); }
.art-hero__card h1 {
  font-size: clamp(1.6rem, 2.2vw, 2.1rem);
  margin-bottom: 0.7em;
}
.art-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 28px;
  font-size: 0.9rem;
}
.art-meta p { margin: 0 0 8px; }
.art-meta strong { font-weight: 600; }
.art-meta__cat { color: var(--green); font-weight: 500; }
.art-meta__author {
  font-size: 0.9rem;
  margin: 0;
}
.art-meta__author strong { font-weight: 600; }

.art-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
  padding-block: clamp(1.5rem, 4vh, 2.5rem) var(--section-pad);
}
.art-aside {
  position: sticky;
  top: 110px;
}

.art-content :deep(h2) {
  font-family: var(--sans);
  font-weight: 700;
  font-size: clamp(1.35rem, 1.8vw, 1.7rem);
  margin: 1.6em 0 0.6em;
  scroll-margin-top: 120px;
}
.art-content :deep(h2:first-child) { margin-top: 0; }
.art-content :deep(h3) {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 1.15rem;
  margin: 1.4em 0 0.5em;
}
.art-content :deep(p) {
  line-height: 1.75;
  margin-bottom: 1.1em;
}
.art-content :deep(img) {
  border-radius: 12px;
  margin: 1.2em 0;
  height: auto;
}
.art-content :deep(a) { color: var(--green); }
.art-content :deep(a:hover) { color: var(--accent); }
.art-content :deep(ul),
.art-content :deep(ol) {
  padding-left: 1.4em;
  margin-bottom: 1.1em;
  line-height: 1.75;
}
.art-content :deep(blockquote) {
  border-left: 3px solid var(--green);
  margin: 1.2em 0;
  padding: 0.4em 0 0.4em 1.2em;
  color: var(--grey-text);
}
.art-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1.2em 0;
  font-size: 0.92rem;
}
.art-content :deep(th),
.art-content :deep(td) {
  border: 1px solid #e2ded4;
  padding: 10px 12px;
  text-align: left;
}
.art-content :deep(th) { background: rgba(1, 69, 32, 0.05); }

.art-faq__title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.art-faq__title::after {
  content: "";
  display: block;
  width: 56px;
  height: 3px;
  margin: 12px auto 0;
  background: var(--green);
  border-radius: 2px;
}

@media (max-width: 900px) {
  .art-hero__wrap { display: block; }
  .art-hero__img {
    width: 100%;
    margin-bottom: -60px;
  }
  .art-hero__card {
    position: relative;
    width: calc(100% - 24px);
    margin-inline: auto;
  }
  .art-grid { grid-template-columns: 1fr; }
  .art-aside { position: static; }
}
</style>
