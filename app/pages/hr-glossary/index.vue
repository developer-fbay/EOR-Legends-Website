<script setup lang="ts">
// HR Glossary archive — A–Z grouped terms with sticky letter sidebar
// (per the WP design and the user's glossary ToC pattern).
usePageSeo({
  title: 'HR Glossary',
  description:
    "A straightforward guide to employment, payroll, and compliance terminology relevant to hiring in South Africa. Whether you're using an Employer of Record or expanding your team locally, this glossary helps demystify the language behind workforce management.",
})

const { data: terms } = useContentList('hr_glossary', { orderBy: 'title' })

// Dynamic term search — filters the A–Z list as the user types.
const search = ref('')

const groups = computed(() => {
  const q = search.value.trim().toLowerCase()
  const filtered = (terms.value ?? []).filter((t) => !q || t.title.toLowerCase().includes(q))
  const map = new Map<string, { title: string; slug: string }[]>()
  for (const t of filtered.sort((a, b) => a.title.localeCompare(b.title))) {
    const first = (t.title[0] || '#').toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : '#'
    if (!map.has(letter)) map.set(letter, [])
    map.get(letter)!.push({ title: t.title, slug: t.slug })
  }
  return [...map.entries()].sort(([a], [b]) => (a === '#' ? -1 : b === '#' ? 1 : a.localeCompare(b)))
})

function scrollToLetter(e: Event, letter: string) {
  e.preventDefault()
  const el = document.getElementById(`letter-${letter === '#' ? 'hash' : letter}`)
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' })
}
function backToTop(e: Event) {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main id="top">
    <UiArchiveHero
      title="HR Glossary"
      sub="A straightforward guide to employment, payroll, and compliance terminology relevant to hiring in South Africa. Whether you're using an Employer of Record or expanding your team locally, this glossary helps demystify the language behind workforce management."
    />

    <section class="band-cream section">
      <div class="container gl-grid">
        <aside class="gl-aside">
          <div class="tla-toc-wrapper">
            <label class="gl-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.8-3.8" /></svg>
              <input v-model="search" type="search" placeholder="Search a term…" aria-label="Search glossary terms" />
            </label>
            <a href="#top" class="tla-back-to-top" @click="backToTop">
              <span class="tla-back-to-top-icon">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" style="width: 13px; height: 13px">
                  <path d="M12 18.5V5.5M12 5.5L6 11.5M12 5.5L18 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span>Back to the top</span>
            </a>
            <nav class="gl-letters" aria-label="Jump to letter">
              <a
                v-for="[letter] in groups"
                :key="letter"
                :href="`#letter-${letter === '#' ? 'hash' : letter}`"
                @click="scrollToLetter($event, letter)"
              >{{ letter }}</a>
            </nav>
          </div>
        </aside>

        <div class="gl-main">
          <p v-if="!groups.length" class="gl-empty">No terms match “{{ search }}”.</p>
          <section
            v-for="[letter, list] in groups"
            :id="`letter-${letter === '#' ? 'hash' : letter}`"
            :key="letter"
            class="gl-group"
          >
            <h2 class="gl-letter">{{ letter }}</h2>
            <ul class="gl-terms">
              <li v-for="t in list" :key="t.slug">
                <NuxtLink :to="`/hr-glossary/${t.slug}`">{{ t.title }}</NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>

    <HomeCtaBand />
    <HomeTalentShowcase />
    <HomeFinalCta />
  </main>
</template>

<style scoped>
.gl-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: start;
}
.gl-aside {
  position: sticky;
  top: 110px;
}

/* Sidebar card reuses the tla-toc look */
.tla-toc-wrapper {
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  border: 1px solid rgba(1, 69, 32, 0.14);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 4px 16px rgba(1, 69, 32, 0.06);
}
.gl-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 12px;
  margin-bottom: 14px;
  border: 1px solid #dddddd;
  border-radius: 8px;
  background: var(--white);
  color: var(--grey-mid);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.gl-search:focus-within {
  border-color: var(--green);
  box-shadow: 0 0 0 2px rgba(1, 69, 32, 0.25);
}
.gl-search svg {
  width: 16px;
  height: 16px;
  flex: none;
}
.gl-search input {
  border: none;
  outline: none;
  background: transparent;
  font-family: var(--sans);
  font-size: 0.9rem;
  color: var(--body);
  width: 100%;
}
.gl-empty {
  color: var(--grey-mid);
  margin: 0;
}
.tla-back-to-top {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(1, 69, 32, 0.12);
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
}
.tla-back-to-top:hover .tla-back-to-top-icon {
  color: #eb3d00;
  border-color: #eb3d00;
}
.gl-letters {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}
.gl-letters a {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--body);
  background: var(--grey-light);
  transition: background 0.2s ease, color 0.2s ease;
}
.gl-letters a:hover {
  background: var(--green);
  color: var(--cream);
}

.gl-main {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(20px, 3vw, 44px);
}
.gl-group { scroll-margin-top: 120px; }
.gl-group + .gl-group {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #efece5;
}
.gl-letter {
  font-family: var(--serif);
  font-size: 2rem;
  color: var(--green);
  margin-bottom: 12px;
}
.gl-terms {
  list-style: none;
  margin: 0;
  padding: 0;
  columns: 2;
  column-gap: 40px;
}
.gl-terms li { margin-bottom: 8px; }
.gl-terms a {
  color: var(--body);
  text-decoration: none;
}
.gl-terms a:hover { color: var(--accent); }

@media (max-width: 900px) {
  .gl-grid { grid-template-columns: 1fr; }
  .gl-aside { position: static; }
  .gl-terms { columns: 1; }
}
</style>
