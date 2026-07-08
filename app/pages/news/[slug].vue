<script setup lang="ts">
const route = useRoute()
const { data: post } = await useContentBySlug('news_articles', String(route.params.slug))
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Article not found' })
useContentSeo(post)
</script>

<template>
  <UiArticlePage v-if="post" :article="post" back-to="/news" back-label="All news" category="News" />
</template>
