<script setup lang="ts">
import { CMS_TYPES } from '~/composables/useCmsTypes'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const typeKey = computed(() => String(route.params.type))
const cmsType = computed(() => CMS_TYPES[typeKey.value])
const isNew = computed(() => route.params.id === 'new')

if (!cmsType.value) {
  throw createError({ statusCode: 404, statusMessage: 'Unknown content type' })
}

const supabase = useSupabaseClient()
const configured = useCmsConfigured()

const record = reactive<Record<string, any>>({
  title: '',
  slug: '',
  body: '',
  excerpt: '',
  featured_image: '',
  status: 'draft',
  meta_title: '',
  meta_description: '',
  noindex: false,
})
for (const f of cmsType.value.extra ?? []) {
  record[f.key] = f.type === 'number' ? 0 : ''
}

const slugTouched = ref(false)
const saving = ref(false)
const message = ref('')
const errorMsg = ref('')
const uploading = ref<string | null>(null)

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(() => record.title, (t) => {
  if (isNew.value && !slugTouched.value) record.slug = slugify(t)
})

onMounted(async () => {
  if (!configured.value || isNew.value) return
  const { data, error } = await supabase
    .from(cmsType.value!.table)
    .select('*')
    .eq('id', route.params.id)
    .single()
  if (error || !data) {
    errorMsg.value = 'Could not load this item.'
    return
  }
  Object.assign(record, data)
  slugTouched.value = true
})

