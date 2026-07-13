<script setup lang="ts">
/**
 * Guide download form — Gravity Form 30 (Full Name 5, Work email 4, Phone 3).
 * On success the guide PDF opens/downloads.
 */
import { isValidPhoneNumber } from 'libphonenumber-js'
import { PHONE_COUNTRIES } from '~/composables/usePhoneCountries'

const props = defineProps<{ pdfUrl: string; title?: string }>()

const form = reactive({ fullName: '', email: '', phoneCountry: 'GB', phone: '', website: '' })
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errors = reactive<Record<string, string>>({})

const selectedCountry = computed(
  () => PHONE_COUNTRIES.find((c) => c.code === form.phoneCountry) ?? PHONE_COUNTRIES[0]!,
)

const fullPhone = computed(
  () => `${selectedCountry.value.dial}${form.phone.replace(/[^\d]/g, '').replace(/^0+/, '')}`,
)

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.fullName.trim()) errors.fullName = 'This field is required.'
  if (!form.email.trim()) errors.email = 'This field is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'The email address entered is invalid.'
  if (!form.phone.trim()) errors.phone = 'This field is required.'
  // Same check Gravity Forms runs server-side on this field
  else if (!isValidPhoneNumber(fullPhone.value)) errors.phone = 'Please provide a valid phone number.'
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return
  status.value = 'sending'
  try {
    const res: any = await $fetch('/api/gf-submit', {
      method: 'POST',
      body: {
        formId: 30,
        website: form.website,
        values: {
          5: form.fullName,
          4: form.email,
          3: fullPhone.value,
        },
      },
    })
    if (res.ok) {
      status.value = 'sent'
      window.open(props.pdfUrl, '_blank', 'noopener')
    } else {
      status.value = 'idle'
      Object.entries(res.validation || {}).forEach(([id, msg]) => {
        const map: Record<string, string> = { 5: 'fullName', 4: 'email', 3: 'phone' }
        if (map[id]) errors[map[id]!] = String(msg)
      })
    }
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form class="lead-form" novalidate @submit.prevent="submit">
    <h3 class="lead-form__title">{{ title || 'Get a free cost estimate' }}</h3>

    <template v-if="status !== 'sent'">
      <input v-model="form.website" type="text" name="xf_2" autocomplete="one-time-code" class="hp-field" tabindex="-1" aria-hidden="true" />
      <div class="lead-form__field">
        <input v-model="form.fullName" type="text" placeholder="Full name *" :class="{ 'has-error': errors.fullName }" autocomplete="name" @input="delete errors.fullName" />
        <p v-if="errors.fullName" class="lead-form__field-error">{{ errors.fullName }}</p>
      </div>
      <div class="lead-form__field">
        <input v-model="form.email" type="email" placeholder="Work email *" :class="{ 'has-error': errors.email }" autocomplete="email" @input="delete errors.email" />
        <p v-if="errors.email" class="lead-form__field-error">{{ errors.email }}</p>
      </div>
      <div class="lead-form__field">
        <div class="lead-form__phone" :class="{ 'has-error': errors.phone }">
          <label class="lead-form__cc">
            <select v-model="form.phoneCountry" aria-label="Phone country code">
              <option v-for="c in PHONE_COUNTRIES" :key="c.code" :value="c.code">{{ c.flag }} {{ c.dial }} {{ c.name }}</option>
            </select>
            <span class="lead-form__cc-display" aria-hidden="true">
              {{ selectedCountry.flag }}
              <svg class="lead-form__cc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </span>
          </label>
          <div class="lead-form__phone-num">
            <input v-model="form.phone" type="tel" placeholder="Mobile number *" autocomplete="tel-national" @input="delete errors.phone" />
          </div>
        </div>
        <p v-if="errors.phone" class="lead-form__field-error">{{ errors.phone }}</p>
      </div>

      <button type="submit" class="lead-form__submit" :disabled="status === 'sending'">
        {{ status === 'sending' ? 'Sending…' : 'Download guide' }}
      </button>
      <p v-if="status === 'error'" class="lead-form__error">
        Something went wrong. Please try again or email
        <a href="mailto:enquiries@legendseor.com">enquiries@legendseor.com</a>.
      </p>
    </template>

    <div v-else class="lead-form__thanks">
      <p>Thank you! Your download should begin shortly.</p>
      <a :href="pdfUrl" target="_blank" rel="noopener" class="lead-form__retry">Click here if it doesn't start</a>
    </div>
  </form>
</template>

<style scoped>
/* Reuses the site form styling (same class contract as UiLeadForm) */
.lead-form {
  --la-border: #d9dcd8;
  --la-text: #16241c;
  --la-placeholder: #9aa09a;
  /* the guide hero section is beige, so the card is white to stand out */
  background: #fff;
  border-radius: 18px;
  padding: clamp(24px, 3vw, 40px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.lead-form__title {
  font-family: var(--serif);
  font-size: clamp(1.4rem, 1.9vw, 1.8rem);
  font-weight: 400;
  margin: 0;
  color: var(--body);
  text-align: center;
}
.lead-form__title::after {
  content: "";
  display: block;
  width: 56px;
  height: 3px;
  margin: 10px auto 0;
  background: var(--green);
  border-radius: 2px;
}
.lead-form input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--la-border);
  border-radius: 8px;
  font-family: var(--sans);
  font-size: 0.9rem;
  background: #fff;
  color: var(--la-text);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lead-form ::placeholder { color: var(--la-placeholder); opacity: 1; }
.lead-form input:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(1, 69, 32, 0.15);
}
.lead-form__field { display: flex; flex-direction: column; gap: 6px; }
.lead-form__field-error { color: #b42318; font-size: 0.8rem; margin: 0; }
.lead-form input.has-error, .lead-form__phone.has-error { border-color: #b42318; }

.lead-form__phone {
  display: flex;
  align-items: center;
  border: 1px solid var(--la-border);
  border-radius: 8px;
  background: #fff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lead-form__phone:focus-within {
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(1, 69, 32, 0.15);
}
.lead-form__cc { position: relative; flex: none; font-family: "Twemoji Country Flags", var(--sans); }
.lead-form__cc select { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
.lead-form__cc-display {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 4px 12px 16px;
  font-size: 1rem;
  white-space: nowrap;
  pointer-events: none;
}
.lead-form__cc-chev { width: 13px; height: 13px; color: var(--grey-mid); }
.lead-form__phone-num { flex: 1; }
.lead-form__phone-num input { border: none !important; background: transparent; padding-left: 10px; }
.lead-form__phone-num input:focus { outline: none; box-shadow: none; }

.lead-form__submit {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  margin-top: 2px;
  padding: 13px 30px;
  border: 3px solid transparent;
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  color: #fffcf6;
  border-radius: 100px;
  cursor: pointer;
  background-color: transparent;
  background-image:
    radial-gradient(circle closest-side, #cf3600 99%, rgba(207, 54, 0, 0) 100%),
    linear-gradient(#eb3d00, #eb3d00);
  background-position: center, center;
  background-repeat: no-repeat, no-repeat;
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  background-size: 0px 0px, 100% 100%;
  box-shadow: 0 0 0 2px #eb3d00;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1), background-size 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.lead-form__submit:hover:not(:disabled) {
  border-radius: 12px;
  box-shadow: 0 0 0 12px transparent;
  background-size: 560px 560px, 100% 100%;
}
.lead-form__submit:active:not(:disabled) { scale: 0.95; }
.lead-form__submit:disabled { opacity: 0.55; cursor: not-allowed; }
.lead-form__error { color: #b42318; font-size: 0.85rem; margin: 0; }
.lead-form__thanks { text-align: center; color: var(--green); }
.lead-form__thanks p { margin: 0 0 8px; font-size: 1rem; }
.lead-form__retry { color: var(--accent); font-size: 0.85rem; }
</style>
