<script setup lang="ts">
// Archive card — grayscale image with brand treatment, title, excerpt, Read more.
defineProps<{
  title: string
  excerpt?: string | null
  image?: string | null
  to: string
}>()
</script>

<template>
  <article class="post-card">
    <NuxtLink :to="to" class="post-card__img" tabindex="-1" aria-hidden="true">
      <img :src="image || '/assets/backgrounds/find-out-more-card.png'" :alt="title" loading="lazy" />
    </NuxtLink>
    <h3 class="post-card__title">
      <NuxtLink :to="to">{{ title }}</NuxtLink>
    </h3>
    <p v-if="excerpt" class="post-card__excerpt">{{ excerpt }}</p>
    <NuxtLink :to="to" class="brand-btn brand-btn--orange post-card__btn">Read more</NuxtLink>
  </article>
</template>

<style scoped>
.post-card {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 14px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 16px 16px 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
.post-card__img {
  display: block;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}
.post-card__img img {
  width: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  filter: grayscale(100%);
  transition: transform 0.35s ease, filter 0.35s ease;
}
.post-card:hover .post-card__img img {
  transform: scale(1.04);
  filter: grayscale(0%);
}
.post-card__title {
  font-family: var(--serif);
  font-size: 1.3rem;
  line-height: 1.2;
  margin: 6px 0 0;
}
.post-card__title a {
  color: var(--body);
  text-decoration: none;
}
.post-card__title a:hover { color: var(--green); }
.post-card__excerpt {
  font-size: 0.88rem;
  color: var(--grey-text);
  margin: 0;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-card__btn { margin-top: 4px; }
</style>
