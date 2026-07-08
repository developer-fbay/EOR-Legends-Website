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
    image: '/assets/case-studies/frame-165-2.webp',
    logo: '/assets/case-studies/thinkworkforce-logo.png',
    alt: 'ThinkWorkforce case study',
    link: '/case-studies/thinkworkforce',
  },
  {
    stat: '63%',
    title: 'Back-office cost reduction',
    text: 'Funding Bay, a London-based finance brokerage, partnered with Legends EOR to build a specialist marketing and business development team in Cape Town. Through our recruitment, Employer of Record, and international support services, they reduced back-office costs by 63% while creating additional capacity to support future growth.',
    image: '/assets/case-studies/frame-165.webp',
    logo: '/assets/case-studies/FB-logo.png',
    alt: 'Funding Bay case study',
    link: '/case-studies/funding-bay',
  },
  {
    stat: '58%',
    title: 'Back-office cost reduction',
    text: 'Effer Ventures partnered with Legends EOR to build and manage international teams across South Africa, the UK, and India. Through a combination of recruitment, onboarding, HR support, and local compliance management, they reduced back-office costs by 58% while creating the operational infrastructure needed to support continued growth.',
    image: '/assets/case-studies/frame-165-1.webp',
    logo: '/assets/case-studies/Effer-Ventures_logo.png',
    alt: 'Effer Ventures case study',
    link: '/case-studies/effer-ventures',
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
      defaults: { ease: 'power1.inOut' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: section.querySelector('.cs-pin'),
        // higher scrub = softer catch-up, kills the harsh snap feel
        scrub: 1.6,
        anticipatePin: 1,
      },
    })

    for (let i = 0; i < slideEls.length - 1; i++) {
      const cur = slideEls[i]!
      const nxt = slideEls[i + 1]!
      // short holds + long overlapping fades: continuous motion, no dead zones
      tl.to({}, { duration: 0.35 })
        .set(cur, { pointerEvents: 'none', immediateRender: false })
        .to(cur.querySelectorAll('.cs-anim'), { opacity: 0, y: -22, duration: 0.55, stagger: 0.04 }, '>')
        .to(cur.querySelector('.cs-img-wrap'), { opacity: 0, scale: 1.04, duration: 0.7 }, '<0.05')
        .to(nxt.querySelector('.cs-img-wrap'), { opacity: 1, scale: 1, duration: 0.8 }, '<0.15')
        .set(nxt, { pointerEvents: 'auto', immediateRender: false }, '<')
        .to(nxt.querySelectorAll('.cs-anim'), { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, '<0.2')
    }
    tl.to({}, { duration: 0.35 })

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
  height: 280vh;
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
  /* low floor so the pinned screen still fits short laptop viewports */
  height: clamp(280px, 52vh, 520px);
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
  font-size: clamp(38px, 4.4vw, 60px);
  line-height: 1;
  font-weight: 400;
  margin: 0 0 4px;
}
.cs-title {
  color: var(--ink);
  font-family: var(--sans);
  font-size: clamp(19px, 1.9vw, 26px);
  font-weight: 600;
  margin: 0 0 16px;
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
  font-size: clamp(14px, 1.05vw, 16px);
  line-height: 1.6;
  margin: 0 0 20px;
  max-width: 48ch;
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

/* Short laptop viewports (1280×587 etc.): tighter rhythm so nothing is cut off */
@media (min-width: 993px) and (max-height: 700px) {
  .cs-pin { padding-top: calc(var(--nav-h) + 10px); padding-bottom: 18px; }
  .cs-sub { margin-bottom: 12px; }
  .cs-stat { font-size: clamp(32px, 6.5vh, 44px); }
  .cs-title { margin-bottom: 10px; }
  .cs-title::after { margin-top: 8px; }
  .cs-text { margin-bottom: 14px; font-size: 14px; }
  .cs-divider { margin-bottom: 12px; }
  .cs-logo { height: 26px; }
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
