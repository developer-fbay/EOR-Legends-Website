<script setup lang="ts">
// Supabase auth callback landing — redirects into the CMS once the session is set.
definePageMeta({ layout: false })
const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) navigateTo('/admin')
})
</script>

<template>
  <div style="min-height: 60vh; display: flex; align-items: center; justify-content: center">
    <p>Signing you in…</p>
  </div>
</template>
