<script setup lang="ts">
/**
 * Services scroll sequence — the user's sv-scroll GSAP code (blocks 1 + 2
 * merged), auto-hiding the current service like the original engine did via
 * URL slug matching. Desktop: pinned scroll-through; mobile/reduced-motion:
 * stacked cards.
 */
import { SERVICES } from '~/data/services'

const props = defineProps<{ excludeSlug?: string; subtitle?: string }>()

// The WP build splits services into two code blocks; a service page shows the
// block its service belongs to, with the current service auto-hidden.
const BLOCK_1 = ['payroll', 'hr', 'onboarding-offboarding', 'eor-migration', 'contractor-management']
const BLOCK_2 = ['company-culture', 'employee-benefits', 'office-space', 'it-support', 'it-equipment']

const slides = computed(() => {
  const block = props.excludeSlug
    ? (BLOCK_1.includes(props.excludeSlug) ? BLOCK_1 : BLOCK_2)
    : [...BLOCK_1, ...BLOCK_2]
  return block
    .filter((slug) => slug !== props.excludeSlug)
    .map((slug) => SERVICES.find((s) => s.slug === slug)!)
    .filter(Boolean)
})

const root = ref<HTMLElement | null>(null)
let mm: gsap.MatchMedia | null = null

const VH_PER_SLIDE = 110
const seqHeight = computed(() => `${slides.value.length * VH_PER_SLIDE}vh`)

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  mm = gsap.matchMedia()
  mm.add('(min-width: 993px) and (orientation: landscape) and (prefers-reduced-motion: no-preference)', () => {
    const section = root.value
    if (!section) return
    const s = gsap.utils.toArray<HTMLElement>('.sv-slide', section)
    if (s.length === 0) return

    if (s.length === 1) {
      gsap.set(s[0]!, { opacity: 1, pointerEvents: 'auto' })
      gsap.set(s[0]!.querySelector('.sv-img-wrap'), { opacity: 1, scale: 1 })
      gsap.set(s[0]!.querySelectorAll('.sv-anim'), { opacity: 1, y: 0 })
      return
    }

    s.forEach((sl, i) => {
      const img = sl.querySelector('.sv-img-wrap')
      const items = sl.querySelectorAll('.sv-anim')
      gsap.set(sl, { opacity: 1, pointerEvents: i === 0 ? 'auto' : 'none' })
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
        pin: section.querySelector('.sv-pin'),
        // higher scrub = softer catch-up, kills the harsh snap feel
        scrub: 1.2,
        anticipatePin: 1,
      },
    })
    for (let i = 0; i < s.length - 1; i++) {
      const cur = s[i]!
      const nxt = s[i + 1]!
      // short holds + long overlapping fades: continuous motion, no dead zones
      tl.to({}, { duration: 0.5 })
        .set(cur, { pointerEvents: 'none', immediateRender: false })
        .to(cur.querySelectorAll('.sv-anim'), { opacity: 0, y: -22, duration: 0.55, stagger: 0.04 }, '>')
        .to(cur.querySelector('.sv-img-wrap'), { opacity: 0, scale: 1.04, duration: 0.7 }, '<0.05')
        .to(nxt.querySelector('.sv-img-wrap'), { opacity: 1, scale: 1, duration: 0.8 }, '<0.15')
        .set(nxt, { pointerEvents: 'auto', immediateRender: false }, '<')
        .to(nxt.querySelectorAll('.sv-anim'), { opacity: 1, y: 0, duration: 0.7, stagger: 0.06 }, '<0.2')
    }
    tl.to({}, { duration: 0.55 })
    ScrollTrigger.refresh()
  })
})

onBeforeUnmount(() => {
  mm?.revert()
})
</script>

<template>
  <section ref="root" class="sv-scroll band-cream" :style="{ '--seq-h': seqHeight }" aria-label="Our services">
    <div class="sv-pin">
      <header class="sv-header">
        <h2 class="sv-heading">Services</h2>
        <p class="sv-sub">{{ subtitle || 'Our offering to all clients' }}</p>
        <div class="sv-header-divider" />
      </header>

      <div class="sv-stage">
        <article v-for="(s, i) in slides" :key="s.slug" class="sv-slide" :data-service="s.slug">
          <div class="sv-img-wrap"><img :src="`/assets/services/card-${s.slug}.webp`" :alt="s.title" loading="lazy" /></div>
          <div class="sv-content">
            <h3 class="sv-name sv-anim">{{ s.title }}</h3>
            <!-- Parallax paragraph mirrors the service's hero paragraph (content
                 manager: keep them identical) — excerpt is only the fallback. -->
            <p class="sv-text sv-anim">{{ s.intro?.[0] || s.excerpt }}</p>
            <div class="sv-divider sv-anim" />
            <div class="sv-footer sv-anim">
              <NuxtLink class="brand-btn brand-btn--orange" :to="`/services/${s.slug}`">Read more</NuxtLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== User's sv-scroll CSS (scoped) ===== */
