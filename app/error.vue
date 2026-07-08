<script setup lang="ts">
// 404 / error page — dark green penguin-illustration band, per the WP design.
const props = defineProps<{ error: { statusCode: number; message?: string } }>()
const is404 = computed(() => props.error?.statusCode === 404)
useSeoMeta({ title: is404.value ? 'Page not found' : 'Something went wrong' })
</script>

<template>
  <div>
    <LayoutAppHeader />
    <main class="err" :style="{ backgroundImage: 'url(/assets/backgrounds/Process-bg.webp)' }">
      <div class="err-inner">
        <p class="err-code">{{ is404 ? '404' : error?.statusCode || 500 }}</p>
        <h1 class="err-title">{{ is404 ? 'Page Not Found' : 'Something went wrong' }}</h1>
        <button class="brand-btn brand-btn--orange" @click="clearError({ redirect: '/' })">
          Back to Home
        </button>
      </div>
    </main>
    <LayoutAppFooter />
    <UiContactModal />
  </div>
</template>

<style scoped>
.err {
  min-height: max(60vh, 500px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--green);
  background-size: cover;
  background-position: center;
  color: var(--cream);
}
.err-inner {
  text-align: center;
  padding: 4rem 1.5rem;
}
.err-code {
  font-family: var(--serif);
  font-size: clamp(5rem, 12vw, 8.5rem);
  color: #ffffff;
  line-height: 1;
  margin: 0 0 0.05em;
}
.err-title {
  font-family: var(--sans);
  font-weight: 400;
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  color: #ffffff;
  margin-bottom: 1.2em;
}
</style>
