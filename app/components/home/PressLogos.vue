<script setup lang="ts">
// Press logo marquee — auto-scrolling strip of publication logos (user-provided PNGs).
// Layout matches the WP build: container-width divider line above, generous
// vertical padding, full-bleed marquee with large evenly spaced logos.
const logos = [
  { src: '/assets/banner-logos/Timeslive-green.png', alt: 'TimesLive' },
  { src: '/assets/banner-logos/The-Telegraph-green.png', alt: 'The Telegraph' },
  { src: '/assets/banner-logos/Sky-news-green.png', alt: 'Sky News' },
  { src: '/assets/banner-logos/The-herald-green.png', alt: 'The Herald' },
  { src: '/assets/banner-logos/LLB-green.png', alt: 'London Loves Business' },
  { src: '/assets/banner-logos/Daily_Mail_green.png', alt: 'Daily Mail' },
  { src: '/assets/banner-logos/businesstech-logo-green.png', alt: 'BusinessTech' },
  { src: '/assets/banner-logos/B-Daily-green.png', alt: 'B-Daily' },
]
</script>

<template>
  <div class="press band-cream" aria-label="As featured in">
    <div class="container">
      <div class="press-divider" />
    </div>
    <!-- marquee clipped to a 1400px zone: logos scroll past but overflow is hidden -->
    <div class="press-viewport">
      <div class="press-track">
        <!-- duplicated set for the seamless loop -->
        <div v-for="set in 2" :key="set" class="press-set" :aria-hidden="set === 2">
          <!-- eager: iOS Safari's lazy-loader misjudges the moving marquee track
               and leaves logos blank mid-scroll -->
          <img v-for="logo in logos" :key="logo.alt + set" :src="logo.src" :alt="set === 1 ? logo.alt : ''" loading="eager" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.press {
  overflow: hidden;
  padding-bottom: clamp(3rem, 11vh, 8rem);
}
.press-viewport {
  max-width: 1400px;
  margin-inline: auto;
  overflow: hidden;
  margin-top: 20px; /* spacing above the logo carousel */
}
.press-divider {
  height: 1px;
  background: #e7e3d6;
  margin-bottom: clamp(1.6rem, 4vh, 2.4rem);
}
.press-track {
  display: flex;
  width: max-content;
  animation: press-scroll 36s linear infinite;
}
.press-set {
  display: flex;
  align-items: center;
  gap: clamp(56px, 6vw, 112px);
  padding-right: clamp(56px, 6vw, 112px);
}
.press-set img {
  height: clamp(20px, 2.4vh, 26px);
  width: auto;
  object-fit: contain;
}
@keyframes press-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .press-track { animation: none; flex-wrap: wrap; }
}

/* Phones: less padding below the strip so the logos sit lower in the fold,
   balanced around Safari's floating URL bar */
@media (max-width: 768px) {
  .press { padding-bottom: 1.75rem; }
}

/* Short laptop viewports (1280×587): keep the strip visible under the hero */
@media (max-height: 650px) {
  .press { padding-bottom: 2rem; }
  .press-divider { margin-bottom: 1.4rem; }
}

/* Laptop heights: tighter strip so the logos stay inside the hero fold */
@media (min-width: 993px) and (max-height: 820px) {
  .press { padding-bottom: 1.4rem; }
  .press-divider { margin-bottom: 1rem; }
  .press-viewport { margin-top: 10px; }
}
</style>