.sv-scroll {
  --ink: #1c1c1c;
  --line: #e7e3d6;
  --nav-h: 78px;
  position: relative;
}
.sv-pin {
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: calc(var(--nav-h) + clamp(20px, 3vh, 40px)) clamp(20px, 5vw, 80px) clamp(30px, 5vh, 56px);
  box-sizing: border-box;
  overflow: hidden;
}
.sv-header {
  flex: 0 0 auto;
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  text-align: center;
}
.sv-heading {
  font-family: var(--serif);
  color: var(--ink);
  font-weight: 400;
  font-size: var(--fs-h2); /* uniform with the other section headings */
  line-height: 1.05;
  margin: 0 0 10px;
}
.sv-sub {
  /* same treatment as the Talent Showcase subtitle */
  font-family: var(--sans);
  color: var(--grey-text);
  font-weight: 300;
  font-size: var(--fs-body);
  line-height: 1.5;
  margin: 0 0 clamp(18px, 3vh, 26px);
}
.sv-header-divider { height: 1px; background: var(--line); width: 100%; }
.sv-stage {
  position: relative;
  width: 100%;
  max-width: 1180px;
  margin: auto;
  /* low floor so the pinned screen still fits short laptop viewports */
  height: clamp(280px, 52vh, 520px);
}

/* Short laptop viewports: tighter rhythm so nothing is cut off */
@media (min-width: 993px) and (max-height: 700px) {
  .sv-stage { height: clamp(260px, 55vh, 420px); }
}
.sv-slide {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(32px, 5vw, 70px);
  align-items: center;
  opacity: 0;
}
.sv-slide:first-child { opacity: 1; }
.sv-img-wrap {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #e9e6dc;
}
.sv-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.sv-content { font-family: var(--sans); }
.sv-name {
  font-family: var(--serif);
  color: var(--green);
  font-size: clamp(28px, 3.2vw, 42px);
  line-height: 1.08;
  font-weight: 400;
  margin: 0 0 16px;
}
.sv-name::after {
  content: "";
  display: block;
  width: 46px;
  height: 3px;
  background: var(--green);
  margin-top: 14px;
  border-radius: 2px;
}
.sv-text {
  color: var(--black);
  font-size: clamp(15px, 1.15vw, 17px);
  line-height: 1.65;
  margin: 0 0 24px;
  max-width: 46ch;
}
.sv-divider { height: 1px; background: var(--line); margin: 0 0 22px; }
.sv-footer { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }

@media (min-width: 993px) {
  .sv-scroll { height: var(--seq-h, 550vh); }
  .sv-slide { pointer-events: none; }
  .sv-slide:first-child { pointer-events: auto; }
}
@media (min-width: 993px) and (orientation: portrait) {
  .sv-scroll { height: auto !important; }
  .sv-pin { height: auto; display: block; padding: 48px 40px; }
  .sv-header { margin-bottom: 40px; }
  .sv-stage { height: auto; margin: 0 auto; }
  .sv-slide {
    position: static;
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: none !important;
    margin-bottom: 72px;
  }
  .sv-img-wrap { height: clamp(300px, 32vh, 440px); }
}
@media (min-width: 993px) and (prefers-reduced-motion: reduce) {
  .sv-scroll { height: auto; }
  .sv-pin { height: auto; display: block; }
  .sv-stage { height: auto; }
  .sv-slide {
    position: static;
    opacity: 1 !important;
    pointer-events: auto !important;
    margin-bottom: 56px;
  }
  .sv-img-wrap { height: clamp(320px, 40vh, 460px); }
}
@media (max-width: 992px) {
  .sv-scroll { height: auto; }
  .sv-pin { height: auto; display: block; padding: 48px 20px; }
  .sv-header { margin-bottom: 40px; }
  .sv-stage { height: auto; margin: 0 auto; }
  .sv-slide {
    position: static;
    opacity: 1 !important;
    pointer-events: auto !important;
    grid-template-columns: 1fr;
    gap: 22px;
    margin-bottom: 56px;
    transform: none !important;
  }
  .sv-img-wrap { height: auto; aspect-ratio: 4/3; }
}
</style>
