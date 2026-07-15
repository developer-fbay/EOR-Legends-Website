<script setup lang="ts">
// Hero — matches the WP build's hero section: headline left, estimate form right,
// centered stats with dividers, Google Reviews pill. No email address (per design).
// H1 has NO letter bounce — only "Great Teams" turns orange on hover.
const stats = [
  { value: '60%', label: 'Save On Salaries' },
  { value: '81%', label: 'Lower Employer Taxes' },
  { value: '1%', label: 'Elite SA Talent' },
]

// Phones hide the inline form; this button opens the popup contact form instead
const contactModal = useState('contact-modal', () => false)
</script>

<template>
  <section class="hero band-cream">
    <div class="container hero-grid">
      <div class="hero-copy">
        <h1>
          We Build<br /><em>Great Teams</em><br />In South Africa
        </h1>
        <p class="hero-sub">IT, HR, Payroll, Benefits, Office, Equipment - One Stop Shop.</p>

        <div class="hero-stats">
          <div v-for="(s, i) in stats" :key="s.label" class="hero-stat" :class="{ 'hero-stat--divided': i > 0 }">
            <span class="hero-stat__value">{{ s.value }}</span>
            <span class="hero-stat__label">{{ s.label }}</span>
          </div>
        </div>

        <UiGoogleReviews class="hero-reviews" />

        <button type="button" class="brand-btn brand-btn--orange hero-mobile-cta" @click="contactModal = true">
          Speak to our team
        </button>
      </div>

      <div class="hero-form">
        <UiLeadForm :gf-form-id="29" source="header" title="See how much you could save" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Compact hero: the logo carousel below must share the first fold (WP design) */
.hero {
  padding-block: clamp(2rem, 7vh, 5rem) clamp(1.8rem, 4vh, 2.6rem);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: clamp(28px, 6vw, 110px);
  align-items: center;
}
.hero-copy h1 {
  /* Hero headline is larger than the global 40px h1, matching the WP design */
  font-size: clamp(40px, 3.55vw, 68px);
  color: var(--body);
  margin-bottom: 0.55em;
}
.hero-copy h1 em {
  font-style: italic;
  color: var(--green);
  transition: color 0.35s ease;
  cursor: default;
}
/* Only "Great Teams" reacts on hover — turns brand orange */
.hero-copy h1 em:hover {
  color: var(--accent);
}
.hero-sub {
  font-size: clamp(1rem, 1.4vw, 1.3rem);
  color: var(--body);
  margin-bottom: clamp(1.4rem, 4vh, 2.6rem);
}

.hero-stats {
  display: flex;
  align-items: stretch;
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-inline: clamp(18px, 2.6vw, 44px);
}
.hero-stat:first-child { padding-left: 0; }
.hero-stat--divided { border-left: 1px solid #d9d4c7; }
.hero-stat__value {
  font-family: var(--serif);
  font-size: clamp(1.9rem, 3.2vw, 2.9rem);
  color: var(--green);
  line-height: 1.05;
}
.hero-stat__label {
  font-size: clamp(0.85rem, 1vw, 1rem);
  font-weight: 600;
  color: var(--body);
  margin-top: 4px;
}
.hero-reviews {
  margin-top: clamp(1.4rem, 4vh, 2.6rem);
}

/* The popup-trigger button exists only on phones */
.hero-mobile-cta { display: none; }

@media (max-width: 850px) {
  .hero-grid { grid-template-columns: 1fr; justify-items: center; }
  .hero-copy { text-align: center; }
  .hero-stats { justify-content: center; }
  .hero-reviews { margin-inline: auto; }
  .hero-form { width: 100%; max-width: 480px; margin-inline: auto; }
}

/* Phones: no inline form and no Google Reviews pill — a single CTA opens the
   popup form, the logo carousel follows right after, and the hero carries
   equal breathing room above and below */
@media (max-width: 768px) {
  .hero { padding-block: 1.5rem; }
  .hero-form { display: none; }
  .hero-reviews { display: none; }
  /* breathing room so the stacked hero doesn't read squashed (Codi) */
  .hero-copy h1 { margin-bottom: 40px; }
  .hero-sub { margin-bottom: 30px; }
  .hero-mobile-cta {
    display: inline-block;
    /* height-responsive: keeps the button optically centered between the
       USP stats and the logo carousel across iPhone sizes */
    margin-top: clamp(48px, 12vh, 112px);
  }
}

/* Short laptop viewports (1280×587): hero must NOT fill the screen — the
   fold shows hero + logo carousel together, like the WP design */
@media (min-width: 851px) and (max-height: 650px) {
  .hero {
    min-height: 0;
    padding-block: 1.6rem 1.8rem;
  }
  .hero-sub { margin-bottom: 1rem; }
  .hero-stats { margin-top: 0; }
  .hero-reviews { margin-top: 1rem; }
}

/* Laptop heights (incl. 1920@125% with taskbar+search visible): compress so
   the hero + logo carousel always share the first screen */
@media (min-width: 993px) and (max-height: 820px) {
  .hero { padding-block: 1.2rem 0.9rem; }
  .hero-sub { margin-bottom: 1.1rem; }
  .hero-reviews { margin-top: 1.1rem; }
}
</style>
