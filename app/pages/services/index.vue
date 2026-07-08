<script setup lang="ts">
// Services archive — hero, 10 service cards, then shared bands (per WP design).
import { SERVICES } from '~/data/services'

usePageSeo({
  title: 'Our EOR & Staffing Solutions',
  description:
    'Comprehensive compliance, payroll, and HR support for UK businesses entering the South African market.',
})
</script>

<template>
  <main>
    <section class="svc-hero band-cream">
      <div class="container">
        <h1>Our EOR &amp; Staffing Solutions</h1>
        <p class="svc-sub">
          Comprehensive compliance, payroll, and HR support for UK businesses entering the
          South African market
        </p>
      </div>
    </section>

    <section class="svc-grid-wrap band-cream section">
      <div class="container">
        <div class="svc-grid">
          <article v-for="s in SERVICES" :key="s.slug" class="svc-card">
            <NuxtLink :to="`/services/${s.slug}`" class="svc-card__img" tabindex="-1" aria-hidden="true">
              <img :src="`/assets/services/card-${s.slug}.webp`" :alt="s.title" loading="lazy" />
            </NuxtLink>
            <h2>{{ s.title }}</h2>
            <p>{{ s.excerpt }}</p>
            <NuxtLink :to="`/services/${s.slug}`" class="brand-btn brand-btn--orange">Read more</NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <HomeCtaBand />
    <HomeTalentShowcase />
    <HomeFinalCta />
  </main>
</template>

<style scoped>
.svc-hero {
  padding-block: clamp(2.5rem, 7vh, 4.5rem) 0;
  text-align: center;
}
.svc-sub {
  max-width: 64ch;
  margin: 0 auto;
  color: var(--grey-text);
}
.svc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 2.6vw, 34px);
  justify-items: stretch;
}
.svc-card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 16px 16px 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.svc-card__img {
  display: block;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}
.svc-card__img img {
  width: 100%;
  aspect-ratio: 8 / 7;
  object-fit: cover;
  filter: grayscale(100%);
  transition: transform 0.35s ease, filter 0.35s ease;
}
.svc-card:hover .svc-card__img img {
  transform: scale(1.04);
  filter: grayscale(0%);
}
.svc-card h2 {
  font-family: var(--serif);
  font-size: 1.35rem;
  margin: 6px 0 0;
}
.svc-card p {
  font-size: 0.88rem;
  color: var(--grey-text);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 992px) {
  .svc-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .svc-grid { grid-template-columns: 1fr; }
}
</style>
