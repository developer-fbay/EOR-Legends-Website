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
    text: 'Our team will walk you through employment options, timelines, compliance requirements, and how our Employer of Record service removes the need for an entity.',
  },
]

const faqs = [
  {
    q: 'Where does the salary data come from?',
    a: 'The benchmarks are built from real placements and live market data across the roles we hire for, combined with published salary surveys for each country. We review the figures regularly so the ranges reflect what candidates actually accept today, not last year.',
  },
  {
    q: 'What currency are the results shown in?',
    a: 'Results are shown in the currency of the country you select, converted using current exchange rates. That makes it easy to compare a South African salary directly against what you would pay for the same role at home.',
  },
  {
    q: 'Does the salary shown include employment costs and fees?',
    a: 'The benchmark shows the gross salary range for the role. On top of that, employing in South Africa adds modest statutory costs for the employer, far lower than UK National Insurance. Request a free cost estimate and we will show you the all-in monthly figure, including our EOR fee, with no hidden extras.',
  },
  {
    q: 'How accurate is the benchmark for my specific role?',
    a: 'The ranges are a reliable starting point for budgeting, but the right salary always depends on seniority, skills and industry. Send us the job spec and we will benchmark it precisely against the current market, free and with no obligation.',
  },
]
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
        <button type="button" class="brand-btn brand-btn--orange" @click="openContact">Contact us</button>
      </div>
    </section>

    <HomePressLogos />

    <HomeSalaryCalculator />

    <!-- Content block 1: image left, copy right -->
    <section class="tool-block band-cream section">
      <div class="container tool-block__grid">
        <div class="tool-block__img">
          <img src="/assets/services/service-photo-1.webp" alt="Salary benchmarking consultation" loading="lazy" />
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
          <img src="/assets/services/service-photo-2.webp" alt="Comparing salaries by country" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- How It Works (3 steps) -->
    <section class="tool-hiw band-green section" :style="{ backgroundImage: 'url(/assets/backgrounds/Process-bg.webp)' }">
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
        <h2 class="tool-faq__title">Frequently Asked Questions</h2>
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
/* hover fill: sweeps from the number across the line (same as homepage) */
.tool-step__line::before {
  content: '';
  position: absolute;
  inset: 0;
  width: 0;
  background: var(--accent);
  transition: width 0.55s ease;
}
.tool-step__row:hover .tool-step__line::before { width: 100%; }
.tool-step__circle { transition: background 0.3s ease, color 0.3s ease; }
.tool-step__row:hover .tool-step__circle { background: var(--accent); color: #fff; }
.tool-step:last-child .tool-step__line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid #c5d9c0;
  transition: border-left-color 0.25s ease 0.45s;
}
.tool-step:last-child .tool-step__row:hover .tool-step__line::after {
  border-left-color: var(--accent);
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
  .tool-hiw__steps { flex-direction: column; gap: 26px; }
  /* stacked timeline: one continuous connector, single arrow at the end */
  .tool-step { position: relative; padding-right: 36px; }
  .tool-step__line {
    position: absolute;
    left: auto;
    right: 8px;
    top: 6px;
    bottom: -32px; /* bridges the 26px step gap so segments read as one line */
    width: 2px;
    height: auto;
    margin: 0;
    flex: none;
  }
  .tool-step__line::after { content: none; }
  /* node dot per step on the connector — marks the steps down the line */
  .tool-step__line::before {
    inset: auto;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #c5d9c0;
    transition: none;
  }
  .tool-step:last-child .tool-step__line { display: block; bottom: 0; }
  .tool-step:last-child .tool-step__line::after {
    content: '';
    position: absolute;
    left: 50%;
    right: auto;
    top: auto;
    bottom: -1px;
    transform: translateX(-50%);
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 10px solid #c5d9c0;
    border-bottom: none;
  }
  /* touch: no hover effect on the connector, circle or arrow */
  .tool-step__row:hover .tool-step__line::before { width: 10px; }
  .tool-step__row:hover .tool-step__circle { background: #c5d9c0; color: #1a3a2a; }
  .tool-step:last-child .tool-step__row:hover .tool-step__line::after { border-top-color: #c5d9c0; }
  .tool-hiw__bottom { flex-direction: column; text-align: center; }
}
</style>