async function uploadImage(field: string, e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = field
  const path = `${cmsType.value!.table}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
  const { error } = await supabase.storage.from('media').upload(path, file)
  if (!error) {
    const { data } = supabase.storage.from('media').getPublicUrl(path)
    record[field] = data.publicUrl
  } else {
    errorMsg.value = `Upload failed: ${error.message}`
  }
  uploading.value = null
}

async function save(publish?: boolean) {
  if (!record.title || !record.slug) {
    errorMsg.value = 'Title and slug are required.'
    return
  }
  saving.value = true
  errorMsg.value = ''
  message.value = ''

  if (publish !== undefined) record.status = publish ? 'published' : 'draft'
  if (record.status === 'published' && !record.published_at) {
    record.published_at = new Date().toISOString()
  }

  const payload: Record<string, any> = { ...record }
  delete payload.id
  delete payload.created_at
  delete payload.updated_at

  if (isNew.value) {
    const { data, error } = await supabase
      .from(cmsType.value!.table)
      .insert(payload)
      .select('id')
      .single()
    saving.value = false
    if (error) { errorMsg.value = error.message; return }
    message.value = 'Created.'
    navigateTo(`/admin/${typeKey.value}/${data.id}`)
  } else {
    const { error } = await supabase
      .from(cmsType.value!.table)
      .update(payload)
      .eq('id', route.params.id)
    saving.value = false
    if (error) { errorMsg.value = error.message; return }
    message.value = 'Saved.'
  }
}
</script>

<template>
  <div>
    <div class="edit-head">
      <div>
        <NuxtLink :to="`/admin/${typeKey}`" class="edit-back">← {{ cmsType?.label }}</NuxtLink>
        <h1 class="admin-title">{{ isNew ? `New ${cmsType?.label.replace(/s$/, '')}` : record.title || 'Edit' }}</h1>
      </div>
      <div class="edit-actions">
        <span v-if="message" class="edit-saved">{{ message }}</span>
        <button class="btn-secondary" :disabled="saving" @click="save(false)">Save draft</button>
        <button class="brand-btn brand-btn--orange" :disabled="saving" @click="save(true)">
          {{ record.status === 'published' ? 'Update' : 'Publish' }}
        </button>
      </div>
    </div>

    <p v-if="!configured" class="admin-note">Connect Supabase to edit content (see Dashboard).</p>
    <p v-if="errorMsg" class="edit-error">{{ errorMsg }}</p>

    <div class="edit-grid">
      <!-- Main column -->
      <div class="edit-main">
        <label class="field">
          <span>Title *</span>
          <input v-model="record.title" type="text" />
        </label>

        <label class="field">
          <span>Excerpt</span>
          <textarea v-model="record.excerpt" rows="2" />
        </label>

        <div class="field">
          <span>Body</span>
          <ClientOnly>
            <UiRichTextEditor v-model="record.body" />
          </ClientOnly>
        </div>

        <div v-for="f in cmsType?.extra" :key="f.key" class="field">
          <span>{{ f.label }}</span>
          <template v-if="f.type === 'image'">
            <input type="file" accept="image/*" @change="uploadImage(f.key, $event)" />
            <img v-if="record[f.key]" :src="record[f.key]" class="field-preview" alt="" />
            <small v-if="uploading === f.key">Uploading…</small>
          </template>
          <input v-else-if="f.type === 'number'" v-model.number="record[f.key]" type="number" />
          <input v-else v-model="record[f.key]" type="text" />
        </div>
      </div>

      <!-- SEO / settings sidebar -->
      <aside class="edit-side">
        <section class="side-card">
          <h3>Status</h3>
          <label class="field">
            <span>Status</span>
            <select v-model="record.status">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <label class="field">
            <span>Featured image</span>
            <input type="file" accept="image/*" @change="uploadImage('featured_image', $event)" />
            <img v-if="record.featured_image" :src="record.featured_image" class="field-preview" alt="" />
            <small v-if="uploading === 'featured_image'">Uploading…</small>
          </label>
        </section>

        <section class="side-card">
          <h3>SEO</h3>
          <label class="field">
            <span>URL slug *</span>
            <input v-model="record.slug" type="text" @input="slugTouched = true" />
            <small class="slug-preview">{{ cmsType?.publicPath }}/{{ record.slug || '…' }}</small>
          </label>
          <label class="field">
            <span>Meta title</span>
            <input v-model="record.meta_title" type="text" maxlength="70" />
            <small>{{ (record.meta_title || '').length }}/70</small>
          </label>
          <label class="field">
            <span>Meta description</span>
            <textarea v-model="record.meta_description" rows="3" maxlength="170" />
            <small>{{ (record.meta_description || '').length }}/170</small>
          </label>
          <label class="field field-check">
            <input v-model="record.noindex" type="checkbox" />
            <span>Hide from search engines (noindex)</span>
          </label>
        </section>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.edit-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.edit-back {
  color: var(--grey-mid);
  font-size: 0.82rem;
  text-decoration: none;
}
.edit-back:hover { color: var(--green); }
.admin-title { font-family: var(--serif); font-size: 1.6rem; margin: 4px 0 0; }
.edit-actions { display: flex; align-items: center; gap: 12px; }
.edit-saved { color: var(--green); font-size: 0.85rem; }
.btn-secondary {
  padding: 10px 22px;
  border-radius: 999px;
  border: 1.5px solid var(--green);
  background: none;
  color: var(--green);
  font-family: var(--sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary:hover { background: rgba(1, 69, 32, 0.06); }
.edit-error { color: var(--accent); }
.admin-note { color: var(--grey-mid); }

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  align-items: start;
}
.edit-main {
  background: var(--white);
  border-radius: 14px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.edit-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 20px;
}
.side-card {
  background: var(--white);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.side-card h3 {
  font-family: var(--sans);
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0;
  color: var(--green);
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
}
.field input[type='text'],
.field input[type='number'],
.field textarea,
.field select {
  padding: 10px 12px;
  border: 1px solid #e2ded4;
  border-radius: 9px;
  font-family: var(--sans);
  font-size: 0.9rem;
  background: var(--grey-light);
}
.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  border-color: var(--green);
  background: var(--white);
}
.field small { color: var(--grey-mid); font-weight: 400; }
.slug-preview { color: var(--green) !important; }
.field-check {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.field-check input { accent-color: var(--accent); }
.field-preview {
  max-height: 120px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
  align-self: flex-start;
}

@media (max-width: 1000px) {
  .edit-grid { grid-template-columns: 1fr; }
  .edit-side { position: static; }
}
</style>
