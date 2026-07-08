/**
 * Drop-in wrapper around useSeoMeta that mirrors title/description into
 * Open Graph and Twitter card tags so every page gets complete social meta.
 */
export function usePageSeo(input: Record<string, any>) {
  useSeoMeta({
    ...input,
    ogTitle: input.ogTitle ?? input.title,
    ogDescription: input.ogDescription ?? input.description,
    twitterTitle: input.twitterTitle ?? input.title,
    twitterDescription: input.twitterDescription ?? input.description,
  } as any)
}
