import type { Ref } from 'vue'

/**
 * Letter-bounce hover effect (ported from the user's Oxygen code block).
 * Splits text into per-letter spans (preserving nested tags) and re-triggers
 * a bounce animation whenever the cursor enters a letter.
 * Styles live in base.css under .letter-bounce.
 */

function splitLetters(root: HTMLElement) {
  ;(function walk(node: Node) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        ;(child.textContent || '').split('').forEach((ch) => {
          const outer = document.createElement('span')
          outer.className = 'lb-char'
          const inner = document.createElement('span')
          inner.className = 'lb-inner'
          inner.textContent = ch
          outer.appendChild(inner)
          frag.appendChild(outer)
        })
        node.replaceChild(frag, child)
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as Element).tagName !== 'BR') {
        walk(child as HTMLElement)
      }
    })
  })(root)
}

function bindEvents(root: HTMLElement) {
  root.addEventListener('mouseover', (e) => {
    const target = e.target as HTMLElement
    const char = target.closest('.lb-char')
    if (!char || !root.contains(char)) return
    const inner = char.querySelector('.lb-inner') as HTMLElement | null
    if (!inner || inner.textContent?.trim() === '') return
    inner.classList.remove('lb-pop')
    void inner.offsetWidth
    inner.classList.add('lb-pop')
  })
  root.addEventListener('animationend', (e) => {
    const t = e.target as HTMLElement
    t.classList?.remove('lb-pop')
  })
}

export function initLetterBounce(el: HTMLElement) {
  if (!el || el.dataset.lb) return
  el.dataset.lb = '1'
  el.classList.add('letter-bounce')
  splitLetters(el)
  bindEvents(el)
}

/** Apply to a single element ref. */
export function useLetterBounce(el: Ref<HTMLElement | null | undefined>) {
  onMounted(() => {
    if (el.value) initLetterBounce(el.value)
  })
}

/**
 * Apply to every <h2> inside a container (used on the homepage ONLY —
 * per design direction, letter bounce belongs to homepage h2 headings).
 * Review headings are excluded by design.
 */
export function useLetterBounceOnH2s(container: Ref<HTMLElement | null | undefined>) {
  onMounted(() => {
    nextTick(() => {
      container.value
        ?.querySelectorAll<HTMLElement>('h2:not(.rc-reviews__heading)')
        .forEach((h2) => initLetterBounce(h2))
    })
  })
}
