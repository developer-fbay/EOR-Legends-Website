<script setup lang="ts">
// Icon paths taken verbatim from the user's navbar dropdown code block.
defineProps<{ name: string }>()

const icons: Record<string, string> = {
  hr: '<circle cx="9" cy="7" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4a3.5 3.5 0 0 1 0 6.9"/><path d="M21.5 20a6.5 6.5 0 0 0-5-6.3"/>',
  payroll: '<rect x="2.5" y="6.5" width="19" height="11" rx="2"/><circle cx="12" cy="12" r="2.3"/><path d="M6 12h.01M18 12h.01"/>',
  benefits: '<path d="M12 20.5 4.2 13a4.6 4.6 0 0 1 6.5-6.5l1.3 1.3 1.3-1.3A4.6 4.6 0 0 1 19.8 13Z"/>',
  culture: '<path d="M12 2.5 14.6 9 21 9.6 16 14l1.6 6.8L12 17.5 6.4 20.8 8 14 3 9.6 9.4 9Z"/>',
  contractor: '<rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/><path d="m9.5 14 2 2 3.5-3.5"/>',
  migration: '<path d="M7.5 4 4 7.5 7.5 11"/><path d="M4 7.5h15"/><path d="m16.5 13 3.5 3.5L16.5 20"/><path d="M20 16.5H5"/>',
  onboarding: '<circle cx="9" cy="7" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 12.5-2.4"/><path d="M19 8v6M22 11h-6"/>',
  office: '<rect x="4" y="2.5" width="16" height="19" rx="1.5"/><path d="M9.5 21.5v-4h5v4"/><path d="M8 6.5h.01M16 6.5h.01M8 10h.01M16 10h.01M8 13.5h.01M16 13.5h.01"/>',
  itsupport: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.4"/><path d="m5.6 5.6 3.4 3.4M15 15l3.4 3.4M18.4 5.6 15 9M9 15l-3.4 3.4"/>',
  itequipment: '<rect x="4" y="5" width="16" height="10" rx="1.5"/><path d="M2.5 18.5h19l-1-2.5H3.5Z"/>',
  pillar1: '<path d="M9.5 18h5"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.6.5 1.1 1.3 1.2 2.1l.1.3h5l.1-.3c.1-.8.6-1.6 1.2-2.1A6 6 0 0 0 12 3Z"/>',
  pillar2: '<path d="m3.5 16.5 5.5-5.5 3.5 3.5 8-8"/><path d="M16 6.5h4.5V11"/>',
  pillar3: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.4"/>',
  pillar4: '<path d="M3.5 3.5v17h17"/><path d="M8 17v-5M12.5 17V8M17 17v-3"/>',
  pillar5: '<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2.2 4.8L8.5 15.5l2.2-4.8Z"/>',
  about: '<circle cx="12" cy="12" r="8.5"/><path d="M12 16.5V11M12 8h.01"/>',
  blogs: '<path d="M12.5 19.5H21"/><path d="M16.8 4.2a2 2 0 0 1 2.9 2.9L7.5 19.3l-3.8 1 1-3.8Z"/>',
  news: '<path d="M19 19.5H6A2.5 2.5 0 0 1 3.5 17V5.5a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1V17a2.5 2.5 0 0 0 5 0V9.5h-3"/><path d="M7 8h6M7 11.5h6M7 15h4"/>',
  glossary: '<path d="M12 7.5v12"/><path d="M12 7.5C10.5 6.3 8.6 5.5 6.5 5.5H4a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h2.5c2.1 0 4 .8 5.5 2"/><path d="M12 7.5c1.5-1.2 3.4-2 5.5-2H20a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5h-2.5c-2.1 0-4 .8-5.5 2"/>',
  calc: '<rect x="4.5" y="2.5" width="15" height="19" rx="2"/><path d="M8 6.5h8"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
  leadmagnet: '<path d="M20.5 15.5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19v-3.5"/><path d="m7.5 10.5 4.5 4.5 4.5-4.5"/><path d="M12 15V3.5"/>',
}
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="icons[name] || icons.about" />
</template>
