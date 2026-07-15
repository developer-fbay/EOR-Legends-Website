<script setup lang="ts">
/**
 * Guide single — blog-article layout: header card beside the gated download
 * form (GF 30), sticky ToC + body, CTA band, FAQs. Body copy summarises the
 * downloadable PDF.
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

const bodyHtml = [
  `<p>${guide.intro}</p><p>Written by Anthony Kettle, CEO of The Legends Agency, this guide draws on years of experience placing South African talent with European and American businesses. It covers the practical side of hiring in South Africa: the labour landscape, employment regulations, taxes, the full employee lifecycle, and hard-won tips from clients who already run teams there.</p>`,

  `<h2>What's inside the guide</h2><p>Eleven pages of practical, on-the-ground knowledge, organised so you can find what you need fast:</p><ul><li><strong>Introduction to South Africa:</strong> the essentials at a glance, from currency and VAT to payroll frequency, public holidays, and even the local lexicon.</li><li><strong>The SA labour landscape:</strong> why a $400 billion economy with 97% English fluency, Africa's top five universities and a European-compatible time zone is such a strong hiring market.</li><li><strong>Employment regulations:</strong> working hours, minimum wage, holiday and sick leave, maternity and paternity leave, unions, and POPIA data protection.</li><li><strong>Taxes in South Africa:</strong> the full income tax bands in rand and pounds, plus the employer contributions (SDL, UIF and COIDA) you need to budget for.</li><li><strong>The employee lifecycle:</strong> hiring, probation, 13th-month bonuses, performance management, and how termination, notice and severance really work.</li><li><strong>Client top tips:</strong> advice from UK, US and German business owners on load shedding, transport, healthcare benefits and visiting your team.</li></ul>`,

  `<h2>Who this guide is for</h2><p>This guide is for founders, HR leaders and operations managers who are considering their first South African hire, or who already employ offshore and want to do it properly. If you have heard about the cost savings but worry about compliance, culture or logistics, it answers the questions that matter before you commit.</p><p>You do not need a local entity, local legal knowledge or previous offshore experience. The guide assumes you are starting from zero and walks through everything a UK or US business needs to understand about employing someone in South Africa.</p>`,

  `<h2>Recruitment in South Africa</h2><p>South Africa combines deep talent pools with strong English fluency and a work ethic our clients consistently praise. Staff can be onboarded quickly, probation typically runs three months, and salaries are discussed monthly rather than annually. The guide explains these norms and the cultural context behind them, so your offer, onboarding and management style land the way you intend.</p>`,

  `<h2>Employer of Record services explained</h2><p>An Employer of Record legally employs your South African team on your behalf. Legends EOR signs the employment contracts, runs the monthly payroll, withholds the correct tax, provides statutory benefits and carries employment-law compliance, while you manage the day-to-day work. The guide shows exactly which obligations sit with the EOR and which stay with you.</p><p>It also covers the details that catch foreign employers out: the CCMA (South Africa's employment court), severance rules of one week per year of service, certificates of service, and why formal performance management processes matter far more than they do in the UK or US.</p>`,

  `<h2>How to get started</h2><p>Fill in the short form above and the guide is yours immediately, free. When you are ready to talk about a real role, request a free cost estimate and we will benchmark the salary, add the true employment costs and show you the all-in monthly figure for your first South African hire.</p>`,
].join('')

const faqs = [
  {
    q: 'What does the guide cover?',
    a: "Everything a foreign business needs to hire in South Africa: an introduction to the country, the labour landscape, employment regulations (working hours, minimum wage, leave, unions and POPIA), the full income tax bands and employer contributions, the employee lifecycle from hiring to termination, and top tips from clients who already run South African teams.",
  },
  {
    q: 'Is the guide really free?',
    a: 'Yes. Enter your details in the form and the PDF downloads immediately. There is no payment step and no obligation; we simply ask for your contact details so we can follow up and see whether we can help with your hiring plans.',
  },
  {
    q: 'Who wrote the guide?',
    a: 'Anthony Kettle, CEO of The Legends Agency. As a South African who lived in Britain, he has spent years helping European and American businesses build teams in South Africa, and the guide distils that first-hand experience.',
  },
  {
    q: 'Do I need a South African entity to act on this guide?',
    a: 'No. The guide explains how an Employer of Record lets you employ South African staff without setting up a local company. Legends EOR signs the contracts, runs payroll, withholds tax and carries compliance, while you manage the work itself.',
  },
]
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
        <h2 class="art-faq__title">Frequently Asked Questions</h2>
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

@media (max-width: 850px) {
  .art-hero__wrap { grid-template-columns: 1fr; justify-items: center; }
  .art-hero__card { text-align: center; }
  .art-hero__form { width: 100%; max-width: 480px; margin-inline: auto; }
  .art-grid { grid-template-columns: 1fr; }
  .art-aside { position: static; }
}
</style>
