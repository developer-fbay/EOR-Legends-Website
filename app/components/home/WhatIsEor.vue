<script setup lang="ts">
// "What Is An EOR?" — two white cards side by side (per the WP design):
// left = definition + numbered "How it works" steps, right = FAQ accordion.
// Copy transcribed from the WP screenshot.
const howItWorks = [
  { lead: 'Define the role and budget.', text: 'Use our Salary Benchmarking Tool to compare the SA cost against the UK-equivalent in pounds sterling.' },
  { lead: 'Recruit your team member.', text: 'Run the process yourself or with a partner; you choose who joins.' },
  { lead: 'We become the legal employer.', text: 'Legends signs the SA employment contract and handles payroll, tax, and statutory compliance.' },
  { lead: 'You manage day to day.', text: 'Your team member takes direction from you; we run the back office in the background.' },
]

const faqs = [
  {
    q: 'What is an Employer of Record and how is it different from a recruitment agency?',
    a: "An EOR is the legal employer of your SA team member; we handle the contract, payroll, tax, and compliance while you direct the work. A recruiter just finds the person and steps away; an EOR employs them, no local entity needed. Unlike a PEO, we don't require you to have your own SA entity.",
  },
  {
    q: 'Who does the SA team member work for, Legends EOR or my company?',
    a: 'Legally, Legends EOR is the employer — we hold the contract, payroll, tax, and compliance obligations. Operationally, the person works for you: your projects, your management, your culture.',
  },
  {
    q: 'Can I hire just one person, or is there a minimum?',
    a: 'You can hire a single person. There is no minimum team size — many clients start with one hire and grow from there.',
  },
  {
    q: 'How do I pay, and what are the fees?',
    a: 'You receive one itemised monthly invoice in sterling covering salary, statutory contributions, benefits and our management fee — no hidden costs.',
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
    a: 'We manage the exit compliantly under South African labour law — notice periods, documentation and any statutory requirements — protecting you from CCMA disputes.',
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
        <h2>What Is An EOR?</h2>
        <p>
          New to EOR? Here's how it works and answers to the most common<br />
          questions we get from companies looking to hire in South Africa
        </p>
      </header>

      <div class="wie-grid">
        <!-- LEFT card: definition + steps -->
        <div class="wie-card">
          <h3 class="wie-card__title">What is an Employer of Record?</h3>
          <p class="wie-card__body">
            An Employer of Record (EOR) is a third-party organisation that legally employs
            workers in another country on your behalf. For a UK business, that means hiring
            full-time team members in South Africa without setting up a local entity,
            navigating SA employment law, or running cross-border payroll.
          </p>

          <h4 class="wie-hiw">How it works</h4>
          <ol class="wie-steps">
            <li v-for="(s, i) in howItWorks" :key="i" class="wie-step">
              <span class="wie-step__num">{{ i + 1 }}</span>
              <p><strong>{{ s.lead }}</strong> {{ s.text }}</p>
            </li>
          </ol>
        </div>

        <!-- RIGHT card: FAQ -->
        <div class="wie-card">
          <h3 class="wie-card__title">Frequently asked questions</h3>
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
  align-items: start;
  max-width: 1180px;
  margin-inline: auto;
}

/* Both columns are white cards */
.wie-card {
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

.wie-hiw {
  font-family: var(--serif);
  font-size: 1.35rem;
  font-weight: 400;
  margin: 0 0 0.7em;
}

/* Numbered steps in soft rounded boxes with orange number circles */
.wie-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.wie-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #faf6ef;
  border: 1px solid #f0ece3;
  border-radius: 10px;
  padding: 14px 16px;
}
.wie-step__num {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 2px;
}
.wie-step p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
}
.wie-step strong { font-weight: 600; }

/* FAQ list */
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
  .wie-head p br { display: none; }
}
</style>
