<script setup lang="ts">
import { PHONE_COUNTRIES } from '~/composables/usePhoneCountries'

/**
 * Lead form matching the site's three Gravity Forms:
 *   header/hero form → GF 29, footer form → GF 28, contact popup → GF 31.
 * Progressive conditional logic (mirrors the GF setup):
 *   1. Full name, work email, mobile (with country-code + flag) show first.
 *   2. Typing a mobile number reveals the employer / job-seeker radio.
 *   3. Choosing either reveals the company name and message fields.
 */
const props = withDefaults(defineProps<{
  gfFormId: 28 | 29 | 31
  title?: string
  source?: string
}>(), {
  title: 'Get a free cost estimate',
})

const form = reactive({
  fullName: '',
  email: '',
  phoneCountry: 'GB',
  phone: '',
  audience: '' as '' | 'employer' | 'jobseeker',
  company: '',
  message: '',
  website: '', // honeypot — invisible to humans, bots fill it
})

const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

// Conditional reveals
const showAudience = computed(() => form.phone.trim().length > 0)
const showDetails = computed(() => showAudience.value && form.audience !== '')

const selectedCountry = computed(
  () => PHONE_COUNTRIES.find((c) => c.code === form.phoneCountry) ?? PHONE_COUNTRIES[0]!,
)

// Field-level validation (GF style): messages appear under each field on submit.
const errors = reactive<Record<string, string>>({})
const REQUIRED_MSG = 'This field is required.'

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.fullName.trim()) errors.fullName = REQUIRED_MSG
  if (!form.email.trim()) errors.email = REQUIRED_MSG
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'The email address entered is invalid.'
  if (!form.phone.trim()) errors.phone = REQUIRED_MSG
  else if (form.phone.replace(/\D/g, '').length < 6) errors.phone = 'Please enter a valid phone number.'
  if (showAudience.value && !form.audience) errors.audience = REQUIRED_MSG
  if (showDetails.value) {
    if (!form.company.trim()) errors.company = REQUIRED_MSG
    if (!form.message.trim()) errors.message = REQUIRED_MSG
  }
  return Object.keys(errors).length === 0
}

// Clear a field's error as soon as the user edits it
function clearError(field: string) {
  delete errors[field]
}

async function submit() {
  if (!validate()) return
  status.value = 'sending'
  try {
    await $fetch('/api/lead', {
      method: 'POST',
      body: {
        fullName: form.fullName,
        email: form.email,
        // Strip spaces/formatting and the national leading zero ("07926…" → "+447926…")
        // — Gravity Forms' phone validation rejects e.g. +4407… as invalid.
        phone: `${selectedCountry.value.dial}${form.phone.replace(/[^\d]/g, '').replace(/^0+/, '')}`,
        audience: form.audience,
        company: form.company,
        message: form.message,
        gfFormId: props.gfFormId,
        source: props.source || `gf-${props.gfFormId}`,
        website: form.website,
      },
    })
    status.value = 'sent'
  } catch {
    status.value = 'error'
  }
}
</script>

<template>
  <form class="lead-form" novalidate @submit.prevent="submit">
    <h3 class="lead-form__title">{{ title }}</h3>

    <template v-if="status !== 'sent'">
      <input v-model="form.website" type="text" name="xf_2" autocomplete="one-time-code" class="hp-field" tabindex="-1" aria-hidden="true" />
      <div class="lead-form__field">
        <label>
          <span class="sr-only">Full name</span>
          <input v-model="form.fullName" type="text" name="fullName" placeholder="Full name *" :class="{ 'has-error': errors.fullName }" autocomplete="name" @input="clearError('fullName')" />
        </label>
        <p v-if="errors.fullName" class="lead-form__field-error">{{ errors.fullName }}</p>
      </div>

      <div class="lead-form__field">
        <label>
          <span class="sr-only">Work email</span>
          <input v-model="form.email" type="email" name="email" placeholder="Work email *" :class="{ 'has-error': errors.email }" autocomplete="email" @input="clearError('email')" />
        </label>
        <p v-if="errors.email" class="lead-form__field-error">{{ errors.email }}</p>
      </div>

      <div class="lead-form__field">
        <div class="lead-form__phone" :class="{ 'has-error': errors.phone }">
          <label class="lead-form__cc">
            <span class="sr-only">Country code</span>
            <select v-model="form.phoneCountry" aria-label="Phone country code">
              <option v-for="c in PHONE_COUNTRIES" :key="c.code" :value="c.code">
                {{ c.flag }} {{ c.dial }} {{ c.name }}
              </option>
            </select>
            <span class="lead-form__cc-display" aria-hidden="true">
              {{ selectedCountry.flag }}
              <svg class="lead-form__cc-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </span>
          </label>
          <label class="lead-form__phone-num">
            <span class="sr-only">Mobile number</span>
            <input v-model="form.phone" type="tel" name="phone" placeholder="Mobile number *" autocomplete="tel-national" @input="clearError('phone')" />
          </label>
        </div>
        <p v-if="errors.phone" class="lead-form__field-error">{{ errors.phone }}</p>
      </div>

      <Transition name="reveal">
        <div v-if="showAudience" class="lead-form__field">
          <fieldset class="lead-form__radio">
            <legend class="sr-only">What brings you here?</legend>
            <label><input v-model="form.audience" type="radio" value="employer" @change="clearError('audience')" /> I'm an employer / business</label>
            <label><input v-model="form.audience" type="radio" value="jobseeker" @change="clearError('audience')" /> I'm a job seeker</label>
          </fieldset>
          <p v-if="errors.audience" class="lead-form__field-error">{{ errors.audience }}</p>
        </div>
      </Transition>

      <Transition name="reveal">
        <div v-if="showDetails" class="lead-form__details">
          <div class="lead-form__field">
            <label>
              <span class="sr-only">Company name</span>
              <input v-model="form.company" type="text" name="company" placeholder="Company name *" :class="{ 'has-error': errors.company }" autocomplete="organization" @input="clearError('company')" />
            </label>
            <p v-if="errors.company" class="lead-form__field-error">{{ errors.company }}</p>
          </div>
          <div class="lead-form__field">
            <label>
              <span class="sr-only">Message</span>
              <textarea v-model="form.message" name="message" placeholder="Message *" rows="4" :class="{ 'has-error': errors.message }" @input="clearError('message')" />
            </label>
            <p v-if="errors.message" class="lead-form__field-error">{{ errors.message }}</p>
          </div>
        </div>
      </Transition>

      <button type="submit" class="lead-form__submit" :disabled="status === 'sending'">
        {{ status === 'sending' ? 'Sending…' : 'Get my free estimate' }}
      </button>
      <p v-if="status === 'error'" class="lead-form__error">
        Something went wrong — please try again or email
        <a href="mailto:enquiries@legendseor.com">enquiries@legendseor.com</a>.
      </p>
    </template>

    <p v-else class="lead-form__thanks">
      Thank you! Our team will be in touch within one business day.
    </p>
  </form>
