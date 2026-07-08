import type { RouterConfig } from '@nuxt/schema'

// Every page navigation starts at the top (hash links still anchor-scroll).
export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: 120 }
    return { top: 0, left: 0 }
  },
}
