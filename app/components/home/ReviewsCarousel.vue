<script setup lang="ts">
/**
 * Reviews carousel — infinite looping card slider from the user's code block
 * (clone-both-sides technique, pointer drag, keyboard arrows), on the green
 * band with the user's Reviews-bg.webp background.
 */
const reviews = [
  {
    text: 'PAYE, UIF and SDL are all calculated correctly and the payslips are easy for our finance team to reconcile. Only thing I\'d say is the reporting dashboard took a bit of getting used to at first.',
    name: 'Rachel Pemberton',
  },
  {
    text: 'We weren\'t sure what a decent benefits package looks like for South African employees, but the options they put in front of us were solid and two of our developers specifically mentioned how helpful it was to them.',
    name: 'James Holloway',
  },
  {
    text: 'Whenever we\'ve had a question about leave entitlement or a disciplinary process for our Cape Town staff, we\'ve had an answer within a day, usually with the relevant section of SA labour law referenced.',
    name: 'Sarah Mitchell',
  },
  {
    text: 'Migrated 15 employees from our old provider with no payroll gaps. Contracts, leave balances and benefits all carried over, and payroll ran on schedule the same month we switched. No employees contacted us with issues.',
    name: 'David Okonkwo',
  },
]

const CARD = 300
const viewport = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)

const count = reviews.length
// clones on both sides for the seamless loop
const rendered = [...reviews, ...reviews, ...reviews]

let index = count
let gap = 24
let slotWidth = CARD + gap
const dragging = ref(false)

function gapFor(width: number) {
  if (width >= 993) return 26
  if (width >= 769) return 22
  if (width >= 481) return 24
  return 18
}

function setTransform(animate: boolean) {
  const t = track.value
  if (!t) return
  t.style.transition = animate ? 'transform .55s cubic-bezier(.22,.61,.36,1)' : 'none'
  t.style.transform = `translateX(${-index * slotWidth}px)`
}

function layout() {
  const t = track.value
  if (!t) return
  gap = gapFor(window.innerWidth)
  slotWidth = CARD + gap
  Array.from(t.children).forEach((card) => {
    ;(card as HTMLElement).style.width = `${CARD}px`
    ;(card as HTMLElement).style.marginRight = `${gap}px`
  })
  setTransform(false)
}

function go(dir: number) {
  index += dir
  setTransform(true)
}

function onTransitionEnd() {
  if (index >= count * 2) {
    index -= count
    setTransform(false)
  } else if (index < count) {
    index += count
    setTransform(false)
  }
}

let startX = 0
let delta = 0
let startShift = 0

function onPointerDown(e: PointerEvent) {
  dragging.value = true
  startX = e.clientX
  delta = 0
  startShift = -index * slotWidth
  track.value!.style.transition = 'none'
  try { viewport.value?.setPointerCapture(e.pointerId) } catch { /* noop */ }
}
function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  delta = e.clientX - startX
  track.value!.style.transform = `translateX(${startShift + delta}px)`
}
function endDrag() {
  if (!dragging.value) return
  dragging.value = false
  const threshold = Math.max(40, slotWidth * 0.18)
  if (Math.abs(delta) > threshold) go(delta < 0 ? 1 : -1)
  else setTransform(true)
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null
function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(layout, 120)
}

