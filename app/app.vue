<script setup lang="ts">
// Global SEO: canonical + og:url per route, site-wide Open Graph defaults,
// Organization + WebSite structured data. Per-page title/description/og:title
// come from usePageSeo in each page.
const route = useRoute()
const SITE = 'https://legendseor.com'

const canonical = computed(() => `${SITE}${route.path === '/' ? '' : route.path.replace(/\/$/, '')}`)

useHead({
  link: [{ rel: 'canonical', href: canonical }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${SITE}/#organization`,
            name: 'Legends EOR',
            url: SITE,
            logo: `${SITE}/assets/legends-logo-black.png`,
            description:
              'Employer of Record services in South Africa. Hire elite South African talent without setting up a local entity.',
          },
          {
            '@type': 'WebSite',
            '@id': `${SITE}/#website`,
            name: 'Legends EOR',
            url: SITE,
            publisher: { '@id': `${SITE}/#organization` },
          },
        ],
      }),
    },
  ],
})

useSeoMeta({
  ogUrl: () => canonical.value,
  ogType: 'website',
  ogSiteName: 'Legends EOR',
  ogLocale: 'en_GB',
  ogImage: `${SITE}/assets/legends-logo-black.png`,
  twitterCard: 'summary',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <!-- Branded overlay loader during page navigation -->
    <UiPageLoader />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
