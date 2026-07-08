<script setup lang="ts">
/**
 * Case Studies — scroll-pinned GSAP sequence from the user's code block.
 * Desktop: section pins while slides crossfade on scroll. Mobile/reduced-motion:
 * plain stacked cards (handled by the same CSS as the original).
 */
const slides = [
  {
    stat: '47%',
    title: 'Back-office cost reduction',
    text: 'ThinkWorkforce, a UK recruitment company based in Birmingham, partnered with Legends EOR to build a 12-person support team in Cape Town. Through our recruitment, Employer of Record, and international support services, they reduced back-office costs by 47% while improving operational efficiency and creating additional capacity to support future growth.',
    image: '/assets/case-studies/frame-165-2.png',
    logo: '/assets/case-studies/thinkworkforce-logo.png',
    alt: 'ThinkWorkforce case study',
    link: '/case-studies/thinkworkforce',
  },
  {
    stat: '63%',
    title: 'Back-office cost reduction',
    text: 'Funding Bay, a London-based finance brokerage, partnered with Legends EOR to build a specialist marketing and business development team in Cape Town. Through our recruitment, Employer of Record, and international support services, they reduced back-office costs by 63% while creating additional capacity to support future growth.',
    image: '/assets/case-studies/frame-165.png',
    logo: '/assets/case-studies/FB-logo.png',
    alt: 'Funding Bay case study',
    link: '/case-studies/funding-bay',
  },
  {
    stat: '58%',
    title: 'Back-office cost reduction',
    text: 'Effer Ventures partnered with Legends EOR to build and manage international teams across South Africa, the UK, and India. Through a combination of recruitment, onboarding, HR support, and local compliance management, they reduced back-office costs by 58% while creating the operational infrastructure needed to support continued growth.',
    image: '/assets/case-studies/frame-165-1.png',
    logo: '/assets/case-studies/Effer-Ventures_logo.png',
    alt: 'Effer Ventures case study',
    link: '/case-studies/test-case-study',
  },
]

// Heading letter-bounce is applied page-wide on the homepage (all h2s).
const root = ref<HTMLElement | null>(null)
let mm: gsap.MatchMedia | null = null

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  mm = gsap.matchMedia()
  mm.add('(min-width: 993px) and (prefers-reduced-motion: no-preference)', () => {
    const section = root.value
    if (!section) return

    const slideEls = gsap.utils.toArray<HTMLElement>('.cs-slide', section)

    slideEls.forEach((s, i) => {
      const img = s.querySelector('.cs-img-wrap')
      const items = s.querySelectorAll('.cs-anim')
      gsap.set(s, { opacity: 1, pointerEvents: i === 0 ? 'auto' : 'none' })
      if (i === 0) {
        gsap.set(img, { opacity: 1, scale: 1 })
        gsap.set(items, { opacity: 1, y: 0 })
      } else {
        gsap.set(img, { opacity: 0, scale: 1.05 })
        gsap.set(items, { opacity: 0, y: 42 })
      }
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: section.querySelector('.cs-pin'),
        scrub: 1,
        anticipatePin: 1,
      },
    })

    for (let i = 0; i < slideEls.length - 1; i++) {
      const cur = slideEls[i]!
      const nxt = slideEls[i + 1]!
      tl.to({}, { duration: 0.7 })
        .set(cur, { pointerEvents: 'none', immediateRender: false })
        .to(cur.querySelectorAll('.cs-anim'), { opacity: 0, y: -28, duration: 0.4, stagger: 0.05 }, '>')
        .to(cur.querySelector('.cs-img-wrap'), { opacity: 0, scale: 1.05, duration: 0.5 }, '<0.1')
        .to(nxt.querySelector('.cs-img-wrap'), { opacity: 1, scale: 1, duration: 0.6 }, '<0.05')
        .set(nxt, { pointerEvents: 'auto', immediateRender: false }, '<')
        .to(nxt.querySelectorAll('.cs-anim'), { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '<0.18')
    }
    tl.to({}, { duration: 0.7 })

    ScrollTrigger.refresh()
  })
})

onBeforeUnmount(() => {
  mm?.revert()
})
</script>

