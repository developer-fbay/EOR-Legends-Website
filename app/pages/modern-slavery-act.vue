<script setup lang="ts">
import { MODERN_SLAVERY_HTML } from '~/data/modern-slavery'

usePageSeo({
  title: 'Modern Slavery Act',
  description:
    'The Legends Agency’s statement under the Modern Slavery Act 2015: our zero-tolerance approach to modern slavery and human trafficking across our business and supply chains.',
})
</script>

<template>
  <UiLegalPage title="Modern Slavery Act" :html="MODERN_SLAVERY_HTML" />
</template>
