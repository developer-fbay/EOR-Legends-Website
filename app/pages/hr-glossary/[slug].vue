<script setup lang="ts">
const route = useRoute()
const { data: term } = await useContentBySlug('hr_glossary', String(route.params.slug))
if (!term.value) throw createError({ statusCode: 404, statusMessage: 'Term not found' })
useContentSeo(term)
</script>

<template>
  <UiArticlePage v-if="term" :article="term" back-to="/hr-glossary" back-label="HR Glossary" />
</template>
