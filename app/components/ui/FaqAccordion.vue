<script setup lang="ts">
// FAQ accordion — white card, orange +/× toggles, first item open (WP style).
defineProps<{ faqs: { q: string; a: string }[] }>()
const open = ref<number | null>(0)
function toggle(i: number) {
  open.value = open.value === i ? null : i
}
</script>

<template>
  <div class="faqc">
    <div v-for="(f, i) in faqs" :key="i" class="faqc-item">
      <button class="faqc-q" :aria-expanded="open === i" @click="toggle(i)">
        <span>{{ f.q }}</span>
        <span class="faqc-icon" aria-hidden="true">{{ open === i ? '×' : '+' }}</span>
      </button>
      <div v-show="open === i" class="faqc-a">
        <p>{{ f.a }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.faqc {
  background: var(--white);
  border: 1px solid #ece9e2;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: 10px clamp(18px, 3vw, 36px);
}
.faqc-item + .faqc-item { border-top: 1px solid #efece5; }
.faqc-q {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 0;
  background: none;
  border: none;
  font-family: var(--sans);
  font-size: 1.05rem;
  font-weight: 600;
  text-align: left;
  color: var(--body);
  cursor: pointer;
}
.faqc-icon {
  flex: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  line-height: 1;
}
.faqc-a {
  padding: 0 0 20px;
  color: var(--grey-text);
}
.faqc-a p { margin: 0; max-width: 90ch; }
</style>
