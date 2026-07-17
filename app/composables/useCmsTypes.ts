/**
 * CMS content-type registry — drives the admin's nav, list and edit screens.
 * `extra` fields render as additional inputs on the edit screen.
 */
export type CmsField = {
  key: string
  label: string
  type?: 'text' | 'number' | 'image'
}

export type CmsType = {
  label: string
  table: string
  /** public route prefix used for "view" links, e.g. /blog */
  publicPath: string
  extra?: CmsField[]
}

export const CMS_TYPES: Record<string, CmsType> = {
  'blogs': {
    label: 'Blogs',
    table: 'blogs',
    publicPath: '/blog',
  },
  'news-articles': {
    label: 'News Articles',
    table: 'news_articles',
    publicPath: '/news',
  },
  'case-studies': {
    label: 'Case Studies',
    table: 'case_studies',
    publicPath: '/case-studies',
    extra: [
      { key: 'client', label: 'Client name' },
      { key: 'cost_reduction', label: 'Cost reduction (e.g. 47%)' },
      { key: 'team_location', label: 'Team location' },
      { key: 'logo_image', label: 'Client logo', type: 'image' },
    ],
  },
  'services': {
    label: 'Services',
    table: 'services',
    publicPath: '/services',
    extra: [
      { key: 'icon', label: 'Icon name' },
      { key: 'sort_order', label: 'Sort order', type: 'number' },
    ],
  },
  'hr-glossary': {
    label: 'HR Glossary',
    table: 'hr_glossary',
    publicPath: '/hr-glossary',
    extra: [{ key: 'letter', label: 'A–Z letter' }],
  },
  'problem-pillars': {
    label: 'Problem Pillars',
    table: 'problem_pillars',
    publicPath: '/staffing-insights',
    extra: [{ key: 'sort_order', label: 'Sort order', type: 'number' }],
  },
  'problem-clusters': {
    label: 'Problem Clusters',
    table: 'problem_clusters',
    publicPath: '/staffing-insights',
    extra: [{ key: 'pillar_id', label: 'Pillar ID (uuid)' }],
  },
}

/** The content types grouped under the CMS "Resources" tab. */
export const RESOURCE_TYPE_KEYS = [
  'blogs',
  'news-articles',
  'case-studies',
  'hr-glossary',
  'problem-pillars',
  'problem-clusters',
] as const

export function useCmsConfigured() {
  const config = useRuntimeConfig()
  // Placeholder URL means the user hasn't connected their Supabase project yet.
  return computed(() => !String(config.public.supabase?.url || '').includes('placeholder'))
}
