<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const configured = useCmsConfigured()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

watchEffect(() => {
  if (user.value) navigateTo('/admin')
})

async function signIn() {
  loading.value = true
  error.value = ''
  const { error: err } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  loading.value = false
  if (err) error.value = err.message
  else navigateTo('/admin')
}
</script>

<template>
  <div class="login-wrap">
    <form class="login-card" @submit.prevent="signIn">
      <img src="/assets/legends-logo-black.png" alt="Legends EOR" class="login-logo" />
      <h1>CMS sign in</h1>

      <p v-if="!configured" class="login-warn">
        Supabase isn't connected yet. Copy <code>.env.example</code> to <code>.env</code>,
        fill in your Supabase project keys, run <code>supabase/schema.sql</code> in the
        SQL editor, and create your admin user under Authentication → Users.
      </p>

      <label>
        Email
        <input v-model="email" type="email" required autocomplete="username" />
      </label>
      <label>
        Password
        <input v-model="password" type="password" required autocomplete="current-password" />
      </label>

      <button class="brand-btn brand-btn--orange" type="submit" :disabled="loading || !configured">
        {{ loading ? 'Signing in…' : 'Sign in' }}
      </button>
      <p v-if="error" class="login-error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--grey-light);
  padding: 20px;
}
.login-card {
  background: var(--white);
  border-radius: 16px;
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.1);
  padding: 36px;
  width: min(100%, 400px);
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.login-logo { height: 36px; width: auto; align-self: flex-start; }
.login-card h1 {
  font-family: var(--serif);
  font-size: 1.5rem;
  margin: 0;
}
.login-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}
.login-card input {
  padding: 10px 12px;
  border: 1px solid #e2ded4;
  border-radius: 9px;
  font-family: var(--sans);
  font-size: 0.9rem;
}
.login-card input:focus { outline: none; border-color: var(--green); }
.login-warn {
  font-size: 0.8rem;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 9px;
  padding: 10px 12px;
  color: #9a3412;
  margin: 0;
}
.login-warn code { font-size: 0.75rem; }
.login-error { color: var(--accent); font-size: 0.85rem; margin: 0; }
</style>
