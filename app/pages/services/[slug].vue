<script setup lang="ts">
/**
 * Service single — template for all 10 services (per the WP design):
 * intro + estimate form, dark-green Overview cards, 3-step How It Works,
 * reviews band, services scroll (current service hidden), CTA band,
 * service-specific FAQ, final estimate section.
 */
import { getService } from '~/data/services'

const route = useRoute()
const service = getService(String(route.params.slug))

if (!service) {
  throw createError({ statusCode: 404, statusMessage: 'Service not found' })
}

usePageSeo({
  title: service.title,
  description: service.excerpt,
})

const contactModal = useState('contact-modal', () => false)
function openContact() {
  contactModal.value = true
}

// Every service shows exactly 4 FAQs; missing ones get placeholder copy
// until the content manager supplies the final wording.
const faqs = computed(() => {
  const list = [...service!.faqs]
  let n = list.length
  while (list.length < 4) {
    n++
    list.push({
      q: `Placeholder question ${n} — final copy coming soon`,
      a: 'Placeholder answer. Your content manager will provide the final wording for this question — it can be edited in app/data/services.ts or via the CMS once services are content-managed.',
    })
  }
  return list.slice(0, 4)
})
</script>

<template>
  <main v-if="service">
    <!-- Fold: intro + form + services carousel fill the first viewport together
         (same pattern as the homepage hero + logo strip) -->
    <div class="svc-fold">
      <section class="svc-intro band-cream section">
        <div class="container svc-intro__grid">
          <div class="svc-intro__copy">
            <h1><em>{{ service.title }}</em><br />In South Africa</h1>
            <p v-for="(p, i) in service.intro" :key="i">{{ p }}</p>
          </div>
          <div class="svc-intro__form">
            <UiLeadForm :gf-form-id="29" :source="`service-${service.slug}`" title="Get a free cost estimate" />
          </div>
        </div>
      </section>

      <!-- Services carousel: nav items with icons, scrolling like the logo strip -->
      <ServicesCarousel />
    </div>

    <!-- Overview (dark green) -->
    <section class="svc-overview band-green section" :style="{ backgroundImage: 'url(/assets/backgrounds/services-bg.webp)' }">
      <div class="container">
        <header class="svc-overview__head">
          <h2>Overview</h2>
          <p>An overview of how things work in detail.</p>
        </header>

        <div
          v-for="(card, i) in service.overview"
          :key="card.title"
          class="svc-ov-card"
          :class="{ 'svc-ov-card--flip': i % 2 === 1 }"
        >
          <div class="svc-ov-card__copy">
            <h3>{{ card.title }}</h3>
            <p v-for="(p, j) in card.paragraphs" :key="j">{{ p }}</p>
            <button
              v-if="i === 0 || i === service.overview.length - 1"
              type="button"
              class="svc-ov-card__cta"
              @click="openContact"
            >
              Contact us
            </button>
          </div>
          <div class="svc-ov-card__img">
            <img :src="card.image" :alt="card.title" loading="lazy" />
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works (3 steps) -->
    <section class="svc-hiw band-cream section">
      <div class="container">
        <header class="svc-hiw__head">
          <h2>How It Works</h2>
        	<p>The same three-step process behind every result above.</p>
        </header>
        <div class="svc-hiw__card">
          <div class="svc-hiw__steps">
            <div v-for="(step, i) in service.steps" :key="step.title" class="svc-step">
              <div class="svc-step__row">
                <div class="svc-step__circle">{{ i + 1 }}</div>
                <div class="svc-step__line" />
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <HomeReviewsCarousel />

    <ServicesScroll :exclude-slug="service.slug" />

    <HomeCtaBand />

    <!-- FAQ -->
    <section class="svc-faq band-cream section">
      <div class="container">
        <h2 class="svc-faq__title">Frequently asked questions</h2>
        <UiFaqAccordion :faqs="faqs" />
      </div>
    </section>

    <HomeFinalCta />
  </main>
</template>

<style scoped>
/* First viewport = header + intro + services carousel, like the homepage fold */
.svc-fold {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - 80px);
}
.svc-fold .svc-intro {
  flex: 1;
  display: flex;
  align-items: center;
}

