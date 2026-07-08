<script setup lang="ts">
import { PRIVACY_HTML } from '~/data/privacy-policy'

usePageSeo({
  title: 'Privacy Policy',
  description:
    'How The Legends Agency collects, processes, stores and discloses personal data, including our cookie policy and POPIA data subject consent.',
})
</script>

<template>
  <UiLegalPage title="Privacy Policy" :html="PRIVACY_HTML" />
</template>
