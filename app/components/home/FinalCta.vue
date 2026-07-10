<script setup lang="ts">
// Pages with a context-specific form CTA (e.g. service pages) pass their
// heading down so the hero and footer forms match.
withDefaults(defineProps<{ formTitle?: string }>(), {
  formTitle: 'Ready to build your South African team?',
})
</script>

<template>
  <section class="final-cta band-green section fill-screen" :style="{ backgroundImage: 'url(/assets/backgrounds/Form-bg-b.webp)' }">
    <div class="container final-grid">
      <div class="final-copy">
        <h2>Ready To Hire Smarter?</h2>
        <p>
          You've seen the numbers, heard from our clients, and understand how EOR works.
          Take the next step and get a free, personalised cost estimate for your team.
        </p>
        <div class="final-stats">
          <div><span>60%</span><small>avg. savings</small></div>
          <div><span>48hr</span><small>onboarding</small></div>
          <div><span>300+</span><small>hires managed</small></div>
        </div>
      </div>
      <div class="final-form">
        <UiLeadForm :gf-form-id="28" source="footer" :title="formTitle" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.final-cta {
  /* Anchored to the top so the arch is always visible. The image's top is
     transparent above the arch curve — the cream underlay makes it read. */
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-color: var(--cream);
}
.final-grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
}
.final-copy h2 { color: var(--cream); }
.final-copy p { color: var(--green-soft-2); max-width: 46ch; }

.final-stats {
  display: flex;
  gap: clamp(20px, 4vw, 48px);
  margin-top: clamp(1.2rem, 3vh, 2rem);
}
.final-stats div { display: flex; flex-direction: column; }
.final-stats span {
  font-family: var(--serif);
  font-size: clamp(1.6rem, 2.6vw, 2.2rem);
  color: var(--cream);
  line-height: 1.05;
}
.final-stats small {
  color: var(--green-soft-2);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .final-grid { grid-template-columns: 1fr; }
}
</style>
