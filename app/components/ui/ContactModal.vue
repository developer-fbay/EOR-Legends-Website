<script setup lang="ts">
// Contact popup (Gravity Form 31) — opened from the header's "Contact us" button
// via the shared `contact-modal` state. Rendered once in the default layout.
const open = useState('contact-modal', () => false)

function close() {
  open.value = false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

watch(open, (v) => {
  if (import.meta.client) document.body.style.overflow = v ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="cm-backdrop" @click.self="close">
        <div class="cm-dialog" role="dialog" aria-modal="true" aria-label="Contact us">
          <button class="cm-close" aria-label="Close" @click="close">×</button>
          <UiLeadForm :gf-form-id="31" source="popup" title="Ready to build your South African team?" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 5000;
  background: rgba(1, 30, 15, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
}
.cm-dialog {
  position: relative;
  width: min(100%, 460px);
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  border-radius: 18px;
}
.cm-close {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 1;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: var(--grey-light);
  color: var(--body);
  font-size: 1.3rem;
  line-height: 1;
  cursor: pointer;
}
.cm-close:hover { background: var(--accent); color: #fff; }

/* keep the form heading clear of the absolute-positioned close button */
.cm-dialog :deep(.lead-form__title) { padding-inline: 36px; }

.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-active .cm-dialog { transition: transform 0.22s ease; }
.modal-enter-from .cm-dialog { transform: translateY(14px); }
</style>
