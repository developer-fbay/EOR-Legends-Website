<script setup lang="ts">
/**
 * Table of Contents sidebar — ported from the user's "tla-toc" code block.
 * Scans the article element for h2 headings, builds anchor links, tracks the
 * active section on scroll with the orange indicator bar.
 */
const props = defineProps<{ articleEl: HTMLElement | null }>()

type TocItem = { id: string; text: string }
const items = ref<TocItem[]>([])
const activeId = ref('')
const listEl = ref<HTMLElement | null>(null)
const indicator = ref({ top: 0, height: 0, visible: false })

let headings: HTMLElement[] = []
let ticking = false

function build() {
  const root = props.articleEl
  if (!root) return
  headings = Array.from(root.querySelectorAll<HTMLElement>('h2'))
  items.value = headings.map((h, i) => {
    if (!h.id) h.id = `tla-heading-${i}`
    return { id: h.id, text: h.textContent?.trim() || '' }
  }).filter((i) => i.text)
  if (items.value.length) activeId.value = items.value[0]!.id
  nextTick(positionIndicator)
}

function positionIndicator() {
  const list = listEl.value
  if (!list) return
  const link = list.querySelector<HTMLElement>(`a[href="#${activeId.value}"]`)
  if (!link) { indicator.value.visible = false; return }
  indicator.value = {
    top: link.offsetTop,
    height: link.offsetHeight,
    visible: true,
  }
}

function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    const scrollY = window.scrollY
    const threshold = 250
    if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10) {
      activeId.value = items.value[items.value.length - 1]?.id || ''
    } else if (scrollY < 100) {
      activeId.value = items.value[0]?.id || ''
    } else {
      let current = items.value[0]?.id || ''
      for (const h of headings) {
        if (h.getBoundingClientRect().top + scrollY <= scrollY + threshold) current = h.id
      }
      activeId.value = current
    }
    positionIndicator()
    ticking = false
  })
}

function scrollToHeading(e: Event, id: string) {
  e.preventDefault()
  const el = document.getElementById(id)
  if (!el) return
  activeId.value = id
  positionIndicator()
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' })
}

function backToTop(e: Event) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => props.articleEl, build)
onMounted(() => {
  build()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div v-show="items.length" class="tla-toc-wrapper">
    <a href="#top" class="tla-back-to-top" @click="backToTop">
      <span class="tla-back-to-top-icon">
        <svg class="tla-arrow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 18.5V5.5M12 5.5L6 11.5M12 5.5L18 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </span>
      <span>Back to the top</span>
    </a>
    <nav class="tla-toc-container" aria-label="Table of contents">
      <div
        class="tla-toc-indicator"
        :style="{ top: indicator.top + 'px', height: indicator.height + 'px', opacity: indicator.visible ? 1 : 0 }"
      />
      <ul ref="listEl" class="tla-toc-list">
        <li v-for="item in items" :key="item.id" class="tla-toc-item">
          <a
            class="tla-toc-link"
            :class="{ 'tla-active': activeId === item.id }"
            :href="`#${item.id}`"
            @click="scrollToHeading($event, item.id)"
          >{{ item.text }}</a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
/* ===== User's ToC CSS (scoped) ===== */
.tla-toc-wrapper {
  width: 100%;
  max-width: 300px;
  height: fit-content;
  background: #ffffff;
  border: 1px solid rgba(1, 69, 32, 0.14);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px rgba(1, 69, 32, 0.06);
  margin-bottom: 30px;
  font-family: var(--sans);
}
.tla-back-to-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(1, 69, 32, 0.12);
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  color: #014520;
  text-decoration: none;
  transition: color 0.25s ease;
}
.tla-back-to-top:hover { color: #eb3d00; }
.tla-back-to-top-icon {
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border: 1.5px solid #014520;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #014520;
  background: transparent;
  transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}
.tla-back-to-top-icon .tla-arrow {
  width: 13px;
  height: 13px;
  display: block;
}
.tla-back-to-top:hover .tla-back-to-top-icon {
  color: #eb3d00;
  border-color: #eb3d00;
  background: rgba(235, 61, 0, 0.08);
}
.tla-toc-container {
  position: relative;
  padding-left: 16px;
}
.tla-toc-indicator {
  position: absolute;
  left: 0;
  width: 3px;
  background: #eb3d00;
  transition: all 0.3s ease;
  border-radius: 2px;
  opacity: 0;
}
.tla-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.tla-toc-item { margin-bottom: 4px; }
.tla-toc-link {
  display: block;
  color: #000000;
  text-decoration: none;
  padding: 7px 11px;
  border-radius: 8px;
  transition: background 0.25s ease, color 0.25s ease;
  font-size: 13.5px;
  line-height: 1.45;
  font-weight: 500;
}
.tla-toc-link:hover {
  background: rgba(1, 69, 32, 0.06);
  color: #014520;
}
.tla-toc-link.tla-active {
  color: #eb3d00;
  font-weight: 600;
}
.tla-toc-link:focus-visible,
.tla-back-to-top:focus-visible {
  outline: 2px solid #eb3d00;
  outline-offset: 2px;
  border-radius: 8px;
}
@media (max-width: 768px) {
  .tla-toc-wrapper {
    position: relative;
    top: 0;
    max-width: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .tla-toc-link,
  .tla-back-to-top,
  .tla-back-to-top-icon,
  .tla-toc-indicator { transition: none; }
}
</style>
