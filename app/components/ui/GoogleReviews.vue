<script setup lang="ts">
// Google Reviews pill — adapted from the user's widget code block.
const rating = 4.7
const full = Math.floor(rating)
const half = rating - full >= 0.5

const avatars = [
  'https://legendseor.com/wp-content/uploads/2026/06/IMG_1684124-removebg-preview.png',
  'https://legendseor.com/wp-content/uploads/2026/06/IMG_1710121-removebg-preview.png',
  'https://legendseor.com/wp-content/uploads/2026/06/legends-heroes-updated-bg-2-removebg-preview.png',
  'https://legendseor.com/wp-content/uploads/2026/06/IMG_165151-removebg-preview.png',
  'https://legendseor.com/wp-content/uploads/2026/06/IMG_170461-scaled-removebg-preview.png',
]

const starPath = 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z'
</script>

<template>
  <div class="gr-widget" role="img" :aria-label="`Google Reviews: rated ${rating} out of 5`">
    <svg class="gr-logo" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>

    <div class="gr-meta">
      <span class="gr-title">Google Reviews</span>
      <div class="gr-rating">
        <span class="gr-score">{{ rating }}</span>
        <span class="gr-stars">
          <svg v-for="i in 5" :key="i" viewBox="0 0 24 24">
            <defs v-if="i === full + 1 && half">
              <linearGradient :id="`grHalf${i}`">
                <stop offset="50%" stop-color="var(--gr-star)" />
                <stop offset="50%" stop-color="var(--gr-star-empty)" />
              </linearGradient>
            </defs>
            <path
              :fill="i <= full ? 'var(--gr-star)' : (i === full + 1 && half ? `url(#grHalf${i})` : 'var(--gr-star-empty)')"
              :d="starPath"
            />
          </svg>
        </span>
      </div>
    </div>

    <div class="gr-divider" />

    <div class="gr-people">
      <div class="gr-avatars">
        <img v-for="(src, i) in avatars" :key="i" class="gr-avatar" :alt="`Google reviewer ${i + 1}`" :src="src" loading="lazy" />
      </div>
      <span class="gr-count">+27</span>
    </div>
  </div>
</template>

<style scoped>
.gr-widget {
  --gr-card-bg: #ffffff;
  --gr-text-strong: #1a1a1a;
  --gr-text-muted: #5f6368;
  --gr-star: #fbbc04;
  --gr-star-empty: #e3e3e3;
  --gr-ring: #ffffff;
  --gr-shadow: 0 10px 30px -8px rgba(20, 30, 20, 0.18);

  display: inline-flex;
  align-items: center;
  gap: 16px;
  background: var(--gr-card-bg);
  border-radius: 999px;
  padding: 12px 22px 12px 16px;
  box-shadow: var(--gr-shadow);
  font-family: var(--sans);
  -webkit-font-smoothing: antialiased;
}
.gr-logo { width: 34px; height: 34px; flex: 0 0 auto; }
.gr-meta { display: flex; flex-direction: column; gap: 3px; }
.gr-title { font-size: 14px; font-weight: 600; color: var(--gr-text-strong); line-height: 1; }
.gr-rating { display: flex; align-items: center; gap: 7px; }
.gr-score { font-size: 13px; font-weight: 600; color: var(--gr-text-strong); line-height: 1; }
.gr-stars { display: inline-flex; gap: 1px; }
.gr-stars svg { width: 14px; height: 14px; display: block; }
.gr-divider { width: 1px; align-self: stretch; background: #ececec; margin: 2px 0; }
.gr-people { display: flex; align-items: center; }
.gr-avatars { display: flex; flex-direction: row-reverse; }
.gr-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid var(--gr-ring);
  object-fit: cover;
  margin-left: -10px;
  background: #ddd;
}
.gr-avatars .gr-avatar:last-child { margin-left: 0; }
.gr-count { margin-left: 8px; font-size: 13px; font-weight: 600; color: var(--gr-text-muted); line-height: 1; }
@media (max-width: 380px) {
  .gr-widget { gap: 11px; padding: 10px 16px 10px 12px; }
  .gr-divider { display: none; }
}
</style>
