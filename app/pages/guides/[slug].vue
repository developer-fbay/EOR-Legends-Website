<script setup lang="ts">
/**
 * Guide single — blog-article layout: header card beside the gated download
 * form (GF 30), sticky ToC + body, CTA band, FAQs. Body copy is placeholder
 * until the content manager supplies the final wording.
 */
import { getGuide } from '~/data/guides'

const route = useRoute()
const guide = getGuide(String(route.params.slug))
if (!guide) throw createError({ statusCode: 404, statusMessage: 'Guide not found' })

usePageSeo({
  title: guide.title,
  description: guide.excerpt,
})

const articleEl = ref<HTMLElement | null>(null)

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'

// Placeholder sections — final copy from the content manager replaces these.
const bodyHtml = [
  `<p>${guide.intro}</p><p>${LOREM}</p>`,
  `<h2>What's inside the guide</h2><p>${LOREM}</p><ul><li>Placeholder point one, final copy coming soon.</li><li>Placeholder point two, final copy coming soon.</li><li>Placeholder point three, final copy coming soon.</li></ul>`,
  `<h2>Who this guide is for</h2><p>${LOREM}</p><p>${LOREM}</p>`,
  `<h2>Recruitment in South Africa</h2><p>${LOREM}</p>`,
  `<h2>Employer of Record services explained</h2><p>${LOREM}</p><p>${LOREM}</p>`,
  `<h2>How to get started</h2><p>${LOREM}</p>`,
].join('')

const faqs = Array.from({ length: 4 }, (_, i) => ({
  q: `Placeholder question ${i + 1}, final copy coming soon`,
  a: 'Placeholder answer. Your content manager will provide the final wording for this question.',
}))
</script>

<template>
  <main v-if="guide" id="top">
    <!-- Header: white card beside the download form (form sits where the blog's featured image goes) -->
    <section class="art-hero band-cream">
      <div class="container">
        <div class="art-hero__wrap">
          <div class="art-hero__card">
            <NuxtLink to="/guides" class="art-back">← All guides</NuxtLink>
            <h1>{{ guide.title }}</h1>
            <p class="art-meta__author"><strong>Written By:</strong> {{ guide.author }}</p>
          </div>
          <div class="art-hero__form">
            <UiGuideDownloadForm :pdf-url="guide.pdfUrl" title="Download the free guide" />
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

    <section class="art-faq band-cream section">
      <div class="container">
        <h2 class="art-faq__title">Frequently asked questions</h2>
        <UiFaqAccordion :faqs="faqs" />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Mirrors the blog single (UiArticlePage) layout */
.art-hero {
  padding-block: clamp(2rem, 6vh, 3.5rem) clamp(1rem, 3vh, 2rem);
}
.art-hero__wrap {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
}
.art-hero__card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: clamp(20px, 2.6vw, 36px);
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
.art-meta__author { font-size: 0.9rem; margin: 0; }
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
.art-content :deep(p) {
  line-height: 1.75;
  margin-bottom: 1.1em;
}
.art-content :deep(ul) {
  padding-left: 1.4em;
  margin-bottom: 1.1em;
  line-height: 1.75;
}
.art-content :deep(a) { color: var(--green); }

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
  .art-hero__wrap { grid-template-columns: 1fr; }
  .art-grid { grid-template-columns: 1fr; }
  .art-aside { position: static; }
}
</style>
