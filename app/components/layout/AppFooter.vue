<script setup lang="ts">
// Footer — matches the WP build's footer. Link columns mirror the navbar items
// (plus Privacy Policy and Modern Slavery Act, kept per design direction).
const services = [
  { label: 'Human Resources', to: '/services/hr' },
  { label: 'Payroll', to: '/services/payroll' },
  { label: 'Employee Benefits', to: '/services/employee-benefits' },
  { label: 'Company Culture', to: '/services/company-culture' },
  { label: 'Contractor Management', to: '/services/contractor-management' },
  { label: 'EOR Migration', to: '/services/eor-migration' },
  { label: 'Onboarding/Offboarding', to: '/services/onboarding-offboarding' },
  { label: 'Office Space', to: '/services/office-space' },
  { label: 'IT Support', to: '/services/it-support' },
  { label: 'IT Equipment', to: '/services/it-equipment' },
]
// "Contact Us" opens the popup form (Gravity Form 31), same as the navbar button.
const contactModal = useState('contact-modal', () => false)
const { ctaText } = useCtaVariant()
function openContact() {
  contactModal.value = true
}
const resources = [
  { label: 'Blogs', to: '/blog' },
  { label: 'News Articles', to: '/news' },
  { label: 'Case Studies', to: '/case-studies' },
  { label: 'HR Glossary', to: '/hr-glossary' },
  { label: 'Tools', to: '/tools' },
]
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="/assets/legends-logo-black.png" alt="Legends EOR" class="footer-logo" />
          <p class="footer-hq"><strong>Cape Town, South Africa HQ:</strong></p>
          <address>
            2nd floor, Wembley Square, 40 Solan Rd,<br />
            Gardens, Cape Town, 8001
          </address>
          <p class="footer-email">
            <a href="mailto:enquiries@legendseor.com">enquiries@legendseor.com</a>
          </p>
          <p class="footer-phones">
            SA: <a href="tel:+27213305653">+27 21 330 5653</a><br />
            UK: <a href="tel:+442039186575">+44 (0) 203 918 6575</a><br />
            USA: <a href="tel:+13862006643">+1 386 200 6643</a>
          </p>
          <p class="footer-legal-p">
            The Legends Agency Limited is registered in England and Wales No.15421071.
            Registered office at Iceni Court, Evolution House, Delft Way, Norwich NR6 6BB
          </p>
          <p class="footer-legal-p">
            The Legends Agency South Africa (Pty) Ltd is registered in South Africa
            Company Registration No 2020/134946/07
          </p>
        </div>

        <nav class="footer-col" aria-label="Services">
          <h4>Services</h4>
          <NuxtLink v-for="l in services" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        </nav>

        <nav class="footer-col" aria-label="Get started">
          <h4>Get started</h4>
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/about">About us</NuxtLink>
          <button type="button" class="footer-contact-btn" @click="openContact">{{ ctaText('Contact Us') }}</button>
          <a href="https://the-legends-agency.com/careers/" target="_blank" rel="noopener">Careers</a>
          <NuxtLink to="/privacy-policy">Privacy Policy</NuxtLink>
          <NuxtLink to="/modern-slavery-act">Modern Slavery Act</NuxtLink>
        </nav>

        <nav class="footer-col" aria-label="Resources">
          <h4>Resources</h4>
          <NuxtLink v-for="l in resources" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        </nav>

        <div class="footer-col footer-social">
          <h4>Connect</h4>
          <div class="social-row">
            <a href="https://www.facebook.com/legendseor" aria-label="Facebook" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.5 1.5-1.5h1.4V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H7.8v3h2.4v7h3.3z"/></svg>
            </a>
            <a href="https://www.linkedin.com/company/legends-eor" aria-label="LinkedIn" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.9H3.8V20h3.1V8.9zM5.4 7.6c1 0 1.8-.8 1.8-1.8S6.4 4 5.4 4 3.6 4.8 3.6 5.8s.8 1.8 1.8 1.8zM20.4 20h-3.1v-5.4c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V20h-3.1V8.9h3v1.4h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V20z"/></svg>
            </a>
            <a href="https://www.instagram.com/legendseor" aria-label="Instagram" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="3.8"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>
            </a>
            <a href="https://www.youtube.com/@legendseor" aria-label="YouTube" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8zM10 15.2V8.8l5.2 3.2L10 15.2z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <p class="footer-copyright">Copyright © {{ year }}. The Legends Agency. All rights reserved.</p>
      <p class="footer-disclaimer">
        We improve our products and advertising by using Microsoft Clarity to see how you use our
        website. By using our site, you agree that we and Microsoft can collect and use this data.
        Our <NuxtLink to="/privacy-policy">privacy statement</NuxtLink> has more details.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--cream);
  padding: clamp(2.5rem, 6vh, 4.5rem) 0 2rem;
  font-size: 16px;
}
.footer-grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr 0.9fr;
  gap: 32px;
}
.footer-logo {
  height: 44px;
  width: auto;
  margin-bottom: 20px;
}
.footer-hq {
  font-family: var(--serif);
  font-size: 1.05rem;
  margin-bottom: 2px;
}
address {
  font-style: normal;
  line-height: 1.6;
  margin-bottom: 16px;
}
.footer-email a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}
.footer-email a:hover { text-decoration: underline; }
.footer-phones {
  line-height: 1.7;
  margin-bottom: 20px;
}
.footer-phones a {
  color: var(--body);
  text-decoration: none;
}
.footer-phones a:hover { color: var(--accent); }
.footer-legal-p {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--body);
  max-width: 42ch;
  margin-bottom: 12px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
/* Serif column headers, dark — matches the WP footer */
.footer-col h4 {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 1.3rem;
  color: var(--body);
  margin: 0 0 10px;
}
.footer-col a {
  text-decoration: none;
  color: var(--body);
  font-weight: 300;
}
.footer-col a:hover { color: var(--accent); }
/* Contact Us button styled identically to the sibling links */
.footer-contact-btn {
  background: none;
  border: none;
  padding: 0;
  font-family: var(--sans);
  font-size: inherit;
  font-weight: 300;
  color: var(--body);
  text-align: left;
  cursor: pointer;
}
.footer-contact-btn:hover { color: var(--accent); }

/* Plain orange icons — no circles */
.social-row {
  display: flex;
  gap: 18px;
}
.social-row a {
  color: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease, transform 0.2s ease;
}
.social-row a:hover {
  color: var(--accent-dark);
  transform: translateY(-2px);
}
.social-row svg {
  width: 19px;
  height: 19px;
}

.footer-copyright {
  margin: 40px 0 10px;
  font-size: 0.9rem;
}
.footer-disclaimer {
  font-size: 0.85rem;
  color: var(--body);
  margin: 0;
}
.footer-disclaimer a { color: var(--body); }

@media (max-width: 992px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .footer-grid { grid-template-columns: 1fr; }
}
</style>
