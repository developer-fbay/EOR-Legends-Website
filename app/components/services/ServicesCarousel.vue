<script setup lang="ts">
/**
 * Services carousel — marquee like the homepage logo strip, but each item is
 * a navbar service (same icon + label) linking to its service page.
 */
const items = [
  { label: 'Human Resources', to: '/services/hr', icon: 'hr' },
  { label: 'Payroll', to: '/services/payroll', icon: 'payroll' },
  { label: 'Employee Benefits', to: '/services/employee-benefits', icon: 'benefits' },
  { label: 'Company Culture', to: '/services/company-culture', icon: 'culture' },
  { label: 'Contractor Management', to: '/services/contractor-management', icon: 'contractor' },
  { label: 'EOR Migration', to: '/services/eor-migration', icon: 'migration' },
  { label: 'Onboarding/Offboarding', to: '/services/onboarding-offboarding', icon: 'onboarding' },
  { label: 'Office Space', to: '/services/office-space', icon: 'office' },
  { label: 'IT Support', to: '/services/it-support', icon: 'itsupport' },
  { label: 'IT Equipment', to: '/services/it-equipment', icon: 'itequipment' },
]
</script>

<template>
  <div class="svcc band-cream" aria-label="Our services">
    <div class="container">
      <div class="svcc-divider" />
    </div>
    <div class="svcc-viewport">
      <div class="svcc-track">
        <!-- duplicated set for the seamless loop -->
        <div v-for="set in 2" :key="set" class="svcc-set" :aria-hidden="set === 2">
          <NuxtLink
            v-for="item in items"
            :key="item.to + set"
            :to="item.to"
            class="svcc-item"
            :tabindex="set === 2 ? -1 : 0"
          >
            <span class="svcc-ico"><LayoutNavIcon :name="item.icon" /></span>
            <span class="svcc-label">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svcc {
  overflow: hidden;
  padding-bottom: clamp(2.5rem, 6vh, 4rem);
}
.svcc-divider {
  height: 1px;
  background: #e7e3d6;
  margin-bottom: clamp(1.6rem, 4vh, 2.4rem);
}
.svcc-viewport {
  max-width: 1400px;
  margin-inline: auto;
  overflow: hidden;
  margin-top: 20px;
}
.svcc-track {
  display: flex;
  width: max-content;
  animation: svcc-scroll 40s linear infinite;
  /* compositor layer — same fix as the press marquee: unpromoted, the slow
     drift is repainted on the main thread and snaps to whole pixels */
  will-change: transform;
  backface-visibility: hidden;
}
.svcc-track:hover {
  animation-play-state: paused;
}
.svcc-set {
  display: flex;
  align-items: center;
  gap: clamp(28px, 3.5vw, 56px);
  padding-right: clamp(28px, 3.5vw, 56px);
}
.svcc-item {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  white-space: nowrap;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background 0.18s ease;
}
.svcc-item:hover {
  background: rgba(1, 69, 32, 0.06);
}
.svcc-ico {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(1, 69, 32, 0.07);
  color: var(--green);
  transition: background 0.18s ease, color 0.18s ease;
}
.svcc-ico :deep(svg) {
  width: 17px;
  height: 17px;
}
.svcc-item:hover .svcc-ico {
  background: var(--green);
  color: #fff;
}
.svcc-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--body);
  transition: color 0.18s ease;
}
.svcc-item:hover .svcc-label {
  color: var(--green);
}
@keyframes svcc-scroll {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
/* Short laptops: tighter strip so it fits inside the service-page fold */
@media (max-height: 650px) and (min-width: 900px) {
  .svcc { padding-bottom: 1rem; }
  .svcc-divider { margin-bottom: 0.9rem; }
  .svcc-viewport { margin-top: 8px; }
}
@media (prefers-reduced-motion: reduce) {
  .svcc-track {
    animation: none;
    flex-wrap: wrap;
  }
}
</style>
