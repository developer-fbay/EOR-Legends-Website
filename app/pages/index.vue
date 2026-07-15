<script setup lang="ts">
usePageSeo({
  title: 'Hire in South Africa, the easy way',
  description:
    'Build your team in South Africa with Legends EOR. We handle payroll, compliance, benefits, offices and equipment. Save up to 60% on salaries with no local entity required.',
})

// Letter bounce disabled per marketing feedback (2026-07) — headings now use
// the CSS rise + green hover in base.css. Uncomment to bring the bounce back.
// const pageEl = ref<HTMLElement | null>(null)
// useLetterBounceOnH2s(pageEl)
</script>

<template>
  <main>
    <!-- Hero + logo carousel share the first fold exactly; the salary
         benchmarking section always starts below it -->
    <div class="hero-fold">
      <HomeHeroSection />
      <HomePressLogos />
    </div>

    <HomeSalaryCalculator />
    <HomeWhyEor />
    <HomeHowItWorks />
    <HomeCaseStudies />
    <HomeCtaBand />
    <HomeTalentShowcase />
    <HomeReviewsCarousel />
    <HomeWhatIsEor />
    <HomeFinalCta />
  </main>
</template>

<style scoped>
/* First fold = header (78px) + hero + logo strip, exactly one screen tall.
   The logo carousel belongs to the hero: it hugs the bottom of the fold with
   its fixed 20px gap, while any spare height centers the hero content. */
.hero-fold {
  display: flex;
  flex-direction: column;
  min-height: calc(100svh - 78px);
}
.hero-fold > :deep(.hero) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
/* Phones keep the full-screen fold too: the compact hero (no form/reviews)
   centers in the first screen, logos hug the bottom, and the salary section
   stays hidden below the fold until the user scrolls.
   lvh (large viewport) instead of svh: on iPhone 15-17 the zone behind
   Safari's collapsing bottom bar sits between svh and lvh — with svh the
   green section peeked through there (Codi's iPhone 17 screenshots). */
@media (max-width: 768px) {
  .hero-fold { min-height: calc(100svh - 78px); min-height: calc(100lvh - 78px); }
}
</style>
