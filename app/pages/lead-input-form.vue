<script setup lang="ts">
/**
 * New Lead Input Form — internal sales tool. Submits to Gravity Form 24,
 * which forwards to Zapier → Close CRM on the WordPress side.
 * Not linked from any navigation; direct URL only.
 */
usePageSeo({ title: 'New Lead Input Form', robots: 'noindex, nofollow' })

const LEAD_OWNERS = ['Anthony Kettle', 'Dylan Fisher', 'Ned Barker', 'Olivia Pienaar', 'Jaron Visagie', 'Abby van Wyk', 'Joe Rutherford', 'Matthew Samaai', 'Jesse Klaff', 'Jayden Lowe', 'Gabriella Sander', 'Julia De Vos', 'Aidan Bonser']
const COUNTRIES = ['Australia', 'Austria', 'Belgium', 'Brazil', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'France', 'Germany', 'Ghana', 'Hong Kong', 'Ireland', 'Italy', 'Netherlands', 'New Zealand', 'Nigeria', 'Pakistan', 'Poland', 'Serbia', 'Saudi Arabia', 'Singapore', 'South Africa', 'Spain', 'Switzerland', 'Tanzania', 'Turkey', 'UAE', 'Uganda', 'UK', 'Ukraine', 'USA', 'Vietnam']
const LEAD_SOURCES = ['Network Platforms', 'Inbound Call/Enquiry', 'Client Referral', 'Partner Referral', 'Self-Generated - LinkedIn', 'Other Social Media', 'Recruiter Outreach', 'Self Generated']

// Gravity Form 24 field IDs
const F = { owner: 18, company: 21, country: 19, firstName: 3, lastName: 5, jobTitle: 6, email: 7, phone: 8, phone2: 23, city: 10, postCode: 11, sector: 13, source: 15, referral: 22, notes: 16 }

const form = reactive({
  owner: '', company: '', country: '', firstName: '', lastName: '', jobTitle: '',
  email: '', phone: '', phone2: '', city: '', postCode: '', sector: '', source: '', referral: '', notes: '',
  website: '', // honeypot
})

const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errors = reactive<Record<string, string>>({})
const showReferral = computed(() => /referral/i.test(form.source))

function validate() {
  Object.keys(errors).forEach((k) => delete errors[k])
  const REQUIRED = 'This field is required.'
  if (!form.owner) errors.owner = REQUIRED
  if (!form.company.trim()) errors.company = REQUIRED
  if (!form.country) errors.country = REQUIRED
  if (!form.firstName.trim()) errors.firstName = REQUIRED
  if (!form.lastName.trim()) errors.lastName = REQUIRED
  if (!form.jobTitle.trim()) errors.jobTitle = REQUIRED
  if (!form.email.trim()) errors.email = REQUIRED
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) errors.email = 'The email address entered is invalid.'
  if (!form.source) errors.source = REQUIRED
  return Object.keys(errors).length === 0
}

async function submit() {
  if (!validate()) return
  status.value = 'sending'
  try {
    const res: any = await $fetch('/api/gf-submit', {
      method: 'POST',
      body: {
        formId: 24,
        website: form.website,
        values: {
          [F.owner]: form.owner,
          [F.company]: form.company,
          [F.country]: form.country,
          [F.firstName]: form.firstName,
          [F.lastName]: form.lastName,
          [F.jobTitle]: form.jobTitle,
          [F.email]: form.email,
          [F.phone]: form.phone,
          [F.phone2]: form.phone2,
          [F.city]: form.city,
          [F.postCode]: form.postCode,
          [F.sector]: form.sector,
          [F.source]: form.source,
          [F.referral]: showReferral.value ? form.referral : '',
          [F.notes]: form.notes,
        },
      },
    })
    if (res.ok) {
      status.value = 'sent'
    } else {
      status.value = 'idle'
      const map: Record<string, string> = Object.fromEntries(Object.entries(F).map(([k, v]) => [String(v), k]))
      Object.entries(res.validation || {}).forEach(([id, msg]) => {
        if (map[id]) errors[map[id]!] = String(msg)
      })
    }
  } catch {
    status.value = 'error'
  }
}

function resetForm() {
  Object.keys(form).forEach((k) => ((form as any)[k] = ''))
  status.value = 'idle'
}
</script>

