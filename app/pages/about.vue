<script setup lang="ts">
// About Us — matches the WP page: hero + stats card, press strip, 3-step
// About timeline, then shared bands (CTA, Why An EOR, reviews), Find out more
// cards and the final estimate section.
usePageSeo({
  title: 'About Us',
  description:
    "We're a local Employer of Record handling the full employment lifecycle for global companies building teams in South Africa. Real people, real expertise, real support on the ground.",
})

const stats = [
  { value: '408', label: 'EOR Employees' },
  { value: '117', label: 'International Clients' },
  { value: '25+', label: 'Years of experience' },
]

const steps = [
  {
    title: 'Who We Are',
    text: "We're an employer of record and hiring partner based in Cape Town and Johannesburg. We help global businesses hire and manage remote talent in South Africa without setting up a local entity. We handle everything from recruitment and legal employment to payroll, compliance, HR, IT support, and office space.",
  },
  {
    title: 'Why We Exist',
    text: "South Africa has exceptional talent, competitive costs, and a favourable time zone. But hiring here isn't simple and labour law is complex. We exist so you can access South African talent without the complexity, cost, or risk of doing it yourself.",
  },
  {
    title: 'How We Work',
    text: "We're not a self-serve platform. You work with dedicated account managers who know your business. When your team needs IT support, office space, or HR guidance, they're dealing with people in their city, not a support ticket queue.",
  },
]

const findOutMore = [
  {
    title: 'Blogs',
    text: 'Expert guidance on South African employment and global team management.',
    to: '/learn',
  },
  {
    title: 'News',
    text: 'Company updates and industry developments that impact your workforce strategy.',
    to: '/news',
  },
  {
    title: 'Case Studies',
    text: 'See how international businesses successfully hire and operate in South Africa.',
    to: '/case-studies',
  },
]
</script>

<template>
  <main>
    <!-- Hero + stats -->
    <section class="ab-hero band-cream">
      <div class="container">
        <h1>Together We're Building The Future Of Borderless Talent</h1>
        <p class="ab-sub">
          We're a local Employer of Record handling the full employment lifecycle for global
          companies building teams in South Africa. Real people, real expertise, real support
          on the ground.
        </p>
        <div class="ab-stats">
          <div v-for="s in stats" :key="s.label" class="ab-stat">
            <span class="ab-stat__value">{{ s.value }}</span>
            <span class="ab-stat__label">{{ s.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <HomePressLogos />

    <!-- About Us 3-step timeline -->
    <section class="ab-about band-cream section">
      <div class="container">
        <h2 class="ab-about__title">About Us</h2>
        <div class="ab-card">
          <div class="ab-steps">
            <div v-for="(s, i) in steps" :key="s.title" class="ab-step">
              <div class="ab-circle-row">
                <div class="ab-circle">{{ i + 1 }}</div>
                <div class="ab-line" />
              </div>
              <h3 class="ab-step__title">{{ s.title }}</h3>
              <p class="ab-step__text">{{ s.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <HomeCtaBand />
    <HomeWhyEor />
    <HomeReviewsCarousel />

    <!-- Find out more -->
    <section class="ab-more band-cream section">
      <div class="container">
        <h2 class="ab-more__title">Find out more</h2>
        <div class="ab-more-grid">
          <article v-for="card in findOutMore" :key="card.title" class="ab-more-card">
            <img src="/assets/backgrounds/find-out-more-card.png" :alt="card.title" loading="lazy" />
            <h3>{{ card.title }}</h3>
            <p>{{ card.text }}</p>
            <NuxtLink :to="card.to" class="brand-btn brand-btn--orange">Read more</NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <HomeFinalCta />
  </main>
</template>

<style scoped>
.ab-hero {
  padding-block: clamp(2.5rem, 7vh, 5rem) clamp(2rem, 5vh, 3.5rem);
  text-align: center;
}
.ab-hero h1 {
  max-width: 22ch;
  margin-inline: auto;
}
.ab-sub {
  max-width: 62ch;
  margin: 0 auto clamp(1.5rem, 4vh, 2.5rem);
  color: var(--grey-text);
}
.ab-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  max-width: 860px;
  margin-inline: auto;
  border: 1px solid #e2ded4;
  border-radius: 12px;
  background: transparent;
}
.ab-stat {
  padding: 22px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ab-stat + .ab-stat { border-left: 1px solid #e2ded4; }
.ab-stat__value {
  font-family: var(--serif);
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  color: var(--green);
  line-height: 1.05;
}
.ab-stat__label {
  font-size: 0.9rem;
  color: var(--grey-text);
}

.ab-about__title,
.ab-more__title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.ab-card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(24px, 3.5vw, 48px);
}
.ab-steps {
  display: flex;
  gap: clamp(20px, 3vw, 40px);
}
.ab-step { flex: 1; }
.ab-circle-row {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 14px;
}
.ab-circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--serif);
  font-size: 15px;
  flex-shrink: 0;
  z-index: 1;
}
.ab-line {
  flex: 1;
  height: 2px;
  background: var(--accent);
  margin-left: 12px;
  position: relative;
}
.ab-step:last-child .ab-line::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 10px solid var(--accent);
}
.ab-step__title {
  font-family: var(--serif);
  font-size: 1.25rem;
  margin-bottom: 0.5em;
}
.ab-step__text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--grey-text);
  margin: 0;
}

.ab-more-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(20px, 3vw, 36px);
}
.ab-more-card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  padding: 18px 18px 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
.ab-more-card img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  filter: grayscale(100%);
  transition: filter 0.35s ease, transform 0.35s ease;
}
.ab-more-card:hover img {
  filter: grayscale(0%);
  transform: scale(1.02);
}
.ab-more-card h3 {
  font-family: var(--serif);
  font-size: 1.3rem;
  margin: 6px 0 0;
}
.ab-more-card p {
  font-size: 0.9rem;
  color: var(--grey-text);
  margin: 0;
  flex: 1;
}

@media (max-width: 900px) {
  .ab-steps { flex-direction: column; }
  .ab-line { display: none; }
  .ab-more-grid { grid-template-columns: 1fr; }
  .ab-stats { grid-template-columns: 1fr; }
  .ab-stat + .ab-stat {
    border-left: none;
    border-top: 1px solid #e2ded4;
  }
}
</style>
