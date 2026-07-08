<script setup lang="ts">
/**
 * Page-navigation overlay loader. The LEGENDS wordmark bounces letter by
 * letter (same motion identity as the site's heading hover effect) over a
 * blurred cream veil, with an orange sweep underneath.
 * Only appears when a navigation takes longer than SHOW_AFTER_MS, and stays
 * at least MIN_VISIBLE_MS once shown so it never flickers.
 */
const LETTERS = 'LEGENDS'.split('')
const SHOW_AFTER_MS = 200
const MIN_VISIBLE_MS = 500

const visible = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null
let hideTimer: ReturnType<typeof setTimeout> | null = null
let shownAt = 0

const nuxtApp = useNuxtApp()

function onStart() {
  if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
  if (visible.value || showTimer) return
  showTimer = setTimeout(() => {
    showTimer = null
    visible.value = true
    shownAt = Date.now()
  }, SHOW_AFTER_MS)
}

function onEnd() {
  if (showTimer) { clearTimeout(showTimer); showTimer = null }
  if (!visible.value) return
  const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt))
  hideTimer = setTimeout(() => { visible.value = false; hideTimer = null }, wait)
}

nuxtApp.hook('page:start', onStart)
nuxtApp.hook('page:finish', onEnd)
nuxtApp.hook('vue:error', onEnd)
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
            :style="{ animationDelay: `${i * 0.08}s` }"
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
  animation: pl-bounce 1.1s cubic-bezier(0.28, 0.84, 0.42, 1) infinite;
}
@keyframes pl-bounce {
  0%, 55%, 100% { transform: translateY(0); }
  25% { transform: translateY(-0.28em); color: var(--accent); }
  40% { transform: translateY(0.05em); }
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
  animation: pl-sweep 1.1s ease-in-out infinite;
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
  .pl-letter { animation: none; }
  .pl-sweep span { animation-duration: 2s; }
}
</style>
