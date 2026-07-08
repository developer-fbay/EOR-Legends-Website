<script setup lang="ts">
// Talent Showcase — expanding video panels, from the user's "options" code block.
const videos = [
  {
    embed: 'https://www.youtube.com/embed/m2BG4ZfWK0g?si=BnzTTujfJU3XoPRX',
    thumb: 'https://the-legends-agency.com/wp-content/uploads/2026/02/Jilby-Business-development-representative-0-9-screenshot-2-scaled.png',
    pos: '59% 0%',
    posMobile: '59% 15%',
    label: 'Jilby — Business development representative',
  },
  {
    embed: 'https://www.youtube.com/embed/7NsHMPkdc8w?si=recL5dSBn8cVdfn9',
    thumb: 'https://the-legends-agency.com/wp-content/uploads/2026/02/Akhona-Commercial-Finance-Analyst-0-0-screenshot-2-scaled.png',
    pos: '50% 0%',
    posMobile: '50% 13%',
    label: 'Akhona — Commercial Finance Analyst',
  },
  {
    embed: 'https://www.youtube.com/embed/XSfgXISGReI?si=2g16V7huTwOC3xSh',
    thumb: 'https://the-legends-agency.com/wp-content/uploads/2026/02/Jordan-Financial-Analyst-0-0-screenshot.png',
    pos: '53% 0%',
    posMobile: '53% 33%',
    label: 'Jordan — Financial Analyst',
  },
  {
    embed: 'https://www.youtube.com/embed/Q4Xw63Hrn6I?si=67K9mG35BD1ILN4U',
    thumb: 'https://the-legends-agency.com/wp-content/uploads/2026/02/Nana-Team-Lead-0-13-screenshot.png',
    pos: '56% 0%',
    posMobile: '56% 11%',
    label: 'Nana — Team Lead',
  },
  {
    embed: 'https://www.youtube.com/embed/RyaM0SKxsrU?si=VHvN3r_QHbWSZ9ZC',
    thumb: 'https://the-legends-agency.com/wp-content/uploads/2025/12/Ree-Financial-Operations-Executive-0-0-screenshot.png',
    pos: '65% 0%',
    posMobile: '65% 48%',
    label: 'Ree — Financial Operations Executive',
  },
]

const active = ref(0)
</script>

<template>
  <section class="talent band-cream section fill-screen">
    <div class="container">
      <header class="talent-head">
        <h2>Talent Showcase</h2>
        <p>The people behind the results.</p>
      </header>

      <div class="options">
        <div
          v-for="(v, i) in videos"
          :key="v.embed"
          class="option"
          :class="{ active: active === i }"
          :style="{
            '--optionBackground': `url(${v.thumb})`,
            backgroundPosition: v.pos,
          }"
          role="button"
          :aria-label="`Play video: ${v.label}`"
          :tabindex="0"
          @click="active = i"
          @keydown.enter="active = i"
        >
          <div class="video-section">
            <iframe
              v-if="active === i"
              :src="v.embed"
              :title="v.label"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.talent-head {
  text-align: center;
  max-width: 720px;
  margin: 0 auto clamp(1.5rem, 4vh, 2.5rem);
}
.talent-head p { color: var(--grey-text); }

/* ===== User's expanding-options CSS (scoped) ===== */
.options {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  overflow: hidden;
  width: 100%;
  height: 450px;
  justify-content: center;
}
.options .option {
  position: relative;
  overflow: hidden;
  min-width: 120px;
  margin: 0 10px;
  background: var(--optionBackground, #fefa46);
  background-size: cover;
  cursor: pointer;
  transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
  filter: grayscale(100%);
}
.options .option.active {
  width: 800px;
  margin: 0;
  border-radius: 14px;
  background-size: cover;
  filter: grayscale(0%);
}
.options .option:not(.active) { border-radius: 14px; }
.options .option .video-section {
  position: absolute;
  inset: 0;
  display: flex;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.options .option.active .video-section {
  opacity: 1;
  pointer-events: all;
}
.options .option .video-section iframe {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 14px;
}

@media screen and (max-width: 1400px) {
  .options {
    flex-direction: column;
    width: 100%;
    height: auto;
    gap: 20px;
  }
  .options .option {
    min-width: 0;
    min-height: 100px;
    width: 100%;
    margin: 0 !important;
  }
  .options .option.active {
    width: 100% !important;
    height: 450px !important;
    border-radius: 14px;
  }
  .options .option:not(.active) { height: 80px; }
}
@media screen and (max-width: 900px) {
  .options .option.active {
    width: 100% !important;
    height: 300px !important;
  }
}

/* Short viewports: keep the row from dominating the screen */
@media (min-width: 1401px) and (max-height: 650px) {
  .options { height: 380px; }
}
</style>
