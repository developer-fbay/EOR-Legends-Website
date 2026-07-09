/**
 * Service page content. Payroll's copy is transcribed verbatim from the WP
 * screenshots; other services carry their sv-scroll descriptions as intros and
 * provisional overview/FAQ copy in the same house style — all of it becomes
 * CMS-editable once services are managed in Supabase.
 */
export type ServiceContent = {
  slug: string
  title: string
  nav: string
  excerpt: string
  intro: string[]
  overview: {
    title: string
    paragraphs: string[]
    image: string
  }[]
  steps: { title: string; text: string }[]
  faqs: { q: string; a: string }[]
}


export const SERVICES: ServiceContent[] = [
  {
    slug: 'payroll',
    title: 'Payroll',
    nav: 'Payroll',
    excerpt:
      'We take responsibility for processing accurate payroll, meeting statutory obligations, and maintaining compliance.',
    intro: [
      'We take responsibility for processing accurate payroll, meeting statutory obligations, and maintaining compliance.',
    ],
    overview: [
      {
        title: 'How payroll works through our EOR service',
        paragraphs: [
          'You approve salaries and payments. We handle the rest. Each month, we calculate earnings, deductions, and statutory contributions for your South African employees and contractors. You receive a single consolidated invoice in your own currency. No local bank accounts, no payroll software, no finance staff required.',
          'We manage all South African payroll compliance as the legal employer. This includes PAYE, UIF, SDL calculations, SARS submissions, and audit documentation. If SARS has questions, we respond. If regulations change, we adapt. You carry no compliance exposure.',
        ],
        image: '/assets/services/ov-payroll-1.webp',
      },
      {
        title: 'Accuracy and timing',
        paragraphs: [
          'Salaries are paid on time. Statutory submissions are filed before deadlines. Payslips are issued to staff. We process leave, bonuses, commissions, and termination payouts according to South African law. Late payments and penalties do not occur.',
          'Your payroll is managed by a dedicated Payroll Officer and Finance Administrator, not an automated system. They verify calculations, handle exceptions, and respond to queries from your team. You have direct contact with the people responsible for your payroll.',
        ],
        image: '/assets/services/ov-payroll-2.webp',
      },
    ],
    steps: [
      { title: 'You approve', text: 'Send us salary details, bonuses, or changes. We confirm and prepare payroll.' },
      { title: 'We process', text: 'Our team calculates pay, deductions, and submissions. Salaries are paid and payslips issued.' },
      { title: 'You receive one invoice', text: 'A consolidated monthly invoice in your currency covers salaries, taxes, and our service fee.' },
    ],
    faqs: [
      {
        q: 'How does payroll work under an Employer of Record?',
        a: 'We calculate salaries, deductions, and statutory contributions for your South African employees and contractors each month. Employees are paid directly, SARS submissions are filed, and you receive one consolidated invoice in your own currency. You approve salaries and changes, and we handle all processing and compliance.',
      },
      {
        q: 'Can we pay in our local currency?',
        a: 'Yes. You receive one consolidated monthly invoice in your own currency — typically pounds sterling, euros or US dollars — covering salaries, statutory contributions and our service fee. We handle all rand conversions and local payments on your behalf.',
      },
      {
        q: 'How do you ensure compliance with SARS?',
        a: 'As the legal employer we manage PAYE, UIF and SDL calculations, file SARS submissions before every deadline, and keep full audit documentation. If SARS has questions, we respond; if regulations change, we adapt — you carry no compliance exposure.',
      },
      {
        q: 'What happens if payroll errors occur?',
        a: 'Your payroll is run by a dedicated Payroll Officer and Finance Administrator who verify every calculation. In the rare case of an error, they correct it immediately at no cost to you and communicate directly with the affected employee.',
      },
    ],
  },
  {
    slug: 'hr',
    title: 'Human Resources',
    nav: 'HR',
    excerpt:
      'Legends EOR handles all HR administration for your South African team.',
    intro: [
      'Legends EOR handles all HR administration for your South African team.',
    ],
    overview: [
      {
        title: 'How HR works through our EOR service',
        paragraphs: [
          'Your South African team gets a real HR department in their own city. We handle employee queries, leave administration, performance frameworks, and workplace disputes under South African labour law.',
          'Because we are the legal employer, HR risk sits with us. Disciplinary processes, CCMA matters, and policy compliance are managed by people who deal with South African labour law every day.',
        ],
        image: '/assets/services/ov-hr-1.webp',
      },
      {
        title: 'People, not portals',
        paragraphs: [
          'Your team members speak to named HR professionals, not a ticket queue. Queries are answered quickly and confidentially.',
          'You stay in control of day-to-day management while we take care of the employment framework behind it.',
        ],
        image: '/assets/services/ov-hr-2.webp',
      },
    ],
    steps: [
      { title: 'We learn your business', text: 'An Account Manager will understand your team structure, culture, and expectations so we can represent you accurately.' },
      { title: 'We run the HR', text: 'Leave, queries, performance support, and disputes are handled locally and compliantly.' },
      { title: 'You stay protected', text: 'Labour-law risk, documentation, and CCMA processes sit with us as the legal employer.' },
    ],
    faqs: [
      { q: 'Who handles day-to-day HR queries from my team?', a: 'Our on-the-ground HR team in South Africa handles leave, payroll queries, benefits questions and workplace concerns directly with your employees — you only get involved where you want to be.' },
      { q: 'What happens if there is a dispute or disciplinary issue?', a: 'We manage the process under South African labour law, from documentation and hearings through to CCMA representation if needed, protecting you from procedural risk.' },
      { q: 'Do my company policies still apply?', a: 'Yes. We align your internal policies with South African employment law and apply them consistently, flagging anything that needs local adaptation.' },
    ],
  },
  {
    slug: 'employee-benefits',
    title: 'Employee Benefits',
    nav: 'Employee Benefits',
    excerpt:
      'If you choose to offer benefits, we can advise on what makes sense for your South African team.',
    intro: [
      'If you choose to offer benefits, we can advise on what makes sense for your South African team.',
    ],
    overview: [
      {
        title: 'How benefits work through our EOR service',
        paragraphs: [
          'We advise on the benefits that matter for your roles in the South African market — medical aid, retirement annuities, group risk cover, and more — and source reliable local providers.',
          'Enrolment, monthly deductions, provider payments, and ongoing administration are all handled by us and reflected cleanly on your single monthly invoice.',
        ],
        image: '/assets/services/ov-employee-benefits-1.webp',
      },
      {
        title: 'Competitive by design',
        paragraphs: [
          'The right benefits package helps you attract and keep the top 1% of South African talent. We benchmark against the local market so your offer stands out.',
          'Employees get local support in their own time zone for claims and queries.',
        ],
        image: '/assets/services/ov-employee-benefits-2.webp',
      },
    ],
    steps: [
      { title: 'We advise', text: 'We recommend a competitive package for each role, benchmarked to the SA market.' },
      { title: 'We arrange', text: 'Providers are sourced, employees enrolled, and deductions set up.' },
      { title: 'We administer', text: 'Claims, changes, and renewals are managed locally, on one invoice.' },
    ],
    faqs: [
      { q: 'Are benefits mandatory in South Africa?', a: 'Statutory contributions like UIF are mandatory and always included. Benefits such as medical aid and retirement funds are optional but strongly recommended for competitive roles — we advise on what fits.' },
      { q: 'Can different employees have different packages?', a: 'Yes. Packages can be tailored per role or per employee, and we administer each one individually.' },
      { q: 'How are benefits billed?', a: 'All benefit costs and deductions appear itemised on your single monthly invoice in your own currency.' },
    ],
  },
  {
    slug: 'company-culture',
    title: 'Company Culture',
    nav: 'Company Culture',
    excerpt:
      'We strengthen your company culture through ongoing engagement, workplace guidance, and direct relationships.',
    intro: [
      'We strengthen your company culture through ongoing engagement, workplace guidance, and direct relationships.',
    ],
    overview: [
      {
        title: 'A cultural bridge, not just a payroll line',
        paragraphs: [
          'Distributed teams drift when nobody is on the ground. We run local engagement — team events, recognition, and workplace support — that keeps your South African staff connected to your company.',
          'We help you translate your company culture into a South African context, from onboarding rituals to public holidays and working norms.',
        ],
        image: '/assets/services/ov-company-culture-1.webp',
      },
      {
        title: 'Engagement you can measure',
        paragraphs: [
          'Regular check-ins and feedback loops surface issues before they become resignations.',
          'You get visibility of morale and retention risk without micromanaging from another continent.',
        ],
        image: '/assets/services/ov-company-culture-2.webp',
      },
    ],
    steps: [
      { title: 'We understand your culture', text: 'We learn what drives your business, how you operate, and what you expect from your team.' },
      { title: 'We reinforce it locally', text: 'We maintain culture through engagement, workplace guidance, and employee support.' },
      { title: 'We connect your team', text: 'We bridge the distance between your leadership and your South African employees.' },
    ],
    faqs: [
      { q: 'What does culture support actually include?', a: 'Local onboarding, team events, recognition programmes, regular check-ins, and a named contact your employees can talk to in person.' },
      { q: 'Can you run events for our team?', a: 'Yes — from quarterly team days in Cape Town to end-of-year functions, organised and hosted locally.' },
    ],
  },
  {
    slug: 'contractor-management',
    title: 'Contractor Management',
    nav: 'Contractor Management',
    excerpt:
      'We help classify roles contractor, handle contracts and payments, and advise.',
    intro: [
      'We help classify roles contractor, handle contracts and payments, and advise.',
    ],
    overview: [
      {
        title: 'Compliant contractor engagement',
        paragraphs: [
          'South African law draws a firm line between contractors and employees. We assess each engagement, put compliant agreements in place, and flag misclassification risk before it becomes a liability.',
          'Contractors are paid accurately and on time in rand, while you settle one invoice in your own currency.',
        ],
        image: '/assets/services/ov-contractor-management-1.webp',
      },
      {
        title: 'A path to employment',
        paragraphs: [
          'When a contractor relationship starts to look like employment, we tell you — and we make the conversion seamless through our EOR service.',
          'No disruption for the person, no compliance exposure for you.',
        ],
        image: '/assets/services/ov-contractor-management-2.webp',
      },
    ],
    steps: [
      { title: 'We classify', text: 'Each engagement is assessed against South African law before it starts.' },
      { title: 'We contract & pay', text: 'Compliant agreements and reliable monthly payments, on one invoice.' },
      { title: 'We convert when needed', text: 'Contractors become employees smoothly when the relationship changes.' },
    ],
    faqs: [
      { q: 'What is misclassification risk?', a: 'Treating someone as a contractor when the law sees them as an employee exposes you to back-pay, penalties and disputes. We assess and structure each engagement so that risk never lands on you.' },
      { q: 'Can a contractor be converted to an employee later?', a: 'Yes — conversion into our EOR service is seamless: same person, same work, with a compliant employment contract and full statutory protections.' },
    ],
  },
  {
    slug: 'eor-migration',
    title: 'EOR Migration',
    nav: 'EOR Migration',
    excerpt:
      'If your current EOR is not delivering, we can migrate your South African employees to our service.',
    intro: [
      'If your current EOR is not delivering, we can migrate your South African employees to our service.',
    ],
    overview: [
      {
        title: 'A controlled, planned transition',
        paragraphs: [
          'We map every employee, contract, and benefit with your current provider, then run a dated migration plan that protects payroll continuity and leave balances.',
          'Employment contracts transfer compliantly under South African law, with no break in service for your team.',
        ],
        image: '/assets/services/ov-eor-migration-1.webp',
      },
      {
        title: 'Invisible to your team',
        paragraphs: [
          'Salaries are paid on the same dates. Benefits continue without interruption. For your employees, the only change is better local support.',
          'You get a single point of contact through the whole migration.',
        ],
        image: '/assets/services/ov-eor-migration-2.webp',
      },
    ],
    steps: [
      { title: 'We map', text: 'Contracts, benefits, and payroll details are captured from your current EOR.' },
      { title: 'We migrate', text: 'A dated plan moves employment compliantly with no break in service.' },
      { title: 'No disruptions', text: 'Same team, same pay dates — with local support from day one.' },
    ],
    faqs: [
      { q: 'Will my employees notice the switch?', a: 'Barely. Pay dates, salaries and benefits continue unchanged; the only difference is that support now comes from people on the ground in South Africa.' },
      { q: 'How long does a migration take?', a: 'Most migrations complete within one payroll cycle once contracts are mapped — typically four to six weeks end to end.' },
    ],
  },
  {
    slug: 'onboarding-offboarding',
    title: 'Onboarding & Offboarding',
    nav: 'Onboarding/Offboarding',
    excerpt:
      'Legends EOR manages the complete process, ensuring compliance, reducing risk, and maintaining professionalism.',
    intro: [
      'Legends EOR manages the complete process, ensuring compliance, reducing risk, and maintaining professionalism.',
    ],
    overview: [
      {
        title: 'Compliant from day one',
        paragraphs: [
          'New hires get compliant South African employment contracts, statutory registrations, and a proper local onboarding — usually within 48 hours of your go-ahead.',
          'Equipment, system access, and first-day logistics are handled locally so people are productive immediately.',
        ],
        image: '/assets/services/ov-onboarding-offboarding-1.webp',
      },
      {
        title: 'Exits without exposure',
        paragraphs: [
          'When someone leaves, we run notice periods, documentation, final payments, and statutory requirements exactly as South African law demands.',
          'CCMA disputes are rare when exits are done properly — and if they happen, we handle them.',
        ],
        image: '/assets/services/ov-onboarding-offboarding-2.webp',
      },
    ],
    steps: [
      { title: 'We contract', text: 'Compliant SA employment contracts and statutory registrations, fast.' },
      { title: 'We onboard', text: 'Equipment, access, and local first-day support are all arranged.' },
      { title: 'We manage exits', text: 'Notice, documentation, and final payments handled CCMA-safe.' },
    ],
    faqs: [
      { q: 'How fast can a new hire start?', a: 'Once you confirm the candidate and package, onboarding typically completes within 48 hours — contract signed, registrations filed, equipment ready.' },
      { q: 'What makes an exit "CCMA-safe"?', a: 'Following South African procedure to the letter: proper notice, documented process, correct final payments. We run that process as the legal employer so disputes don\'t reach you.' },
    ],
  },
  {
    slug: 'office-space',
    title: 'Office Space',
    nav: 'Office Space',
    excerpt:
      'We offer private offices, dedicated desks, and meeting rooms with reliable infrastructure and on-site support.',
    intro: [
      'We offer private offices, dedicated desks, and meeting rooms with reliable infrastructure and on-site support.',
    ],
    overview: [
      {
        title: 'A managed home for your team',
        paragraphs: [
          'Private offices or dedicated desks at Wembley Square in Cape Town, with backup power, fast redundant internet, meeting rooms, and secure access.',
          'Load-shedding never stops your team: generators and UPS keep everything running.',
        ],
        image: '/assets/services/ov-office-space-1.webp',
      },
      {
        title: 'Support down the corridor',
        paragraphs: [
          'HR and IT support are in the same building — problems get solved in person, in minutes.',
          'Office costs are consolidated into your single monthly invoice.',
        ],
        image: '/assets/services/ov-office-space-2.webp',
      },
    ],
    steps: [
      { title: 'We host', text: 'Desks or private offices in our managed Cape Town workspace.' },
      { title: 'We support', text: 'On-site HR and IT keep your team working, whatever happens.' },
      { title: 'You consolidate', text: 'One invoice covers people, space, and support together.' },
    ],
    faqs: [
      { q: 'What happens during load-shedding?', a: 'Nothing — our office runs on backup generators and UPS systems with redundant fibre lines, so your team keeps working through any outage.' },
      { q: 'Can my team work hybrid?', a: 'Yes. Dedicated desks, hot desks and remote arrangements can be mixed to fit how your team works.' },
    ],
  },
  {
    slug: 'it-support',
    title: 'IT Support',
    nav: 'IT Support',
    excerpt:
      'We handle device setup, troubleshooting, onboarding and offboarding, and coordination with your internal IT team.',
    intro: [
      'We handle device setup, troubleshooting, onboarding and offboarding, and coordination with your internal IT team.',
    ],
    overview: [
      {
        title: 'IT that is actually there',
        paragraphs: [
          'Devices are set up before day one. Problems are fixed by local technicians, often in person, in your team\'s time zone.',
          'Your security policies — MDM, VPN, access controls — are applied and maintained on every device.',
        ],
        image: '/assets/services/ov-it-support-1.webp',
      },
      {
        title: 'Secure joiners and leavers',
        paragraphs: [
          'Access is provisioned on start and revoked completely on exit, with devices recovered, wiped, and redeployed.',
          'You get an asset register you can trust.',
        ],
        image: '/assets/services/ov-it-support-2.webp',
      },
    ],
    steps: [
      { title: 'We set up', text: 'Devices configured to your policies before each start date.' },
      { title: 'We support', text: 'Local troubleshooting keeps your team productive every day.' },
      { title: 'Secure offboarding', text: 'Exits mean full access removal and device recovery, documented.' },
    ],
    faqs: [
      { q: 'Is IT support really included?', a: 'Yes — day-to-day IT support for your South African team is part of the EOR service, with no per-ticket charges.' },
      { q: 'Can you enforce our security policies?', a: 'Yes. We apply your MDM, VPN and access-control requirements to every device and keep them maintained.' },
    ],
  },
  {
    slug: 'it-equipment',
    title: 'IT Equipment',
    nav: 'IT Equipment',
    excerpt:
      'You can purchase laptops, monitors, and peripherals through our local webstore.',
    intro: [
      'You can purchase laptops, monitors, and peripherals through our local webstore.',
    ],
    overview: [
      {
        title: 'Local sourcing, day-one readiness',
        paragraphs: [
          'We buy or lease equipment in South Africa to your spec, configure it, and deliver it before the start date.',
          'No customs, no import duties, no couriering laptops across borders.',
        ],
        image: '/assets/services/ov-it-equipment-1.webp',
      },
      {
        title: 'The full lifecycle',
        paragraphs: [
          'Repairs, replacements, upgrades, and end-of-life recovery are all handled locally.',
          'Equipment costs appear on your single monthly invoice.',
        ],
        image: '/assets/services/ov-it-equipment-2.webp',
      },
    ],
    steps: [
      { title: 'We source', text: 'Equipment to your spec, procured locally at local prices.' },
      { title: 'We deliver', text: 'Configured devices arrive before day one, anywhere in SA.' },
      { title: 'We maintain', text: 'Repairs, swaps, and recovery through the device lifecycle.' },
    ],
    faqs: [
      { q: 'Can we specify exact models?', a: 'Yes — you set the spec (or we recommend one) and we source it locally, usually within days.' },
      { q: 'Who owns the equipment?', a: 'Either you or us, depending on the arrangement you prefer — purchase and lease options are both available.' },
    ],
  },
]

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug)
}
