<script setup lang="ts">
/**
 * Partner-embeddable Salary Benchmarking tool (white-label).
 * Renders the exact homepage calculator, bare: no site chrome, no heading,
 * no CTA, no green arch — cards on a transparent background so it sits on
 * any partner site. Any site may iframe this route (CSP frame-ancestors * —
 * see nuxt.config routeRules).
 *
 * Two modes:
 *  - default: the page reports its content height to the parent window
 *    ({ type: 'legends-embed-resize', height }) so the partner's iframe
 *    script (docs/embed-snippet.html) can auto-size it.
 *  - ?mode=fill: no messaging — the page simply fills the iframe, which the
 *    partner sizes to 100% of its container div; content scrolls if the
 *    container is shorter than the tool.
 */
definePageMeta({ layout: false })
usePageSeo({ title: 'Salary Benchmarking', robots: 'noindex, nofollow' })
useHead({ htmlAttrs: { class: 'embed-page' }, bodyAttrs: { class: 'embed-page' } })

const fill = useRoute().query.mode === 'fill'

let ro: ResizeObserver | null = null
let lastHeight = 0

function postHeight() {
  const height = Math.max(
    document.documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0,
  )
  if (Math.abs(height - lastHeight) < 2) return
  lastHeight = height
  window.parent.postMessage({ type: 'legends-embed-resize', height }, '*')
}

onMounted(() => {
  if (fill || window.parent === window) return // fill mode / not framed: no reporting
  postHeight()
  ro = new ResizeObserver(postHeight)
  ro.observe(document.documentElement)
  ro.observe(document.body)
  window.addEventListener('load', postHeight)
})

onBeforeUnmount(() => {
  ro?.disconnect()
  window.removeEventListener('load', postHeight)
})
</script>

<template>
  <div class="embed-root" :class="{ 'embed-root--fill': fill }">
    <HomeSalaryCalculator embed />
  </div>
</template>

<style>
/* Transparent page background so the partner site shows through around the
   cards (base.css paints body cream otherwise). Scoped by the .embed-page
   class this route sets on <html>/<body>. */
html.embed-page,
body.embed-page {
  background: transparent;
}
</style>

<style scoped>
.embed-root { overflow: hidden; }
/* fill mode: occupy exactly the iframe (= the partner's div), scroll inside */
.embed-root--fill { height: 100vh; overflow-y: auto; overflow-x: hidden; }
</style>
