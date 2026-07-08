<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [StarterKit],
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
})

watch(
  () => props.modelValue,
  (v) => {
    if (editor.value && v !== editor.value.getHTML()) {
      editor.value.commands.setContent(v || '', { emitUpdate: false })
    }
  },
)

onBeforeUnmount(() => editor.value?.destroy())

const buttons = computed(() => {
  const e = editor.value
  if (!e) return []
  return [
    { label: 'B', title: 'Bold', active: e.isActive('bold'), run: () => e.chain().focus().toggleBold().run() },
    { label: 'I', title: 'Italic', active: e.isActive('italic'), run: () => e.chain().focus().toggleItalic().run() },
    { label: 'H2', title: 'Heading 2', active: e.isActive('heading', { level: 2 }), run: () => e.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: 'H3', title: 'Heading 3', active: e.isActive('heading', { level: 3 }), run: () => e.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: '••', title: 'Bullet list', active: e.isActive('bulletList'), run: () => e.chain().focus().toggleBulletList().run() },
    { label: '1.', title: 'Numbered list', active: e.isActive('orderedList'), run: () => e.chain().focus().toggleOrderedList().run() },
    { label: '“”', title: 'Quote', active: e.isActive('blockquote'), run: () => e.chain().focus().toggleBlockquote().run() },
    { label: '—', title: 'Divider', active: false, run: () => e.chain().focus().setHorizontalRule().run() },
  ]
})
</script>

<template>
  <div class="rte">
    <div v-if="editor" class="rte-toolbar">
      <button
        v-for="b in buttons"
        :key="b.title"
        type="button"
        :title="b.title"
        :class="{ active: b.active }"
        @click="b.run"
      >{{ b.label }}</button>
    </div>
    <EditorContent :editor="editor" class="rte-content" />
  </div>
</template>

<style scoped>
.rte {
  border: 1px solid #e2ded4;
  border-radius: 10px;
  background: var(--white);
  overflow: hidden;
}
.rte-toolbar {
  display: flex;
  gap: 2px;
  padding: 6px;
  border-bottom: 1px solid #eee9df;
  flex-wrap: wrap;
}
.rte-toolbar button {
  min-width: 32px;
  height: 30px;
  padding: 0 8px;
  border: none;
  background: none;
  border-radius: 6px;
  font-family: var(--sans);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--grey-text);
}
.rte-toolbar button:hover { background: var(--grey-light); }
.rte-toolbar button.active { background: var(--green); color: var(--cream); }
.rte-content :deep(.tiptap) {
  min-height: 280px;
  padding: 14px 16px;
  outline: none;
  font-size: 0.95rem;
  line-height: 1.7;
}
.rte-content :deep(h2),
.rte-content :deep(h3) { font-family: var(--serif); }
</style>
