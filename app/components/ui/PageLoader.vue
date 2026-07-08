<script setup lang="ts">
/**
 * Page-navigation overlay loader. The LEGENDS wordmark stays still while an
 * orange colour wave rolls through the letters, with an orange sweep bar.
 * Client-side navigations only — never on initial load/reload (the server
 * already streams the full page there). Appears only when a navigation takes
 * longer than SHOW_AFTER_MS, stays at least MIN_VISIBLE_MS, and a watchdog
 * force-hides it if a finish event is ever missed.
 */
const LETTERS = 'LEGENDS'.split('')
const SHOW_AFTER_MS = 200
const MIN_VISIBLE_MS = 500
const WATCHDOG_MS = 8000

const visible = ref(false)
let enabled = false // flips true once the first page has fully loaded
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let watchdog: ReturnType<typeof setTimeout> | null = null
let shownAt = 0

const nuxtApp = useNuxtApp()

function onStart() {
  if (!enabled) return
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  if (visible.value || showTimer) return
  showTimer = setTimeout(() => {
    showTimer = null
    visible.value = true
    shownAt = Date.now()
    watchdog = setTimeout(forceHide, WATCHDOG_MS)
  }, SHOW_AFTER_MS)
}

function onEnd() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  if (!visible.value) return
  const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt))
  hideTimer = setTimeout(forceHide, wait)
}

function forceHide() {
  if (watchdog) { clearTimeout(watchdog); watchdog = null }
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  visible.value = false
}

// initial load (and reload) never shows the overlay; enable afterwards
nuxtApp.hook('app:suspense:resolve', () => { enabled = true; forceHide() })
nuxtApp.hook('page:start', onStart)
nuxtApp.hook('page:finish', onEnd)
nuxtApp.hook('vue:error', forceHide)
</script>

<template>
  <Transition name="pl-fade">
    <div v-if="visible" class="pl-overlay" role="status" aria-label="Loading page">
      <div class="pl-box">
        <div class="pl-word" aria-hidden="true">
          <span
            v-for="(ch, i) in LETTERS"
            :key="i"
            class="pl-letter"
            :style="{ animationDelay: `${i * 0.09}s` }"
          >{{ ch }}</span>
        </div>
        <div class="pl-sweep"><span /></div>
        <p class="pl-tag">Employer of Record</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.pl-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 252, 246, 0.88);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}
.pl-box { text-align: center; }
.pl-word {
  display: inline-flex;
  font-family: var(--serif);
  font-size: clamp(34px, 5vw, 52px);
  color: var(--green);
  letter-spacing: 0.04em;
  line-height: 1;
}
.pl-letter {
  display: inline-block;
  animation: pl-wave 1.3s ease-in-out infinite;
}
@keyframes pl-wave {
  0%, 45%, 100% { color: var(--green); }
  20% { color: var(--accent); }
}
.pl-sweep {
  position: relative;
  height: 3px;
  width: min(220px, 60vw);
  margin: 14px auto 0;
  border-radius: 2px;
  background: rgba(1, 69, 32, 0.12);
  overflow: hidden;
}
.pl-sweep span {
  position: absolute;
  inset-block: 0;
  width: 38%;
  border-radius: 2px;
  background: var(--accent);
  animation: pl-sweep 1.3s ease-in-out infinite;
}
@keyframes pl-sweep {
  0% { left: -38%; }
  100% { left: 100%; }
}
.pl-tag {
  margin: 12px 0 0;
  font-family: var(--sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--grey-mid);
}

.pl-fade-enter-active { transition: opacity 0.18s ease; }
.pl-fade-leave-active { transition: opacity 0.3s ease; }
.pl-fade-enter-from,
.pl-fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
  .pl-letter { animation-duration: 2.4s; }
  .pl-sweep span { animation-duration: 2.4s; }
}
</style>
