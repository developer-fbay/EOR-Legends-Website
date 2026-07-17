<script setup lang="ts">
const { ctaText, trackClick } = useCtaVariant()
</script>

<template>
  <section class="cta-band band-green">
    <div class="container cta-inner">
      <div>
        <h2>Ready to cut hiring costs by up to 60%?</h2>
        <p>Get a personalised South African hiring cost comparison from our team within 24 hours.</p>
      </div>
      <NuxtLink to="/contact" class="brand-btn brand-btn--outline" @click="trackClick('cta-band')">{{ ctaText('Schedule a free consultation', 'cta-band') }}</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.cta-band {
  padding-block: clamp(2rem, 5vh, 3.5rem);
}
.cta-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  flex-wrap: wrap;
}
.cta-inner h2 {
  color: var(--cream);
  font-size: clamp(1.4rem, 2.4vw, 2rem);
  margin-bottom: 0.2em;
}
.cta-inner p {
  color: var(--green-soft-2);
  margin: 0;
}
</style>
