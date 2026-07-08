<script setup lang="ts">
// Salary Benchmarking Tool single page — copy transcribed from the WP screenshot.
usePageSeo({
  title: 'Salary Benchmarking Tool',
  description:
    'Compare salaries across countries and see how your hiring budget can go further. Benchmark global salaries by country and make budget-informed hiring decisions.',
})

const contactModal = useState('contact-modal', () => false)
function openContact() {
  contactModal.value = true
}

const steps = [
  {
    title: 'Enter the role and country',
    text: 'Select the job title and location you are hiring for. Our tool covers roles across technology, operations, sales, marketing, finance, and support functions in over 100 countries.',
  },
  {
    title: 'See competitive salary ranges',
    text: 'Receive benchmark salary data for your selected role and market. Results shown in the currency of your country.',
  },
  {
    title: 'Speak to us',
    text: 'Turn benchmarking insights into an actual hire. Our team will walk you through employment options, timelines, compliance requirements, and how our Employer of Record service removes the need for entity setup or local payroll infrastructure in over 100 countries.',
  },
]

// Placeholder FAQs until the content manager supplies final copy.
const faqs = Array.from({ length: 4 }, (_, i) => ({
  q: `Placeholder question ${i + 1} — final copy coming soon`,
  a: 'Placeholder answer. Your content manager will provide the final wording for this question.',
}))
</script>

<template>
  <main>
    <!-- Hero -->
    <section class="tool-hero band-cream">
      <div class="container">
        <h1>Calculate the True Cost of Your Next International Hire.</h1>
        <p class="tool-hero__sub">
          Compare salaries across countries and see how your hiring budget can go further.
        </p>
        <p class="tool-hero__body">
          Hiring internationally starts with one question: where can we find the right person at
          the right cost? This calculator lets you compare global salary benchmarking by country
          so that you can make a confident, budget-informed decision before you ever make an offer.
        </p>
        <button type="button" class="brand-btn brand-btn--orange" @click="openContact">Contact us</button>
      </div>
    </section>

    <HomePressLogos />

    <HomeSalaryCalculator />

    <!-- Content block 1: image left, copy right -->
    <section class="tool-block band-cream section">
      <div class="container tool-block__grid">
        <div class="tool-block__img">
          <img src="/assets/services/service-photo-1.png" alt="Salary benchmarking consultation" loading="lazy" />
        </div>
        <div class="tool-block__copy">
          <h2>Salary Data You Can Actually Hire From</h2>
          <p>
            Our benchmarking data is not pulled from self-reported surveys or outdated salary
            databases. It reflects real market compensation, statutory costs and employment
            obligations drawn from our work as an Employer of Record operating on the ground in
            South Africa and coordinating with our international hiring partners across multiple
            jurisdictions.
          </p>
          <p>
            When you benchmark a salary with Legends EOR, you are accessing insights from a team
            that employs staff, processes payroll, manages compliance and understands what it
            actually costs to hire compliantly in each market.
          </p>
        </div>
      </div>
    </section>

    <!-- Content block 2: copy left, image right -->
    <section class="tool-block band-cream section" style="padding-top: 0">
      <div class="container tool-block__grid tool-block__grid--flip">
        <div class="tool-block__copy">
          <h2>Compare salaries by country before expanding your team</h2>
          <p>
            See how compensation for the same role varies across markets. Identify cost-effective
            hiring locations without sacrificing talent quality. Understand which countries align
            with your budget before committing to expansion.
          </p>
          <p>
            Wondering if your offer is competitive? Benchmark your proposed salary against local
            market data to reduce the risk of losing candidates to better offers or overpaying
            for roles that do not require premium compensation.
          </p>
          <p>
            Stop guessing what to pay or waiting weeks for compensation reports. Get immediate
            salary insights, understand affordability and move directly into hiring execution
            with an Employer of Record partner who can employ staff on your behalf.
          </p>
        </div>
        <div class="tool-block__img">
          <img src="/assets/services/service-photo-2.png" alt="Comparing salaries by country" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- How It Works (3 steps) -->
    <section class="tool-hiw band-green section" :style="{ backgroundImage: 'url(/assets/backgrounds/Process-bg.png)' }">
      <div class="container">
        <header class="tool-hiw__head">
          <h2>How It Works</h2>
          <p>The same four-step process behind every result above.</p>
        </header>
        <div class="tool-hiw__card">
          <div class="tool-hiw__steps">
            <div v-for="(step, i) in steps" :key="step.title" class="tool-step">
              <div class="tool-step__row">
                <div class="tool-step__circle">{{ i + 1 }}</div>
                <div class="tool-step__line" />
              </div>
              <h3>{{ step.title }}</h3>
              <p>{{ step.text }}</p>
            </div>
          </div>
          <div class="tool-hiw__bottom">
            <p><span>From brief to a working hire in under a month</span> – no subsidiary, no setup, no local admin.</p>
            <button type="button" class="brand-btn brand-btn--outline" @click="openContact">Lets get started →</button>
          </div>
        </div>
      </div>
    </section>

    <HomeCaseStudies />

    <HomeCtaBand />

    <!-- FAQ -->
    <section class="tool-faq band-cream section">
      <div class="container">
        <h2 class="tool-faq__title">Frequently asked questions</h2>
        <UiFaqAccordion :faqs="faqs" />
      </div>
    </section>

    <HomeFinalCta />
  </main>