<template>
  <main class="lif band-cream section">
    <div class="container">
      <h1 class="lif-title">New Lead Input Form</h1>

      <form v-if="status !== 'sent'" class="lif-card" novalidate @submit.prevent="submit">
        <input v-model="form.website" type="text" name="xf_2" autocomplete="one-time-code" class="hp-field" tabindex="-1" aria-hidden="true" />
        <div class="lif-field">
          <label>Lead Owner / Your Name<span class="req">*</span></label>
          <select v-model="form.owner" :class="{ 'has-error': errors.owner }" @change="delete errors.owner">
            <option value="">Please Select</option>
            <option v-for="o in LEAD_OWNERS" :key="o" :value="o">{{ o }}</option>
          </select>
          <p v-if="errors.owner" class="lif-error">{{ errors.owner }}</p>
        </div>

        <div class="lif-row">
          <div class="lif-field">
            <label>What is the client company name?<span class="req">*</span></label>
            <input v-model="form.company" type="text" :class="{ 'has-error': errors.company }" @input="delete errors.company" />
            <p v-if="errors.company" class="lif-error">{{ errors.company }}</p>
          </div>
          <div class="lif-field">
            <label>What country is the client based in?<span class="req">*</span></label>
            <select v-model="form.country" :class="{ 'has-error': errors.country }" @change="delete errors.country">
              <option value="">Please Select</option>
              <option v-for="c in COUNTRIES" :key="c" :value="c">{{ c }}</option>
            </select>
            <p v-if="errors.country" class="lif-error">{{ errors.country }}</p>
          </div>
        </div>

        <div class="lif-row">
          <div class="lif-field">
            <label>First Name<span class="req">*</span></label>
            <input v-model="form.firstName" type="text" :class="{ 'has-error': errors.firstName }" @input="delete errors.firstName" />
            <p v-if="errors.firstName" class="lif-error">{{ errors.firstName }}</p>
          </div>
          <div class="lif-field">
            <label>Last Name<span class="req">*</span></label>
            <input v-model="form.lastName" type="text" :class="{ 'has-error': errors.lastName }" @input="delete errors.lastName" />
            <p v-if="errors.lastName" class="lif-error">{{ errors.lastName }}</p>
          </div>
        </div>

        <div class="lif-row">
          <div class="lif-field">
            <label>What is the job title of the main contact?<span class="req">*</span></label>
            <input v-model="form.jobTitle" type="text" :class="{ 'has-error': errors.jobTitle }" @input="delete errors.jobTitle" />
            <p v-if="errors.jobTitle" class="lif-error">{{ errors.jobTitle }}</p>
          </div>
          <div class="lif-field">
            <label>What is the email address of the main contact?<span class="req">*</span></label>
            <input v-model="form.email" type="email" :class="{ 'has-error': errors.email }" @input="delete errors.email" />
            <p v-if="errors.email" class="lif-error">{{ errors.email }}</p>
          </div>
        </div>

        <div class="lif-field">
          <label>What is the phone number of the main contact? (MUST PUT COUNTRY CODE (eg +27 for SA, +44 for UK +1 for USA). Please enter one phone number only.</label>
          <input v-model="form.phone" type="tel" />
        </div>

        <div class="lif-field">
          <label>Any additional phone number? (MUST PUT COUNTRY CODE (eg +27 for SA, +44 for UK +1 for USA). Please enter one phone number only.</label>
          <input v-model="form.phone2" type="tel" />
        </div>

        <div class="lif-row">
          <div class="lif-field">
            <label>City</label>
            <input v-model="form.city" type="text" />
          </div>
          <div class="lif-field">
            <label>Post Code</label>
            <input v-model="form.postCode" type="text" />
          </div>
        </div>

        <div class="lif-field">
          <label>Client Sector</label>
          <input v-model="form.sector" type="text" />
        </div>

        <div class="lif-field lif-field--half">
          <label>Where did you get this lead?<span class="req">*</span></label>
          <select v-model="form.source" :class="{ 'has-error': errors.source }" @change="delete errors.source">
            <option value="">Please Select</option>
            <option v-for="s in LEAD_SOURCES" :key="s" :value="s">{{ s }}</option>
          </select>
          <p v-if="errors.source" class="lif-error">{{ errors.source }}</p>
        </div>

        <div v-if="showReferral" class="lif-field">
          <label>If it was a referral, where from? Partner / Client Name</label>
          <input v-model="form.referral" type="text" />
        </div>

        <div class="lif-field">
          <label>Notes</label>
          <textarea v-model="form.notes" rows="6" />
        </div>

        <button type="submit" class="lif-submit" :disabled="status === 'sending'">
          {{ status === 'sending' ? 'Submitting…' : 'Submit' }}
        </button>
        <p v-if="status === 'error'" class="lif-error">Something went wrong. Please try again.</p>
      </form>

      <div v-else class="lif-card lif-done">
        <h2>Lead submitted ✓</h2>
        <p>The lead is on its way to Close CRM via Gravity Forms and Zapier.</p>
        <button type="button" class="lif-submit" style="max-width: 320px" @click="resetForm">Add another lead</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
.lif-title {
  text-align: center;
  margin-bottom: clamp(1.5rem, 4vh, 2.5rem);
}
.lif-card {
  background: #fffcf6;
  border: 1px solid #ece9e2;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  padding: clamp(24px, 4vw, 56px);
  max-width: 1280px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.lif-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.lif-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lif-field--half { max-width: calc(50% - 10px); }
.lif-field label {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--green);
}
.req { color: var(--accent); margin-left: 2px; }
.lif-field input,
.lif-field select,
.lif-field textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d9dcd8;
  border-radius: 8px;
  font-family: var(--sans);
  font-size: 0.92rem;
  background: #fff;
  color: #16241c;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.lif-field input:focus,
.lif-field select:focus,
.lif-field textarea:focus {
  outline: none;
  border-color: var(--green);
  box-shadow: 0 0 0 3px rgba(1, 69, 32, 0.15);
}
.lif-field .has-error { border-color: #b42318; }
.lif-error { color: #b42318; font-size: 0.8rem; margin: 0; }

.lif-submit {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  padding: 14px 30px;
  border: 3px solid transparent;
  font-family: var(--sans);
  font-size: 15px;
  font-weight: 600;
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
.lif-submit:hover:not(:disabled) {
  border-radius: 12px;
  background-size: 1400px 1400px, 100% 100%;
}
.lif-submit:disabled { opacity: 0.55; cursor: not-allowed; }
.lif-done { text-align: center; align-items: center; }
.lif-done h2 { color: var(--green); }

@media (max-width: 760px) {
  .lif-row { grid-template-columns: 1fr; }
  .lif-field--half { max-width: 100%; }
}
</style>