<template>
  <section ref="root" class="cs-scroll band-cream" aria-label="Case studies">
    <div class="cs-pin">
      <header class="cs-header">
        <h2 class="cs-heading">Case Studies</h2>
        <p class="cs-sub">Real companies who built their teams with Legends.</p>
        <div class="cs-header-divider" />
      </header>

      <div class="cs-stage">
        <article v-for="(slide, i) in slides" :key="slide.link" class="cs-slide" :data-slide="i">
          <div class="cs-img-wrap"><img :src="slide.image" :alt="slide.alt" loading="lazy" /></div>
          <div class="cs-content">
            <p class="cs-stat cs-anim">{{ slide.stat }}</p>
            <h3 class="cs-title cs-anim">{{ slide.title }}</h3>
            <p class="cs-text cs-anim">{{ slide.text }}</p>
            <div class="cs-divider cs-anim" />
            <div class="cs-footer cs-anim">
              <NuxtLink class="brand-btn brand-btn--orange" :to="slide.link">Read the full story</NuxtLink>
              <img class="cs-logo" :src="slide.logo" :alt="slide.alt.replace('case study', 'logo')" loading="lazy" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== User's Case Studies CSS (scoped; palette vars from base.css) ===== */
.cs-scroll {
  --ink: #1c1c1c;
  --line: #e7e3d6;
  --nav-h: 72px; /* matches AppHeader height */
  height: 320vh;
  position: relative;
}

.cs-pin {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: calc(var(--nav-h) + clamp(20px, 3vh, 40px)) clamp(20px, 5vw, 80px) clamp(30px, 5vh, 56px);
  box-sizing: border-box;
  overflow: hidden;
}

.cs-header {
  flex: 0 0 auto;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  text-align: center;
}
.cs-heading {
  font-family: var(--serif);
  color: var(--ink);
  font-weight: 400;
  font-size: clamp(30px, 3.4vw, 46px);
  line-height: 1.05;
  margin: 0 0 10px;
}
.cs-sub {
  font-family: var(--sans);
  color: #5b6c63;
  font-weight: 400;
  font-size: clamp(14px, 1.15vw, 17px);
  line-height: 1.5;
  margin: 0 0 clamp(18px, 3vh, 26px);
}
.cs-header-divider {
  height: 1px;
  background: var(--line);
  width: 100%;
}

.cs-stage {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: auto;
  height: clamp(420px, 52vh, 560px);
}

.cs-slide {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 70px);
  align-items: center;
  opacity: 0;
}
.cs-slide[data-slide="0"] { opacity: 1; }

@media (min-width: 993px) {
  .cs-slide { pointer-events: none; }
  .cs-slide[data-slide="0"] { pointer-events: auto; }
}

.cs-img-wrap {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #e9e6dc;
}
.cs-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cs-content { font-family: var(--sans); }
.cs-stat {
  font-family: var(--serif);
  color: var(--green);
  font-size: clamp(46px, 5vw, 68px);
  line-height: 1;
  font-weight: 400;
  margin: 0 0 4px;
}
.cs-title {
  color: var(--ink);
  font-family: var(--sans);
  font-size: clamp(20px, 2.1vw, 28px);
  font-weight: 600;
  margin: 0 0 18px;
}
.cs-title::after {
  content: "";
  display: block;
  width: 46px;
  height: 3px;
  background: var(--green);
  margin-top: 12px;
  border-radius: 2px;
}
.cs-text {
  color: var(--black);
  font-size: clamp(15px, 1.15vw, 17px);
  line-height: 1.65;
  margin: 0 0 24px;
  max-width: 46ch;
}
.cs-divider {
  height: 1px;
  background: var(--line);
  margin: 0 0 22px;
}
.cs-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.cs-logo {
  height: 32px;
  width: auto;
  max-width: 210px;
  object-fit: contain;
  display: block;
}

@media (max-width: 992px) {
  .cs-scroll { height: auto; }
  .cs-pin { height: auto; display: block; padding: 48px 20px; }
  .cs-header { margin-bottom: 40px; }
  .cs-stage { height: auto; margin: 0 auto; }
  .cs-slide {
    position: static;
    opacity: 1 !important;
    gap: 22px;
    margin-bottom: 100px;
    transform: none !important;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .cs-img-wrap { height: auto; aspect-ratio: 4/3; }
}

@media (max-width: 532px) {
  .cs-footer {
    justify-content: center;
    gap: 40px;
  }
}

/* Reduced motion on desktop: stack instead of pin */
@media (min-width: 993px) and (prefers-reduced-motion: reduce) {
  .cs-scroll { height: auto; }
  .cs-pin { height: auto; display: block; }
  .cs-stage { height: auto; }
  .cs-slide {
    position: static;
    opacity: 1 !important;
    pointer-events: auto !important;
    margin-bottom: 56px;
  }
  .cs-img-wrap { height: clamp(320px, 40vh, 460px); }
}
</style>
