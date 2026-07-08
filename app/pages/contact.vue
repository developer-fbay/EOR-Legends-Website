<script setup lang="ts">
// Contact Us — matches the WP page: details left, estimate form right,
// reviews carousel band, then two office map embeds.
usePageSeo({
  title: 'Contact Us',
  description:
    'Get in touch with Legends EOR — offices in Cape Town and London. Call, email or request a free cost estimate for hiring in South Africa.',
})
</script>

<template>
  <main>
    <section class="contact band-cream section">
      <div class="container contact-grid">
        <div class="contact-info">
          <h1 class="la-heading-left">Contact us</h1>

          <h2>Visit us</h2>
          <ul class="contact-list">
            <li>
              <span class="c-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5Z"/><circle cx="12" cy="10" r="2.6"/></svg>
              </span>
              <p><strong>Cape Town, South Africa HQ:</strong> 2nd floor, Wembley Square, 40 Solan Road, Gardens, Cape Town, South Africa, 8001</p>
            </li>
            <li>
              <span class="c-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.5s-7-6.2-7-11.5a7 7 0 0 1 14 0c0 5.3-7 11.5-7 11.5Z"/><circle cx="12" cy="10" r="2.6"/></svg>
              </span>
              <p><strong>London, UK:</strong> 10 Lower Thames Street, London, EC3R 6AF</p>
            </li>
          </ul>

          <h2>Call us</h2>
          <ul class="contact-list">
            <li>
              <span class="c-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/></svg>
              </span>
              <p><strong>UK:</strong> <a href="tel:+442039186575">+44 203 918 6575</a></p>
            </li>
            <li>
              <span class="c-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/></svg>
              </span>
              <p><strong>USA:</strong> <a href="tel:+13862006643">+1 386 200 6643</a></p>
            </li>
            <li>
              <span class="c-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l1.5 4.5-2.2 1.6a13 13 0 0 0 5.6 5.6l1.6-2.2L20 15v4a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z"/></svg>
              </span>
              <p><strong>RSA:</strong> <a href="tel:+27213305653">+27 21 330 5653</a></p>
            </li>
          </ul>

          <h2>Email us</h2>
          <ul class="contact-list">
            <li>
              <span class="c-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>
              </span>
              <p><a href="mailto:enquiries@legendseor.com">enquiries@legendseor.com</a></p>
            </li>
          </ul>
        </div>

        <div class="contact-form">
          <UiLeadForm :gf-form-id="31" source="contact-page" title="Get a free cost estimate" />
        </div>
      </div>
    </section>

    <HomeReviewsCarousel />

    <section class="maps band-cream section">
      <div class="container maps-grid">
        <div>
          <h2 class="la-heading-left">Cape Town, South Africa HQ</h2>
          <div class="map-wrap">
            <iframe
              src="https://www.google.com/maps?q=The%20Legends%20Agency%2C%20Wembley%20Square%2C%2040%20Solan%20Rd%2C%20Gardens%2C%20Cape%20Town&output=embed"
              title="Map: Legends EOR Cape Town office"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              allowfullscreen
            />
          </div>
        </div>
        <div>
          <h2 class="la-heading-left">London, UK</h2>
          <div class="map-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2574.1297961737146!2d-0.08671981043242014!3d51.506571250417544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876056495b9fd65%3A0x8074dcd679997977!2sLegends%20Employer%20of%20Record!5e1!3m2!1sen!2suk!4v1783517610175!5m2!1sen!2suk"
              title="Map: Legends EOR London office"
              loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(28px, 5vw, 80px);
  align-items: start;
}

/* Left-aligned serif heading with short green underline */
.la-heading-left {
  position: relative;
  margin-bottom: 0.9em;
}
.la-heading-left::after {
  content: "";
  display: block;
  width: 56px;
  height: 3px;
  margin-top: 12px;
  background: var(--green);
  border-radius: 2px;
}

.contact-info h2 {
  font-family: var(--serif);
  font-size: 1.35rem;
  margin: 1.4em 0 0.6em;
}
.contact-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.contact-list p { margin: 0; }
.contact-list a {
  color: var(--body);
  text-decoration: none;
}
.contact-list a:hover { color: var(--accent); }
.c-ico {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid var(--green);
  color: var(--green);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}
.c-ico svg { width: 17px; height: 17px; }

.contact-form {
  position: sticky;
  top: 96px;
}

.maps-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(28px, 4vw, 56px);
}
.map-wrap {
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}
.map-wrap iframe {
  display: block;
  width: 100%;
  height: 380px;
  border: 0;
}

@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
  .contact-form { position: static; max-width: 480px; }
  .maps-grid { grid-template-columns: 1fr; }
}
</style>
