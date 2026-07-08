<script setup lang="ts">
const route = useRoute()
const { data: post } = await useContentBySlug('blogs', String(route.params.slug))
if (!post.value) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
useContentSeo(post)
</script>

<template>
  <UiArticlePage v-if="post" :article="post" back-to="/blog" back-label="All blogs" />
</template>
