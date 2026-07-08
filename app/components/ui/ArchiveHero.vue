<script setup lang="ts">
// Archive hero — centered serif title with green underline + subtitle (WP pattern).
defineProps<{ title: string; sub?: string }>()
</script>

<template>
  <section class="arch-hero band-cream">
    <div class="container">
      <h1 class="arch-hero__title">{{ title }}</h1>
      <p v-if="sub" class="arch-hero__sub">{{ sub }}</p>
    </div>
  </section>
</template>

<style scoped>
.arch-hero {
  padding-block: clamp(2.5rem, 8vh, 5.5rem) clamp(1.5rem, 4vh, 2.5rem);
  text-align: center;
}
.arch-hero__title { margin-bottom: 0; }
.arch-hero__title::after {
  content: "";
  display: block;
  width: 72px;
  height: 3px;
  margin: 16px auto 0;
  background: var(--green);
  border-radius: 2px;
}
.arch-hero__sub {
  max-width: 72ch;
  margin: 1.4em auto 0;
  color: var(--body);
}
</style>
