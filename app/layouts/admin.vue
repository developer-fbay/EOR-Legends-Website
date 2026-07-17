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
  /* warm parchment canvas — ties the admin to the site's cream brand */
  background: #f6f4ee;
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

<style>
/* ============================================================
   Admin design system (shared by every CMS tab)
   canvas #f6f4ee · card #fff · hairline #e7e2d4 · ink #1c2520
   muted #71786f · green #014520 · tint #eef3ea · accent #eb3d00
   ============================================================ */
.admin-page { max-width: 980px; margin-inline: auto; }
.admin-page--wide { max-width: 1260px; margin-inline: auto; }
.admin-title {
  font-family: var(--serif);
  font-size: 1.9rem;
  font-weight: 400;
  color: #1c2520;
  margin-bottom: 8px;
}
.admin-intro { color: #71786f; margin-bottom: 24px; max-width: 62ch; line-height: 1.6; }
.admin-note { color: #71786f; }
.ds-card { background: #fff; border: 1px solid #e7e2d4; border-radius: 14px; padding: 24px; }

.admin-table {
  width: 100%;
  background: #fff;
  border: 1px solid #e7e2d4;
  border-radius: 14px;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  font-size: 0.88rem;
}
.admin-table th {
  text-align: left;
  padding: 12px 16px;
  background: #faf8f1;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #71786f;
  border-bottom: 1px solid #eee9dc;
}
.admin-table td { padding: 12px 16px; border-top: 1px solid #f0ede3; color: #1c2520; }
.admin-table tbody tr:first-child td { border-top: none; }
.admin-table tbody tr:hover td { background: #faf9f4; }
.admin-table a { color: #014520; }
</style>
