<script setup lang="ts">
/**
 * Partner-embeddable Salary Benchmarking tool (white-label).
 * Renders the exact homepage calculator, bare: no site chrome, no heading,
 * no CTA. Any site may iframe this route (CSP frame-ancestors * — see
 * nuxt.config routeRules). The page reports its content height to the parent
 * window ({ type: 'legends-embed-resize', height }) so the partner's iframe
 * script (docs/embed-snippet.html) can auto-size it.
 */
definePageMeta({ layout: false })
usePageSeo({ title: 'Salary Benchmarking', robots: 'noindex, nofollow' })

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
  if (window.parent === window) return // not framed — nothing to report to
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
  <div class="embed-root">
    <HomeSalaryCalculator embed />
  </div>
</template>

<style scoped>
/* The section paints its own arch background; keep everything behind it quiet. */
.embed-root { overflow: hidden; }
</style>
