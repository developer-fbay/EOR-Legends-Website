<script setup lang="ts">
// Nav structure adapted from the user's "Navbar Services & Resources dropdown" code block.
// Icon SVGs are kept verbatim from that code.
const servicesLinks = [
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

// Problem pillars and lead magnet removed per design direction.
const resourcesLinks = [
  { label: 'About', to: '/about', icon: 'about' },
  { label: 'Blogs', to: '/blog', icon: 'blogs' },
  { label: 'News Articles', to: '/news', icon: 'news' },
  { label: 'HR Glossary', to: '/hr-glossary', icon: 'glossary' },
  { label: 'Tools', to: '/tools', icon: 'calc' },
]

const mobileOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { mobileOpen.value = false })

// "Contact us" opens the popup form (Gravity Form 31) rather than navigating.
const contactModal = useState('contact-modal', () => false)
const { ctaText } = useCtaVariant()
function openContact() {
  mobileOpen.value = false
  contactModal.value = true
}
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <NuxtLink to="/" class="header-logo" aria-label="Legends EOR home">
        <img src="/assets/legends-logo-black.png" alt="Legends EOR" />
      </NuxtLink>

      <!-- Desktop nav + CTA grouped together on the right (matches WP navbar) -->
      <div class="header-right">
      <nav class="ln-wrap" aria-label="Main navigation">
        <div class="ln-item">
          <NuxtLink class="ln-trigger" to="/services">Services
            <svg class="ln-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </NuxtLink>
          <div class="ln-dd">
            <NuxtLink v-for="link in servicesLinks" :key="link.to" class="ln-link" :to="link.to">
              <span class="ln-ico"><LayoutNavIcon :name="link.icon" /></span>
              <span class="ln-label">{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div class="ln-item">
          <NuxtLink class="ln-trigger" to="/learn">Resources
            <svg class="ln-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          </NuxtLink>
          <div class="ln-dd">
            <NuxtLink v-for="link in resourcesLinks" :key="link.to" class="ln-link" :to="link.to">
              <span class="ln-ico"><LayoutNavIcon :name="link.icon" /></span>
              <span class="ln-label">{{ link.label }}</span>
            </NuxtLink>
          </div>
        </div>

        <div class="ln-item">
          <NuxtLink class="ln-trigger" to="/case-studies">Case Studies</NuxtLink>
        </div>
      </nav>

      <button type="button" class="brand-btn brand-btn--orange header-cta" @click="openContact">{{ ctaText('Contact Us', 'header') }}</button>
      </div>

      <!-- Mobile hamburger -->
      <button class="header-burger" :aria-expanded="mobileOpen" aria-label="Toggle menu" @click="mobileOpen = !mobileOpen">
        <span /><span /><span />
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="mm">
      <nav v-if="mobileOpen" class="mobile-menu" aria-label="Mobile navigation">
        <details>
          <summary>Services</summary>
          <NuxtLink v-for="link in servicesLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        </details>
        <details>
          <summary>Resources</summary>
          <NuxtLink v-for="link in resourcesLinks" :key="link.to" :to="link.to">{{ link.label }}</NuxtLink>
        </details>
        <NuxtLink to="/case-studies">Case Studies</NuxtLink>
        <button type="button" class="brand-btn brand-btn--orange" @click="openContact">{{ ctaText('Contact us', 'header') }}</button>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 2000;
  background: var(--cream);
  border-bottom: 1px solid rgba(1, 69, 32, 0.08);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 78px;
}
.header-logo img {
  height: 32px;
  width: auto;
}
/* Nav links + Contact button sit together as one right-aligned cluster */
.header-right {
  display: flex;
  align-items: center;
  gap: 34px;
}
.header-cta {
  flex: none;
}

/* ===== LEGENDS nav dropdowns (user's code, verbatim behaviour) ===== */
.ln-wrap {
  --ln-action: #eb3d00;
  --ln-accent: #014520;
  --ln-dark: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 34px;
  font-family: var(--sans);
}
@media (max-width: 992px) {
  .ln-wrap { display: none; }
  .header-cta { display: none; }
}

.ln-item {
  position: relative;
  transition: 0.3s ease;
}
.ln-trigger {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--sans);
  font-weight: 600;
  font-size: 15px;
  color: var(--ln-dark);
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  padding: 10px 0;
  transition: 0.3s ease;
}
.ln-chev { width: 14px; height: 14px; color: var(--ln-action); transition: transform 0.25s ease; }
.ln-item:hover .ln-trigger { transform: scale(1.1); }
.ln-item:hover .ln-chev { transform: rotate(180deg); }

.ln-dd {
  position: absolute;
  top: calc(100% + 14px);
  left: 0;
  z-index: 1000;
  width: 300px;
  background: #ffffff;
  border: 1px solid rgba(1, 69, 32, 0.08);
  border-radius: 14px;
  box-shadow: 0 14px 34px -10px rgba(1, 69, 32, 0.2);
  padding: 8px;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
}
.ln-dd::before {
  content: "";
  position: absolute;
  top: -14px;
  left: 0;
  right: 0;
  height: 14px;
}
.ln-item:hover .ln-dd {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  pointer-events: auto;
}

.ln-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
  transition: background 0.18s ease;
}
.ln-link:hover { background: rgba(1, 69, 32, 0.06); }
.ln-link:focus-visible { outline: 2px solid var(--ln-action); outline-offset: 2px; }
.ln-ico {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(1, 69, 32, 0.07);
  color: var(--ln-accent);
  transition: background 0.18s ease, color 0.18s ease;
}
.ln-ico :deep(svg) { width: 17px; height: 17px; }
.ln-link:hover .ln-ico { background: var(--ln-accent); color: #fff; }
.ln-label { font-size: 15px; font-weight: 500; color: var(--ln-dark); line-height: 1.25; transition: color 0.18s ease; }
.ln-link:hover .ln-label { color: var(--ln-accent); }

@media (prefers-reduced-motion: reduce) {
  .ln-dd, .ln-link, .ln-ico, .ln-label, .ln-chev { transition: none !important; }
}

/* ===== Mobile ===== */
.header-burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
}
.header-burger span {
  width: 24px;
  height: 2px;
  background: var(--body);
  border-radius: 2px;
}
@media (max-width: 992px) {
  .header-burger { display: flex; }
}

.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px 24px;
  background: var(--cream);
  border-bottom: 1px solid rgba(1, 69, 32, 0.08);
}
.mobile-menu a {
  padding: 10px 0;
  text-decoration: none;
  font-weight: 500;
}
.mobile-menu details summary {
  padding: 10px 0;
  font-weight: 600;
  cursor: pointer;
}
.mobile-menu details a {
  display: block;
  padding: 8px 0 8px 16px;
}
.mobile-menu .brand-btn { align-self: flex-start; margin-top: 8px; }
.mm-enter-active, .mm-leave-active { transition: opacity 0.2s ease; }
.mm-enter-from, .mm-leave-to { opacity: 0; }
</style>
