// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxtjs/supabase'],

  supabase: {
    // Placeholders keep the app booting before the user creates their
    // Supabase project; real values come from .env (see .env.example).
    url: process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    key: process.env.SUPABASE_KEY || 'placeholder-anon-key',
    // Only the /admin area requires a logged-in user; the public site is open.
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin/confirm',
      include: ['/admin(/*)?'],
      exclude: ['/admin/login'],
    },
  },

  nitro: {
    routeRules: {
      // Static design assets rarely change — let browsers cache them for a week
      '/assets/**': { headers: { 'Cache-Control': 'public, max-age=604800' } },
      '/data/**': { headers: { 'Cache-Control': 'public, max-age=86400' } },
      // After the domain moves to this site, media/PDF links that still point
      // at legendseor.com/wp-content/... are proxied through to WordPress on
      // its subdomain. Set WP_BASE_URL (e.g. https://wp.legendseor.com) at
      // build time in production — REQUIRED once the domain flips, otherwise
      // this would proxy to itself.
      '/wp-content/**': {
        proxy: `${process.env.WP_BASE_URL || process.env.GF_BASE_URL || 'https://legendseor.com'}/wp-content/**`,
      },
    },
  },

  css: ['~/assets/styles/base.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: (title) => (title ? `${title} | Legends EOR` : 'Legends EOR | Hire in South Africa, the easy way'),
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Poppins:wght@300;400;500;600;700&display=swap',
        },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
})