</template>

<style scoped>
/* ===== User's Gravity Forms styling (forms 28/29/31), applied verbatim ===== */
.lead-form {
  --la-green: #014520;
  --la-green-glow: 1, 69, 32;
  --la-orange: #eb3d00;
  --la-border: #d9dcd8;
  --la-text: #16241c;
  --la-placeholder: #9aa09a;
  --la-radius: 8px;

  background: var(--white);
  border-radius: 18px;
  padding: clamp(24px, 3vw, 40px);
  box-shadow: 0 18px 42px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px; /* field spacing from the GF styling */
}
/* Centered serif title with the green accent line (la-heading) */
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
  background: var(--la-green);
  border-radius: 2px;
}
.lead-form input[type='text'],
.lead-form input[type='email'],
.lead-form input[type='tel'],
.lead-form textarea,
.lead-form select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--la-border);
  border-radius: var(--la-radius);
  font-family: var(--sans);
  font-size: 0.9rem;
  background: #ffffff;
  color: var(--la-text);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lead-form ::placeholder {
  color: var(--la-placeholder);
  opacity: 1;
}
.lead-form input:focus,
.lead-form textarea:focus,
.lead-form select:focus {
  outline: none;
  border-color: var(--la-green);
  box-shadow: 0 0 0 3px rgba(var(--la-green-glow), 0.15);
}

/* Phone: one bordered input with flag + chevron inside on the left */
.lead-form__phone {
  display: flex;
  align-items: center;
  border: 1px solid var(--la-border);
  border-radius: var(--la-radius);
  background: #ffffff;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lead-form__phone:focus-within {
  border-color: var(--la-green);
  box-shadow: 0 0 0 3px rgba(var(--la-green-glow), 0.15);
}
.lead-form__cc {
  position: relative;
  flex: none;
  font-family: "Twemoji Country Flags", var(--sans);
}
/* The real select is transparent on top; the display span shows flag + chevron */
.lead-form__cc select {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  font-family: "Twemoji Country Flags", var(--sans);
}
.lead-form__cc-display {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 4px 12px 16px;
  font-size: 1rem;
  white-space: nowrap;
  pointer-events: none;
}
.lead-form__cc-chev {
  width: 13px;
  height: 13px;
  color: var(--grey-mid);
}
.lead-form__phone-num { flex: 1; }
.lead-form__phone-num input {
  border: none !important;
  background: transparent;
  padding-left: 10px;
}
.lead-form__phone-num input:focus {
  outline: none;
  box-shadow: none; /* the wrapper carries the focus glow */
}

.lead-form__radio {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  font-size: 0.85rem;
}
.lead-form__radio label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  color: var(--la-text);
  font-weight: 400;
}
.lead-form__radio input { accent-color: var(--la-green); }

.lead-form__details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Submit — user's GF button: orange fill, green circle floods from center on hover */
.lead-form__submit {
  -webkit-appearance: none;
  appearance: none;
  display: inline-block;
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
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1),
              background-size 0.8s cubic-bezier(0.23, 1, 0.32, 1);
}
.lead-form__submit:hover:not(:disabled) {
  border-radius: 12px;
  box-shadow: 0 0 0 12px transparent;
  background-size: 560px 560px, 100% 100%;
}
.lead-form__submit:active:not(:disabled) {
  scale: 0.95;
}
.lead-form__submit:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.lead-form__error {
  color: #b42318; /* GF field-level validation color */
  font-size: 0.85rem;
  margin: 0;
}

/* Field wrapper + per-field validation messages (GF style) */
.lead-form__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lead-form__field-error {
  color: #b42318;
  font-size: 0.8rem;
  margin: 0;
}
.lead-form input.has-error,
.lead-form textarea.has-error,
.lead-form .lead-form__phone.has-error {
  border-color: #b42318;
}
.lead-form__thanks {
  font-size: 1rem;
  color: var(--green);
  margin: 0;
}

/* Conditional reveal animation */
.reveal-enter-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.reveal-enter-from { opacity: 0; transform: translateY(-6px); }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  overflow: hidden;
  white-space: nowrap;
}
</style>