.svc-intro__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(28px, 5vw, 80px);
  align-items: start;
}
/* Hero-sized headline matching the homepage, with the italic green accent */
.svc-intro__copy h1 {
  font-size: clamp(40px, 3.55vw, 68px);
  margin-bottom: 0.55em;
}
.svc-intro__copy h1 em {
  font-style: italic;
  color: var(--green);
  transition: color 0.35s ease;
  cursor: default;
}
.svc-intro__copy h1 em:hover { color: var(--accent); }
@media (min-width: 993px) and (max-height: 700px) {
  .svc-intro__copy h1 { font-size: clamp(34px, 5.5vh, 44px); }
}
.svc-intro__copy p {
  max-width: 62ch;
  color: var(--body);
}

.svc-overview {
  /* Top-anchored so the arch is always visible; the image's transparent top
     reads as cream against the underlay */
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: var(--cream);
  /* clear the arch curve before the heading starts */
  padding-top: clamp(7rem, 16vh, 12rem);
}
.svc-overview__head {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.svc-overview__head h2 { color: var(--cream); }
.svc-overview__head p { color: var(--green-soft-2); }

.svc-ov-card {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid hsl(0deg 0% 100% / 14%);
  border-radius: 14px;
  padding: clamp(24px, 3.5vw, 48px);
}
.svc-ov-card + .svc-ov-card { margin-top: clamp(24px, 4vh, 40px); }
.svc-ov-card--flip { grid-template-columns: 1fr 1.2fr; }
.svc-ov-card--flip .svc-ov-card__copy { order: 2; }
.svc-ov-card--flip .svc-ov-card__img { order: 1; }
.svc-ov-card__copy h3 {
  color: var(--cream);
  margin-bottom: 0.7em;
}
.svc-ov-card__copy p {
  color: #d4e2d2;
  line-height: 1.7;
}
.svc-ov-card__img img {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  aspect-ratio: 1.03;
}
.svc-ov-card__cta {
  display: inline-flex;
  align-items: center;
  padding: 11px 28px;
  border: 1.5px solid var(--accent);
  border-radius: 999px;
  background: transparent;
  color: var(--cream);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
}
.svc-ov-card__cta:hover { background: var(--accent); color: #fff; }

.svc-hiw__head {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.svc-hiw__head p { color: var(--grey-text); }
.svc-hiw__card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  padding: clamp(24px, 3.5vw, 52px);
}
.svc-hiw__steps {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
}
.svc-step { flex: 1; }
.svc-step__row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.svc-step__circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--green);
  color: var(--cream);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--serif);
  font-size: 15px;
  flex-shrink: 0;
  z-index: 1;
}
.svc-step__line {
  flex: 1;
  height: 2px;
  background: var(--green);
  margin-left: 12px;
  position: relative;
}
.svc-step:last-child .svc-step__line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid var(--green);
}
.svc-step h3 {
  font-family: var(--serif);
  font-size: 1.3rem;
  margin-bottom: 0.4em;
}
.svc-step p {
  font-size: 0.92rem;
  color: var(--grey-text);
  margin: 0;
}

.svc-faq__title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
  position: relative;
}
.svc-faq__title::after {
  content: "";
  display: block;
  width: 56px;
  height: 3px;
  margin: 12px auto 0;
  background: var(--green);
  border-radius: 2px;
}

/* Short laptops (e.g. 1280×587 at 150% scale): compress so the carousel fits the fold */
@media (max-height: 650px) and (min-width: 900px) {
  .svc-fold .svc-intro { padding-block: 0.75rem; }
}

@media (max-width: 900px) {
  .svc-fold { min-height: 0; display: block; }
  .svc-intro__grid { grid-template-columns: 1fr; }
  .svc-ov-card,
  .svc-ov-card--flip { grid-template-columns: 1fr; }
  .svc-ov-card--flip .svc-ov-card__copy { order: 1; }
  .svc-ov-card--flip .svc-ov-card__img { order: 2; }
  .svc-hiw__steps { flex-direction: column; }
  .svc-step__line { display: none; }
}
</style>
