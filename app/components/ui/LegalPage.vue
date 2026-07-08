<script setup lang="ts">
// Shared legal-page layout (Privacy Policy, Modern Slavery Act):
// centered serif title, content in a white card, site prose styling.
defineProps<{ title: string; html: string }>()
</script>

<template>
  <main>
    <UiArchiveHero :title="title" />
    <section class="band-cream section" style="padding-top: 0">
      <div class="container">
        <article class="legal-card" v-html="html" />
      </div>
    </section>
  </main>
</template>

<style scoped>
.legal-card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(24px, 4vw, 56px);
  max-width: 1080px;
  margin-inline: auto;
}
.legal-card :deep(h2) {
  font-family: var(--serif);
  margin: 1.6em 0 0.6em;
}
.legal-card :deep(h2:first-child) { margin-top: 0; }
.legal-card :deep(h3) {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 1.1rem;
  margin: 1.4em 0 0.5em;
}
.legal-card :deep(p) {
  line-height: 1.75;
  margin-bottom: 1em;
}
.legal-card :deep(ul) {
  padding-left: 1.4em;
  margin-bottom: 1.1em;
  line-height: 1.75;
}
.legal-card :deep(a) { color: var(--green); }
</style>
