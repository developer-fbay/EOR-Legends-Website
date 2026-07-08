/**
 * Staffing Insights (problem pillars + clusters). Titles and intros are
 * transcribed from the WP draft pages; the full data-heavy bodies (salary
 * tables, NI calculations) will be extracted 1:1 once the WP pages are
 * published — financial figures are not transcribed from screenshots.
 */
export type Cluster = {
  slug: string
  title: string
  intro: string[]
}

export type Pillar = {
  slug: string
  title: string
  excerpt: string
  intro: string[]
  bullets?: string[]
  clusters: Cluster[]
}

export const PILLARS: Pillar[] = [
  {
    slug: 'true-cost-of-an-employee-in-the-uk',
    title: 'The True Cost of an Employee in the UK 2026',
    excerpt:
      'The true cost of an employee in the UK is roughly 35% to 45% more than their salary. See the full cost stack — NI, pension, recruitment, statutory leave, turnover and overhead.',
    intro: [
      'The true cost of an employee in the UK is roughly 35% to 45% more than their salary.',
      'For a £30,000 hire, that means a realistic all-in cost of around £41,000 to £47,000 in the first year, once employer National Insurance, pension, recruitment, statutory leave, turnover risk and overhead are counted. The gap has widened since the April 2025 NI rise and is set to keep rising as the £5,000 threshold stays frozen to 2031.',
    ],
    bullets: [
      'Mandatory on-costs add a tight 14–16%: employer NI (15% above £5,000) plus the 3% minimum pension.',
      'Indirect costs add another 20–30%: recruitment, onboarding, equipment, overhead and management time.',
      'Turnover is the hidden multiplier — an inflation-adjusted ~£42,000 per leaver, budgeted across the team.',
      'The £30k example, fully loaded (with amortised turnover and full overhead) reaches the upper end, ~£47k.',
      'The lever most cost-stressed SMEs are pulling: basing some roles in a lower-cost market, cutting per-role cost 40–60%.',
    ],
    clusters: [
      {
        slug: 'employee-on-costs',
        title: 'The Cost of Employing Someone in the UK: Employee On-Costs in 2025/26',
        intro: [
          "A UK employee's real cost is well above their salary. In 2025/26, mandatory on-costs add roughly 15% to 18% before you spend anything on recruitment or equipment.",
          'The cost of employing someone in the UK is never just their salary. Once you add the two costs the law requires of every employer, employer National Insurance contributions and a minimum pension contribution, a typical hire costs roughly 15% to 18% more than the figure on their contract.',
        ],
      },
    ],
  },
  {
    slug: 'permanent-establishment-guide',
    title: 'Permanent Establishment: A 2026 Guide for UK Businesses Hiring Abroad',
    excerpt:
      'Permanent establishment is the tax threshold at which a UK business becomes liable for corporation tax in another country. What triggers it, and how different hiring routes position your business.',
    intro: [
      "Permanent establishment is the tax threshold at which a UK business becomes liable for corporation tax in another country. It's triggered most commonly through a fixed place of business abroad or a dependent agent acting on your behalf. Once crossed, the consequences are real and expensive: local corporation tax on profits, transfer pricing documentation obligations, statutory registrations, and potential branch taxes under some treaties.",
      'For most UK SMEs hiring people abroad through standard commercial arrangements like Employers of Record, the permanent establishment risk is low and structurally well-managed. For businesses engaging international contractors directly, particularly in sales or business development roles, the risk is worth assessing before scaling.',
    ],
    clusters: [
      {
        slug: 'problem-2-cluster-1',
        // display title comes from the published page's h1 at render time
        title: 'Permanent Establishment: Deep Dive',
        intro: [],
      },
    ],
  },
]

export function getPillar(slug: string) {
  return PILLARS.find((p) => p.slug === slug)
}
