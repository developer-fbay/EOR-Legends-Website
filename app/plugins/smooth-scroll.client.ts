/**
 * Smooth scrolling (Lenis) + light fade-up reveals (GSAP ScrollTrigger).
 * - Lenis smooths native window scroll, so position:sticky keeps working.
 * - Fade-ups target section headings and cards, but never elements inside
 *   the GSAP-pinned sequences (.cs-scroll / .sv-scroll) which animate themselves.
 * - Skipped entirely for reduced-motion users and the /admin area.
 */
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.registerPlugin(ScrollTrigger)

  const lenis = new Lenis({
    lerp: 0.11,
    smoothWheel: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  const FADE_SELECTOR = [
    'main h2',
    'main .post-card',
    'main .svc-card',
    'main .learn-card',
    'main .ab-more-card',
    'main .ab-card',
    'main .faqc',
    'main .hero-stats',
    'main .gr-widget',
    'main .eor-comp',
    'main .hiw-section',
    'main .svc-hiw__card',
    'main .svc-ov-card',
  ].join(', ')

  let tweens: gsap.core.Tween[] = []

  function clearFades() {
    tweens.forEach((t) => {
      t.scrollTrigger?.kill()
      t.kill()
    })
    tweens = []
  }

  function initFades() {
    if (useRoute().path.startsWith('/admin')) return
    const els = Array.from(document.querySelectorAll<HTMLElement>(FADE_SELECTOR)).filter(
      (el) => !el.closest('.cs-scroll') && !el.closest('.sv-scroll') && !el.dataset.faded,
    )
    els.forEach((el) => {
      el.dataset.faded = '1'
      tweens.push(
        gsap.from(el, {
          y: 26,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
          // leave no inline styles behind — CSS hover transforms must keep working
          onComplete: () => gsap.set(el, { clearProps: 'transform,opacity,visibility' }),
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }),
      )
    })
    ScrollTrigger.refresh()
  }

  nuxtApp.hook('page:finish', () => {
    // every page change starts at the top (Lenis must be reset too)
    const route = useRoute()
    if (!route.hash) lenis.scrollTo(0, { immediate: true })
    clearFades()
    // wait a tick for content (async data) to be in the DOM
    setTimeout(initFades, 120)
  })

  // initial load
  setTimeout(initFades, 250)

  // Late-loading content (WP images, fonts) changes the document height after
  // Lenis and ScrollTrigger measured it — stale limits can stop the user
  // reaching the bottom of the page. Re-measure once everything has loaded,
  // and again shortly after as a safety net.
  function remeasure() {
    lenis.resize()
    ScrollTrigger.refresh()
  }
  window.addEventListener('load', () => {
    remeasure()
    setTimeout(remeasure, 1500)
    setTimeout(remeasure, 4000)
  })
})
