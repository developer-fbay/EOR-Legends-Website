<script setup lang="ts">
// Case study single — fully dynamic from WordPress ACF fields.
const route = useRoute()
const { data: row } = await useContentBySlug('case_studies', String(route.params.slug))
if (!row.value?.caseStudy) throw createError({ statusCode: 404, statusMessage: 'Case study not found' })

const cs = computed(() => row.value!.caseStudy!)
const title = computed(() => row.value!.title)
const logo = computed(() => cs.value.logoUrl)

usePageSeo({
  title: () => row.value?.meta_title || `${title.value} — Case Study`,
  description: () => row.value?.meta_description || cs.value.problem.slice(0, 160),
})

function splitLead(item: string): { lead: string; text: string } {
  const i = item.indexOf(':')
  if (i > 0 && i < 60) return { lead: item.slice(0, i + 1), text: item.slice(i + 1).trim() }
  return { lead: '', text: item }
}
</script>

<template>
  <main v-if="row">
    <!-- Hero: title + video left, client card right -->
    <section class="cs-hero band-cream section">
      <div class="container cs-hero__grid">
        <div class="cs-hero__main">
          <h1>{{ title }}</h1>
          <p class="cs-hero__sub">{{ cs.heroText }}</p>
          <div v-if="cs.videoId" class="cs-hero__video">
            <iframe
              :src="`https://www.youtube.com/embed/${cs.videoId}`"
              :title="`${title} case study video`"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>

        <aside class="cs-hero__card">
          <img v-if="logo" :src="logo" :alt="`${title} logo`" class="cs-hero__logo" />
          <h3>Industry:</h3>
          <p>{{ cs.industry }}</p>
          <h3>Services Provided:</h3>
          <p>{{ cs.service }}</p>
          <h3>Location of Staff:</h3>
          <p>{{ cs.location }}</p>
        </aside>
      </div>
    </section>

    <!-- Problem / Solution band -->
    <section class="cs-ps band-green section">
      <div class="container cs-ps__grid">
        <div class="cs-ps__problem">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>
            Problem:
          </h2>
          <p>{{ cs.problem }}</p>
        </div>
        <div class="cs-ps__solution">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.6.5 1.1 1.3 1.2 2.1l.1.3h5l.1-.3c.1-.8.6-1.6 1.2-2.1A6 6 0 0 0 12 3Z"/></svg>
            Solution:
          </h2>
          <p>{{ cs.solution }}</p>
        </div>
      </div>
    </section>

    <!-- Services included + results -->
    <section class="cs-sr band-cream section">
      <div class="container cs-sr__grid">
        <div class="cs-sr__services">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="7" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4a3.5 3.5 0 0 1 0 6.9"/><path d="M21.5 20a6.5 6.5 0 0 0-5-6.3"/></svg>
            Our services included:
          </h2>
          <ul>
            <li v-for="(item, i) in cs.servicesIncluded" :key="i">
              <em v-if="splitLead(item).lead">{{ splitLead(item).lead }}</em>
              {{ splitLead(item).text }}
            </li>
          </ul>
        </div>

        <aside class="cs-sr__results">
          <h2>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 3.5v17h17"/><path d="m7 14 4-4 3 3 5.5-5.5"/><path d="M16 7.5h4v4"/></svg>
            Results
          </h2>
          <template v-for="r in cs.results" :key="r.label">
            <h3>{{ r.label }}:</h3>
            <p>{{ r.text }}</p>
          </template>
        </aside>
      </div>
    </section>

    <HomeFinalCta />
  </main>
</template>

<style scoped>
.cs-hero__grid {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: clamp(28px, 4vw, 64px);
  /* video column and client card render as equal-height blocks */
  align-items: stretch;
}
.cs-hero__sub {
  color: var(--grey-text);
  margin: 0.4em 0 1.2em;
}
.cs-hero__video {
  border-radius: 12px;
  overflow: hidden;
}
.cs-hero__video iframe {
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  display: block;
}
.cs-hero__card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(22px, 2.6vw, 36px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cs-hero__logo {
  max-height: 54px;
  width: auto;
  max-width: 260px;
  object-fit: contain;
  margin-bottom: 18px;
}
.cs-hero__card h3 {
  font-family: var(--serif);
  font-size: 1.15rem;
  margin: 0 0 4px;
}
.cs-hero__card p {
  margin: 0 0 16px;
  color: var(--grey-text);
}
.cs-hero__card p:last-child { margin-bottom: 0; }

.cs-ps__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: center;
}
.cs-ps h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  margin-bottom: 0.7em;
}
.cs-ps h2 svg { width: 26px; height: 26px; flex: none; }
.cs-ps__problem {
  background: var(--white);
  border-radius: 14px;
  padding: clamp(24px, 3vw, 40px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  /* the green band sets cream text — the white card must use dark text */
  color: var(--body);
}
.cs-ps__problem h2 { color: var(--body); }
.cs-ps__problem h2 svg { color: var(--green); }
.cs-ps__problem p {
  margin: 0;
  line-height: 1.7;
  color: var(--body);
}
.cs-ps__solution h2 { color: var(--cream); }
.cs-ps__solution h2 svg { color: var(--accent); }
.cs-ps__solution p {
  color: #d4e2d2;
  line-height: 1.7;
  margin: 0;
}

.cs-sr__grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
}
.cs-sr h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  margin-bottom: 0.8em;
}
.cs-sr__services h2 svg { width: 28px; height: 28px; color: var(--accent); flex: none; }
.cs-sr__services ul {
  margin: 0;
  padding-left: 1.2em;
  display: flex;
  flex-direction: column;
  gap: 14px;
  line-height: 1.7;
}
.cs-sr__services em { font-style: italic; font-weight: 600; }
.cs-sr__results {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(22px, 2.6vw, 36px);
}
.cs-sr__results h2 svg { width: 26px; height: 26px; color: var(--green); flex: none; }
.cs-sr__results h3 {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 1.05rem;
  margin: 0 0 6px;
}
.cs-sr__results p {
  color: var(--grey-text);
  line-height: 1.65;
  margin: 0 0 18px;
}
.cs-sr__results p:last-child { margin-bottom: 0; }

@media (max-width: 900px) {
  .cs-hero__grid,
  .cs-ps__grid,
  .cs-sr__grid { grid-template-columns: 1fr; }
}
</style>
