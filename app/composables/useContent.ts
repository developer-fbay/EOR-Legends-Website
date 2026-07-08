/**
 * Published-content fetchers for the public site.
 * Backed by headless WordPress via the cached /api/content endpoints
 * (blogs, news articles, case studies, HR glossary). Content types without a
 * WP counterpart (guides, problem pillars/clusters, tools) return empty lists
 * until they get a home — the pages show their empty states.
 */
export type ContentRow = {
  id: string | number
  title: string
  slug: string
  body: string | null
  excerpt: string | null
  featured_image: string | null
  status: string
  meta_title: string | null
  meta_description: string | null
  noindex: boolean
  published_at: string | null
  [key: string]: any
}

export function useContentList(table: string, opts?: { limit?: number; orderBy?: string }) {
  return useAsyncData(`${table}-list-${opts?.limit ?? 'all'}-${opts?.orderBy ?? 'date'}`, async () => {
    const rows = await $fetch<ContentRow[]>(`/api/content/${table}`, {
      query: opts?.orderBy ? { orderBy: opts.orderBy } : undefined,
    }).catch(() => [] as ContentRow[])
    return opts?.limit ? rows.slice(0, opts.limit) : rows
  })
}

export function useContentBySlug(table: string, slug: string) {
  return useAsyncData(`${table}-${slug}`, async () => {
    return await $fetch<ContentRow>(`/api/content/${table}/${slug}`).catch(() => null)
  })
}

/** Apply CMS SEO fields (meta title/description, noindex) to the page head. */
export function useContentSeo(row: Ref<ContentRow | null | undefined>) {
  watchEffect(() => {
    const r = row.value
    if (!r) return
    usePageSeo({
      title: r.meta_title || r.title,
      description: r.meta_description || r.excerpt || undefined,
      robots: r.noindex ? 'noindex, nofollow' : undefined,
      ogType: 'article',
      ...(r.featured_image ? { ogImage: r.featured_image } : {}),
    })
  })
}
