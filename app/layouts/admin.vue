<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

async function signOut() {
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-side">
      <NuxtLink to="/admin" class="admin-logo">
        <img src="/assets/legends-logo-black.png" alt="Legends EOR" />
        <span>CMS</span>
      </NuxtLink>

      <nav class="admin-nav">
        <NuxtLink to="/admin">Dashboard</NuxtLink>
        <NuxtLink to="/admin/resources">Resources</NuxtLink>
        <NuxtLink to="/admin/services">Services</NuxtLink>
        <NuxtLink to="/admin/leads">Leads</NuxtLink>
        <NuxtLink to="/admin/cta">A/B CTA Testing</NuxtLink>
      </nav>

      <div class="admin-user">
        <span v-if="user" class="admin-email">{{ user.email }}</span>
        <button v-if="user" class="admin-signout" @click="signOut">Sign out</button>
      </div>
    </aside>

    <main class="admin-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin-shell {
  display: grid;
  grid-template-columns: 230px 1fr;
  min-height: 100vh;
  background: var(--grey-light);
}
.admin-side {
  background: var(--white);
  border-right: 1px solid #e8e5dd;
  padding: 20px 14px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}
.admin-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  font-weight: 600;
  color: var(--green);
}
.admin-logo img { height: 30px; width: auto; }

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.admin-nav a {
  padding: 8px 10px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--body);
  font-size: 0.9rem;
}
.admin-nav a:hover { background: rgba(1, 69, 32, 0.06); }
.admin-nav a.router-link-exact-active {
  background: var(--green);
  color: var(--cream);
}

.admin-user {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--grey-mid);
}
.admin-email { word-break: break-all; }
.admin-signout {
  align-self: flex-start;
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 5px 12px;
  cursor: pointer;
  font-family: var(--sans);
  font-size: 0.8rem;
}
.admin-signout:hover { border-color: var(--accent); color: var(--accent); }

.admin-main {
  padding: clamp(20px, 3vw, 36px);
  min-width: 0;
}
@media (max-width: 800px) {
  .admin-shell { grid-template-columns: 1fr; }
  .admin-side { position: static; height: auto; }
}
</style>