onMounted(() => {
  layout()
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<template>
  <section class="rc-reviews band-green section" aria-labelledby="rc-reviews-title" :style="{ backgroundImage: 'url(/assets/backgrounds/Reviews-bg.webp)' }">
    <div class="rc-reviews__inner">
      <div class="rc-reviews__left">
        <h2 id="rc-reviews-title" class="rc-reviews__heading">&ldquo;What our customers are saying&rdquo;</h2>

        <div class="rc-reviews__nav">
          <button class="rc-nav-btn" type="button" aria-label="Previous reviews" @click="go(-1)">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button class="rc-nav-btn" type="button" aria-label="Next reviews" @click="go(1)">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>

        <!-- "See all Reviews" removed per marketing feedback (2026-07); restore by uncommenting:
        <a class="brand-btn brand-btn--outline" href="https://www.google.com/search?q=legends+eor+reviews" target="_blank" rel="noopener">See all Reviews</a>
        -->
      </div>

      <div class="rc-reviews__right">
        <div class="rc-carousel" aria-roledescription="carousel" aria-label="Customer reviews">
          <div
            ref="viewport"
            class="rc-carousel__viewport"
            :class="{ 'rc-is-dragging': dragging }"
            tabindex="0"
            role="group"
            aria-label="Reviews, use left and right arrow keys to navigate"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="endDrag"
            @pointercancel="endDrag"
            @keydown.right.prevent="go(1)"
            @keydown.left.prevent="go(-1)"
          >
            <ul ref="track" class="rc-carousel__track" @transitionend="onTransitionEnd">
              <li
                v-for="(r, i) in rendered"
                :key="i"
                class="rc-card"
                :aria-hidden="i < count || i >= count * 2"
              >
                <div class="rc-card__body">
                  <p class="rc-card__text">{{ r.text }}</p>
                  <div class="rc-card__name">{{ r.name }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ===== User's reviews-carousel CSS (scoped) ===== */
.rc-reviews {
  --orange-dk: #c83400;
  --ivory: #fbf7ec;
  --card-bg: #ffffff;
  --card-text: #5f6360;
  --card-name: #1c2520;
  --maxw: 1400px;
  --pad: 24px;
  --gutter: max(var(--pad), calc((100vw - var(--maxw)) / 2 + var(--pad)));

  position: relative;
  background-size: cover;
  background-position: center bottom;
  background-repeat: no-repeat;
  font-family: var(--sans);
}
.rc-reviews a { text-decoration: none; }
.rc-reviews button { font-family: inherit; cursor: pointer; }

.rc-reviews__inner {
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--pad);
  display: flex;
  align-items: center;
  gap: 48px;
}

.rc-reviews__left { width: 100%; }
.rc-reviews__heading {
  margin: 0 0 30px;
  font-family: var(--serif);
  font-weight: 400;
  color: var(--ivory);
  font-size: clamp(28px, 2.2vw, 36px);
  line-height: 1.12;
  letter-spacing: 0.2px;
  text-align: center;
}
.rc-reviews__nav { display: flex; gap: 14px; margin-bottom: 0; justify-content: center; }
.rc-nav-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.22s ease, transform 0.22s ease;
  -webkit-tap-highlight-color: transparent;
}
.rc-nav-btn:hover { background: var(--orange-dk); transform: translateY(-2px); }
.rc-nav-btn:active { transform: translateY(0); }
.rc-nav-btn:focus-visible { outline: 3px solid var(--ivory); outline-offset: 3px; }
.rc-nav-btn svg { width: 18px; height: 18px; display: block; }

.rc-reviews__right { flex: 1 1 auto; min-width: 0; }
.rc-carousel__viewport {
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
  width: calc(100% + var(--gutter));
}
.rc-carousel__viewport.rc-is-dragging { cursor: grabbing; }
.rc-carousel__track {
  display: flex;
  align-items: stretch;
  margin: 0;
  padding: 0;
  list-style: none;
  will-change: transform;
  user-select: none;
}
.rc-card {
  flex: 0 0 auto;
  background: var(--card-bg);
  border-radius: 16px;
  padding: 32px 30px 28px;
  display: flex;
  flex-direction: column;
  min-height: 300px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.14);
}
.rc-card__body {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.rc-card__text {
  margin: 0;
  font-weight: 400;
  color: var(--card-text);
  font-size: 15px;
  line-height: 1.65;
}
.rc-card__name {
  padding-top: 26px;
  font-family: var(--serif);
  font-weight: 400;
  color: var(--card-name);
  font-size: 20px;
  letter-spacing: 0.2px;
}

@media (max-width: 992px) {
  .rc-reviews__inner { gap: 36px; }
  .rc-reviews__left { width: 75%; }
  .rc-reviews__heading { margin-bottom: 26px; }
}
@media (max-width: 768px) {
  .rc-reviews { padding: 58px 0; }
  .rc-reviews__inner { flex-direction: column; align-items: stretch; gap: 30px; }
  .rc-reviews__left { flex-basis: auto; width: 100%; }
  .rc-reviews__heading {
    max-width: calc(100vw - 2 * var(--pad));
    overflow-wrap: break-word;
    font-size: 22px;
  }
  .rc-card__text { font-size: 14px; }
  .rc-card__name { font-size: 17px; }
}
@media (max-width: 480px) {
  .rc-reviews { padding: 46px 0; --pad: 18px; }
  .rc-reviews__heading { font-size: 20px; margin-bottom: 22px; }
  .rc-nav-btn { width: 44px; height: 44px; }
  .rc-card { padding: 26px 24px 24px; min-height: 240px; }
}
@media (prefers-reduced-motion: reduce) {
  .rc-nav-btn { transition: none; }
}
</style>
