<script setup lang="ts">
// Left card: staffing-insights resource links (unlinked ones get URLs when
// their pillar pages publish).
const resourceLinks = [
  {
    linkText: 'The true cost of an employee in the UK 2026',
    to: '/staffing-insights/true-cost-of-an-employee-in-the-uk',
  },
  {
    linkText: 'Permanent establishment: a guide for UK businesses hiring abroad',
    to: '/staffing-insights/permanent-establishment-guide',
  },
  {
    linkText: 'When good people leave: the true cost of employee turnover',
    to: null,
  },
  {
    linkText: 'The real disadvantages of outsourcing',
    to: null,
  },
  {
    linkText: 'The Employment Rights Act 2025: what UK employers need to know',
    to: null,
  },
]

const faqs = [
  {
    q: 'What is an Employer of Record and how is it different from a recruitment agency?',
    a: "An EOR is the legal employer of your SA team member; we handle the contract, payroll, tax, and compliance while you direct the work. A recruiter just finds the person and steps away; an EOR employs them, no local entity needed. Unlike a PEO, we don't require you to have your own SA entity.",
  },
  {
    q: 'Who does the SA team member work for, Legends EOR or my company?',
    a: 'Legally, Legends EOR is the employer, and we hold the contract, payroll, tax, and compliance obligations. Operationally, the person works for you: your projects, your management, your culture.',
  },
  {
    q: 'Can I hire just one person, or is there a minimum?',
    a: 'You can hire a single person. There is no minimum team size. Many clients start with one hire and grow from there.',
  },
  {
    q: 'How do I pay, and what are the fees?',
    a: 'You receive one itemised monthly invoice in sterling covering salary, statutory contributions, benefits and our management fee, with no hidden costs.',
  },
  {
    q: 'How long does it take to hire someone in South Africa through an EOR?',
    a: 'Onboarding an identified candidate takes 1–2 weeks. Including recruitment, expect roughly 6–7 weeks from brief to a working hire.',
  },
  {
    q: 'Who owns the intellectual property my SA team member creates?',
    a: 'You do. Employment contracts assign all intellectual property created by the employee to your company.',
  },
  {
    q: "What happens if it doesn't work out with a hire?",
    a: 'We manage the exit compliantly under South African labour law, including notice periods, documentation and any statutory requirements, protecting you from CCMA disputes.',
  },
]

const open = ref<number | null>(0)
function toggle(i: number) {
  open.value = open.value === i ? null : i
}

// FAQPage structured data — these are real, curated answers
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }),
    },
  ],
})
</script>

<template>
  <section class="wie band-cream section fill-screen">
    <div class="container">
      <header class="wie-head">
        <h2>Got questions about hiring in South Africa?</h2>
        <p>
          Here's how it works and answers to the most common questions we get from companies
          looking to hire in South Africa.
        </p>
      </header>

      <div class="wie-grid">
        <!-- LEFT card: questions + resource links -->
        <div class="wie-card">
          <h3 class="wie-card__title">Educational Resources</h3>

          <ul class="wie-resources">
            <li v-for="(item, i) in resourceLinks" :key="i">
              <NuxtLink v-if="item.to" :to="item.to" class="wie-resource wie-resource--linked">
                <p class="wie-resource__text">{{ item.linkText }}</p>
                <span class="wie-resource__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
                </span>
              </NuxtLink>
              <div v-else class="wie-resource">
                <p class="wie-resource__text">{{ item.linkText }}</p>
                <span class="wie-resource__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
                </span>
              </div>
            </li>
          </ul>
        </div>

        <!-- RIGHT card: FAQ -->
        <div class="wie-card">
          <h3 class="wie-card__title">Frequently Asked Questions</h3>
          <div class="wie-faq">
            <div v-for="(f, i) in faqs" :key="i" class="wie-faq__item">
              <button class="wie-faq__q" :aria-expanded="open === i" @click="toggle(i)">
                <span>{{ f.q }}</span>
                <span class="wie-faq__icon" aria-hidden="true">{{ open === i ? '×' : '+' }}</span>
              </button>
              <div v-show="open === i" class="wie-faq__a">
                <p>{{ f.a }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.wie.section {
  padding-block: clamp(4.5rem, 10vh, 8rem);
}

.wie-head {
  text-align: center;
  margin: 0 auto clamp(1.6rem, 4vh, 2.6rem);
}
.wie-head p {
  color: #5b6c63; /* muted green subtitle, as sampled from the WP screenshot */
  margin: 0.6em 0 0;
}

.wie-grid {
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: clamp(20px, 2.6vw, 36px);
  align-items: stretch;
  max-width: 1180px;
  margin-inline: auto;
}

/* Both columns are white cards */
.wie-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(28px, 3vw, 44px);
}
.wie-card__title {
  font-family: var(--serif);
  font-size: clamp(1.4rem, 1.8vw, 1.75rem);
  margin: 0 0 0.7em;
}
.wie-card__title::after {
  content: "";
  display: block;
  width: 48px;
  height: 3px;
  margin-top: 10px;
  background: var(--green);
  border-radius: 2px;
}
.wie-card__body {
  line-height: 1.7;
  margin-bottom: 1.4em;
}

.wie-resources {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}
.wie-resource {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  background: #faf6ef;
  border: 1px solid #f0ece3;
  border-radius: 10px;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, background 0.2s ease;
}
/* arrow in a circle, same treatment as the FAQ open/close icon */
.wie-resource__icon {
  flex: none;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.wie-resource__icon svg { width: 14px; height: 14px; }
.wie-resource--linked {
  cursor: pointer;
}
.wie-resource--linked:hover {
  border-color: var(--green);
  background: #f5f1e8;
}
.wie-resource__text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--green);
}
.wie-resource--linked:hover .wie-resource__text {
  color: var(--accent);
}
.wie-resource:not(.wie-resource--linked) .wie-resource__text {
  color: var(--body);
}

/* FAQ list */
.wie-faq {
  flex: 1;
}
.wie-faq__item + .wie-faq__item { border-top: 1px solid #efece5; }
.wie-faq__q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 15px 0;
  background: none;
  border: none;
  font-family: var(--sans);
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  text-align: left;
  color: var(--body);
  cursor: pointer;
}
.wie-faq__icon {
  flex: none;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  line-height: 1;
}
.wie-faq__a {
  padding: 0 40px 16px 0;
  line-height: 1.65;
}
.wie-faq__a p { margin: 0; }

@media (max-width: 900px) {
  .wie-grid { grid-template-columns: 1fr; }
}
</style>