</template>

<style scoped>
.tool-hero {
  padding-block: clamp(2.5rem, 7vh, 4.5rem) clamp(2rem, 5vh, 3.5rem);
  text-align: center;
}
.tool-hero h1 {
  max-width: 30ch;
  margin-inline: auto;
}
.tool-hero__sub {
  color: var(--grey-text);
  margin: 0.6em auto 1em;
  max-width: 60ch;
}
.tool-hero__body {
  max-width: 78ch;
  margin: 0 auto 1.6em;
}

.tool-block__grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: clamp(28px, 5vw, 90px);
  align-items: center;
}
.tool-block__grid--flip {
  grid-template-columns: 1.15fr 1fr;
}
.tool-block__img img {
  width: 100%;
  border-radius: 14px;
  object-fit: cover;
  aspect-ratio: 1.15;
}
.tool-block__copy h2 {
  max-width: 20ch;
  margin-bottom: 0.7em;
}
.tool-block__copy p {
  line-height: 1.75;
  max-width: 60ch;
}

/* HIW — same treatment as the homepage section */
.tool-hiw {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.tool-hiw__head {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.tool-hiw__head h2 { color: var(--cream); }
.tool-hiw__head p { color: var(--green-soft-2); }
.tool-hiw__card {
  background: #014620b3;
  padding: 50px 52px;
  border: 1px solid hsl(0deg 0% 100% / 14%);
  border-radius: 14px;
}
.tool-hiw__steps {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
}
.tool-step { flex: 1; }
.tool-step__row {
  display: flex;
  align-items: center;
  margin-bottom: 14px;
}
.tool-step__circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #c5d9c0;
  color: #1a3a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--serif);
  font-size: 15px;
  flex-shrink: 0;
  z-index: 1;
}
.tool-step__line {
  flex: 1;
  height: 2px;
  background: #c5d9c0;
  margin-left: 12px;
  position: relative;
}
.tool-step:last-child .tool-step__line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid #c5d9c0;
}
.tool-step h3 {
  font-family: var(--serif);
  font-size: 22px;
  color: #e8f0e4;
  margin-bottom: 0.4em;
}
.tool-step p {
  font-size: 15px;
  color: #9cb89e;
  line-height: 1.6;
  margin: 0;
}
.tool-hiw__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 50px;
  padding-top: 28px;
  border-top: 1px solid rgba(197, 217, 192, 0.15);
}
.tool-hiw__bottom p {
  font-size: 16px;
  color: #e8f0e4;
  margin: 0;
}
.tool-hiw__bottom p span {
  font-family: var(--serif);
  font-size: 17px;
}

.tool-faq__title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.tool-faq__title::after {
  content: "";
  display: block;
  width: 56px;
  height: 3px;
  margin: 12px auto 0;
  background: var(--green);
  border-radius: 2px;
}

@media (max-width: 900px) {
  .tool-block__grid,
  .tool-block__grid--flip { grid-template-columns: 1fr; }
  .tool-hiw__steps { flex-direction: column; gap: 28px; }
  .tool-step__line { display: none; }
  .tool-hiw__bottom { flex-direction: column; text-align: center; }
}
</style>
