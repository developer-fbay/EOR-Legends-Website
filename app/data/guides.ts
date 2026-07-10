/** Downloadable guides (lead magnets). Gated behind Gravity Form 30. */
export type Guide = {
  slug: string
  title: string
  excerpt: string
  intro: string
  pdfUrl: string
  author: string
}

export const GUIDES: Guide[] = [
  {
    slug: 'the-greatest-hire-in-south-africa',
    title: 'The Greatest Hire in South Africa',
    excerpt:
      'Your complete guide to recruitment and Employer of Record services in South Africa. Download it free.',
    intro:
      'Everything you need to make your first (or next) South African hire a success: recruitment, Employer of Record services, compliance, and the true costs, all in one practical guide.',
    pdfUrl:
      'https://legendseor.com/wp-content/uploads/2026/02/Guide-to-recruitment-and-Employer-of-Record-services-in-South-Africa-1.pdf-2.pdf',
    author: 'Codi Kader',
  },
]

export function getGuide(slug: string) {
  return GUIDES.find((g) => g.slug === slug)
}
