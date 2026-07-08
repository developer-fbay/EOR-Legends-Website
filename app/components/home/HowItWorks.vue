<script setup lang="ts">
// "How It Works" 4-step timeline — user's code block converted to a Vue component.
const steps = [
  {
    label: 'DAY 1',
    title: 'Tell us the role',
    desc: "Share the job and budget. We benchmark the salary and confirm what's realistic in South Africa.",
  },
  {
    label: 'WEEK 1',
    title: 'Meet your shortlist',
    desc: 'We source, vet and skills‑test candidates – only the strongest reach your inbox.',
  },
  {
    label: 'WEEK 2',
    title: 'Choose & offer',
    desc: 'You interview and pick. We make the offer and handle every line of the contract.',
  },
  {
    label: 'WEEK 3+',
    title: 'They start – we run it',
    desc: "Payroll, tax, benefits, equipment and compliance, managed locally for as long as they're with you.",
  },
]
</script>

<template>
  <section class="hiw-band band-green section fill-screen" :style="{ backgroundImage: 'url(/assets/backgrounds/Process-bg.webp)' }">
    <div class="container">
      <header class="hiw-head">
        <h2>How It Works</h2>
        <p>The same four-step process behind every South African hire.</p>
      </header>

      <div class="hiw-section">
        <div class="hiw-inner">
          <div class="hiw-steps">
            <div v-for="(step, i) in steps" :key="step.title" class="hiw-step">
              <div class="hiw-circle-row">
                <div class="hiw-circle">{{ i + 1 }}</div>
                <div class="hiw-line" />
              </div>
              <div class="hiw-timeline-label">{{ step.label }}</div>
              <div class="hiw-step-title">{{ step.title }}</div>
              <div class="hiw-step-desc">{{ step.desc }}</div>
            </div>
          </div>
          <div class="hiw-bottom">
            <p><span>From brief to a working hire in under a month</span> – no subsidiary, no setup, no local admin.</p>
            <NuxtLink to="/contact" class="brand-btn brand-btn--outline">Lets get started</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hiw-band {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.hiw-head {
  text-align: center;
  max-width: 720px;
  margin: 0 auto clamp(1.5rem, 4vh, 2.5rem);
}
.hiw-head h2 { color: var(--cream); }
.hiw-head p { color: var(--green-soft-2); }

/* ===== User's How-It-Works CSS (scoped) ===== */
.hiw-section {
  background: #014620b3;
  padding: 50px 52px 50px;
  border: 1px solid hsl(0deg 0% 100% / 14%);
  border-radius: 14px;
}
.hiw-inner { max-width: 1140px; margin: 0 auto; }
.hiw-steps { display: flex; gap: 0; }
.hiw-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.hiw-circle-row { display: flex; align-items: center; width: 100%; }
.hiw-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #c5d9c0;
  color: #1a3a2a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--serif);
  font-weight: 600;
  font-size: 15px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.hiw-line {
  flex: 1;
  height: 2px;
  background: #c5d9c0;
  margin-left: 12px;
  margin-right: 12px;
  position: relative;
}
/* hover fill: sweeps from the number across the line */
.hiw-line::before {
  content: '';
  position: absolute;
  inset: 0;
  width: 0;
  background: var(--accent);
  transition: width 0.55s ease;
}
.hiw-circle-row:hover .hiw-line::before { width: 100%; }
.hiw-circle-row:hover .hiw-circle {
  background: var(--accent);
  color: #fff;
}
.hiw-circle { transition: background 0.3s ease, color 0.3s ease; }
.hiw-step:last-child .hiw-line { margin-right: 0; }
.hiw-step:last-child .hiw-line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid #c5d9c0;
  transition: border-left-color 0.25s ease 0.45s;
}
/* the arrow completes last, once the fill reaches it */
.hiw-step:last-child .hiw-circle-row:hover .hiw-line::after {
  border-left-color: var(--accent);
}
.hiw-timeline-label {
  /* slightly larger than the original 12px, still below the 22px step title */
  font-size: 15px;
  color: #eb3d00;
  margin-top: 14px;
  letter-spacing: 0.5px;
  font-weight: 600;
}
.hiw-step-title {
  font-family: var(--serif);
  font-size: 22px;
  color: #e8f0e4;
  margin-top: 8px;
}
.hiw-step-desc {
  font-size: 15px;
  color: #9cb89e;
  margin-top: 10px;
  line-height: 1.6;
  max-width: 250px;
}
.hiw-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid rgba(197, 217, 192, 0.15);
}
.hiw-bottom p {
  font-size: 16px;
  color: #e8f0e4;
  line-height: 1.5;
  margin: 0;
}
.hiw-bottom p span {
  font-family: var(--serif);
  font-size: 17px;
}

@media (max-width: 768px) {
  .hiw-section { padding: 48px 24px 40px; }
  .hiw-steps { flex-direction: column; gap: 32px; }
  .hiw-line { display: none; }
  .hiw-step-desc { max-width: 100%; text-align: center; }
  .hiw-bottom { flex-direction: column; gap: 24px; text-align: center; }
  .hiw-circle-row { justify-content: center; }
  .hiw-step { align-items: center; }
}

/* Laptop screens: breathing room above and below the card */
@media (min-width: 769px) and (max-height: 820px) {
  .hiw-head { margin-bottom: 1rem; }
  .hiw-section { padding: 34px 44px; }
  .hiw-timeline-label { margin-top: 10px; font-size: 14px; }
  .hiw-step-title { font-size: 20px; }
  .hiw-step-desc { font-size: 14px; margin-top: 8px; }
  .hiw-bottom { margin-top: 28px; padding-top: 18px; }
}
/* 14" laptops at 150%: tighter still */
@media (min-width: 769px) and (max-height: 650px) {
  .hiw-section { padding: 24px 36px; }
  .hiw-bottom { margin-top: 20px; padding-top: 14px; }
}
</style>
