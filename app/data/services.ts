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
  /** per-page section copy overrides (CEO copy pass); defaults in [slug].vue */
  overviewSub?: string
  hiwTitle?: string
  hiwSub?: string
  servicesSub?: string
  ctaSub?: string
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
      'We process accurate payroll, meet statutory obligations, and maintain compliance.',
    intro: [
      'Run accurate, compliant payroll in South Africa without local bank accounts, payroll software or in-country finance staff.',
    ],
    overviewSub: 'See how our EOR payroll service handles salaries, PAYE, UIF, SDL, payslips and SARS submissions.',
    servicesSub: 'Explore the HR, onboarding, contractor and EOR migration services available alongside South African payroll.',
    ctaSub: 'Get a personalised cost comparison for employing and paying your South African team within 24 hours.',
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
      { q: 'How does payroll work under an Employer of Record?', a: 'We calculate salaries, deductions, and statutory contributions for your South African employees and contractors each month. Employees are paid directly, SARS submissions are filed, and you receive one consolidated invoice in your own currency. You approve salaries and changes, and we handle all processing and compliance.' },
      { q: 'Can we pay in our local currency?', a: 'Yes. You receive one invoice in your preferred currency covering salaries, statutory deductions, and our service fee. We handle the currency conversion and local payments in rands. You do not need a South African bank account or local payment infrastructure.' },
      { q: 'How do you ensure compliance with SARS?', a: 'Our Payroll Officer and Finance Administrator calculate PAYE, UIF, and SDL according to current South African tax law and file all statutory submissions before deadlines. We monitor regulatory changes, maintain audit documentation, and take full responsibility for compliance. If SARS has questions or issues, we respond on your behalf.' },
      { q: 'What happens if payroll errors occur?', a: 'We verify all calculations before processing to minimize errors. If an error does occur, we correct it immediately and communicate with the affected employee. You are not penalised for errors we make, and employees receive any owed amounts without delay.' },
    ],
  },
  {
    slug: 'hr',
    title: 'Human Resources',
    nav: 'HR',
    excerpt:
      'Legends EOR handles all HR administration for your South African team.',
    intro: [
      'Outsource South African HR administration, employee relations and labour-law compliance to a local team that acts as your legal employer.',
    ],
    overviewSub: 'See how our South African EOR service manages day-to-day HR, employee support and labour-law risk for your team.',
    hiwTitle: 'What makes our HR support different?',
    hiwSub: 'Local expertise, dedicated support and hands-on HR assistance for every South African employee.',
    servicesSub: 'Explore the payroll, onboarding, contractor and EOR migration services that support your South African team.',
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
      { title: 'Your dedicated HR manager', text: 'One experienced point of contact who knows your team, manages day-to-day HR matters and keeps you informed.' },
      { title: 'HR support, always in the office', text: 'Your employees have direct access to an HR professional who is based in our South African office and available throughout every working day.' },
      { title: 'South African labour law specialists', text: 'Our in-house experts protect your business, navigate complex employee matters and ensure every decision is legally sound.' },
    ],
    faqs: [
      { q: 'What HR support is included under the EOR?', a: 'We manage employment contracts, onboarding and offboarding, leave administration, performance management coordination, employee relations, and compliance with South African labour law. We provide ongoing advisory support on employment matters and act as the local HR contact for your South African employees. This includes handling day-to-day employee queries and guiding you through any complex employment issues.' },
      { q: 'Who handles employee disputes?', a: 'We manage employee disputes as the legal employer, working closely with you to resolve issues while protecting your interests. Our team handles grievances, disciplinary matters, and conflict resolution according to South African labour law. If disputes escalate, we coordinate legal support and representation on your behalf.' },
      { q: 'How do you protect us from labour law risk?', a: 'We ensure all employment contracts, policies, and processes comply with South African labour law from the start. We advise you proactively when situations carry risk and guide you through decisions that could create legal exposure. As the legal employer, we take responsibility for compliance and shield you from direct liability.' },
      { q: 'Do employees see you as their HR?', a: 'Yes. Employees understand we are their legal employer and HR contact in South Africa while they report to you operationally. We handle all HR administration, employee queries, contract matters, and compliance issues. You manage their work, performance, and day-to-day responsibilities.' },
    ],
  },
  {
    slug: 'employee-benefits',
    title: 'Employee Benefits',
    nav: 'Employee Benefits',
    excerpt:
      'If you choose to offer benefits, we can advise on what makes sense for your South African team.',
    intro: [
      'Offer competitive employee benefits in South Africa without managing local providers, enrolment, deductions or claims.',
    ],
    overviewSub: 'See how we benchmark, source and administer locally relevant benefits for your South African employees.',
    servicesSub: 'Explore the HR, payroll, onboarding and contractor services that complete your South African employment package.',
    ctaSub: 'Talk to our team and get a custom cost comparison in 24 hours',
    overview: [
      {
        title: 'How benefits work through our EOR service',
        paragraphs: [
          'We advise on the benefits that matter for your roles in the South African market, such as medical aid, retirement annuities and group risk cover, and source reliable local providers.',
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
      { title: 'Competitive benefits, sourced for you', text: 'We advise on and source competitive employee benefits, giving your South African team a stronger package without adding work for you.' },
      { title: 'One all-encompassing monthly invoice', text: 'Benefit costs are included in one consolidated monthly invoice, keeping payments clear, convenient and easier for your business to manage.' },
      { title: 'Employee deductions, fully managed', text: 'We process employee benefit deductions through payroll, ensuring every contribution is handled accurately and paid on time each month.' },
    ],
    faqs: [
      { q: 'Are employee benefits mandatory in South Africa?', a: 'No. Statutory deductions like PAYE, UIF, and SDL are mandatory and handled through payroll, but benefits like medical aid and pension contributions are optional. You decide what to offer based on your budget, the roles you are hiring for, and what is competitive in your industry. We advise on what is expected for specific roles and seniority levels.' },
      { q: 'What types of benefits can you support?', a: 'We support medical aid schemes, pension and provident funds, and enhanced leave policies beyond statutory requirements. We have established relationships with local benefit providers and can guide you on which options align with your budget and employee expectations. Benefits can be tailored by role or applied consistently across your team.' },
      { q: 'How do you manage benefit administration?', a: 'We source providers, manage employee enrollment, process monthly deductions through payroll, and handle ongoing administration including queries and changes. You have one point of contact for all benefit matters. Employees receive clear communication and support throughout enrollment and while benefits are active.' },
      { q: 'How are benefits integrated with payroll?', a: 'Benefit deductions are processed automatically through payroll each month. Contributions are submitted to providers on time, records are maintained for compliance, and changes to employee benefits are managed as part of normal HR processes. You do not need separate systems or additional staff to manage benefits administration.' },
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
    overviewSub: 'See how we translate your culture locally, keep employees engaged and identify retention risks before they become resignations.',
    servicesSub: 'Explore the HR, payroll, benefits and workplace services that help your South African team thrive.',
    ctaSub: 'Get a tailored cost comparison and plan for building an engaged South African team within 24 hours.',
    overview: [
      {
        title: 'A cultural bridge, not just a payroll line',
        paragraphs: [
          'Distributed teams drift when nobody is on the ground. We run local engagement, including team events, recognition, and workplace support, that keeps your South African staff connected to your company.',
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
      { title: 'Team building, hosted by us locally', text: 'We arrange team-building activities that strengthen relationships, improve engagement and help your South African employees work better together.' },
      { title: 'A cohesive culture that fosters retention', text: 'Our HR Account Managers support employee engagement, address concerns early and help you build stronger loyalty across your team.' },
      { title: 'Two countries, one team, zero silos', text: 'From onboarding to daily collaboration, everything is designed to create one connected team regardless of distance.' },
    ],
    faqs: [
      { q: 'How do you support company culture in South Africa?', a: 'We act as the local presence for your business, reinforcing your company culture through regular employee engagement, guidance on South African workplace norms, and coordination of team activities. We maintain ongoing relationships with your employees and help bridge the gap between your headquarters and your South African team. This includes advising on communication styles, workplace expectations, and cultural differences that could create misunderstandings.' },
      { q: 'Do you replace our internal culture initiatives?', a: 'No. We support and reinforce your existing company culture locally, not replace it. You remain responsible for defining your culture, values, and how your business operates. We ensure those expectations are understood and maintained on the ground in South Africa while advising when local workplace norms differ from your approach.' },
      { q: 'How do you reduce disengagement in remote teams?', a: 'We provide consistent local contact, regular check-ins, and engagement initiatives that help employees feel connected to your business rather than isolated. Employees have someone on the ground who understands both your company and the South African context. This reduces the disconnection that remote teams often experience when they are thousands of kilometres from headquarters.' },
      { q: 'Can you assist with local office events?', a: 'Yes. We organise and support office-based events, including team meetings, social activities, onboarding sessions, and company celebrations. We coordinate logistics, ensure events align with your company culture, and facilitate participation. This is particularly useful for hybrid teams or companies without dedicated event coordination in South Africa.' },
    ],
  },
  {
    slug: 'contractor-management',
    title: 'Contractor Management',
    nav: 'Contractor Management',
    excerpt:
      'We help classify roles contractor, handle contracts and payments, and advise.',
    intro: [
      'Manage South African contractors properly, from classification and contracts to payments and compliance.',
    ],
    overviewSub: 'See how we classify, contract and pay South African contractors while protecting your business from compliance exposure.',
    servicesSub: 'Explore the EOR, payroll, HR and onboarding services available when contractors become permanent employees.',
    ctaSub: 'Get a tailored comparison of contractor and EOR employment costs in South Africa within 24 hours.',
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
          'When a contractor relationship starts to look like employment, we tell you, and we make the conversion seamless through our EOR service.',
          'No disruption for the person, no compliance exposure for you.',
        ],
        image: '/assets/services/ov-contractor-management-2.webp',
      },
    ],
    steps: [
      { title: 'Reduce contractor misclassification risk', text: 'We assess working arrangements and manage contracts correctly, helping protect your business from penalties linked to contractor misclassification.' },
      { title: 'Seamless contract transition', text: 'When the time is right, we make it simple to transition valued contractors into compliant, permanent employees.' },
      { title: 'Contractor tax made simple', text: 'We manage contractor payments and local tax administration, reducing complexity for both your business and the people you engage.' },
    ],
    faqs: [
      { q: 'What does contractor management include?', a: 'Contractor management includes classification guidance, drafting compliant contractor agreements, onboarding and offboarding coordination, invoice processing and payment management, and ongoing tax and compliance advice. We provide local oversight throughout the contractor relationship and advise proactively when the engagement structure needs to change. Our role is to reduce misclassification risk and ensure the relationship is managed correctly under South African law.' },
      { q: 'How do you reduce misclassification risk?', a: 'We assess whether a contractor relationship is genuinely independent or functions more like employment. This includes reviewing the nature of the work, level of control, exclusivity, and other factors that determine classification under South African law. We flag situations where misclassification risk exists and advise when a contractor should transition to employment before it becomes a compliance issue.' },
      { q: 'Are contractor agreements compliant with South African law?', a: 'Yes. We draft contractor agreements that reflect the true nature of the relationship and comply with South African legal and tax requirements. Agreements include appropriate clauses on scope of work, payment terms, independence, termination, and dispute resolution. We update agreements when circumstances change to maintain compliance throughout the engagement.' },
      { q: 'Can contractors be transitioned to employees?', a: 'Yes. We manage the transition from contractor to employee through our Employer of Record service when the role becomes permanent or the relationship shifts into employment territory. The individual moves to full employment without interruption to their work. Contracts are replaced, payroll begins, and compliance is maintained throughout the transition process.' },
    ],
  },
  {
    slug: 'eor-migration',
    title: 'EOR Migration',
    nav: 'EOR Migration',
    excerpt:
      'If your current EOR is not delivering, we can migrate your South African employees to our service.',
    intro: [
      'Switch EOR providers in South Africa without disrupting payroll, benefits, leave balances or employee service.',
    ],
    overviewSub: 'See how we plan and manage a compliant EOR migration while protecting continuity for every South African employee.',
    servicesSub: 'Explore the HR, payroll, onboarding and contractor services available after your EOR migration.',
    ctaSub: 'Get a clear migration plan and tailored cost comparison for your South African team within 24 hours.',
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
      { title: 'Seamless EOR Migration made simple', text: 'We manage the practical requirements of moving your workforce to a new EOR provider. This simplifies the process and removes the burden.' },
      { title: 'No disruption to your team', text: 'Contracts, payroll details and essential employee information transfer cleanly, with no disruption to your team or your bottom line.' },
      { title: 'Transparency and clarity for all', text: 'We communicate directly with every stakeholder, explain the migration process and provide guidance through every step of the change.' },
    ],
    faqs: [
      { q: 'How does EOR migration work?', a: 'We assess your current setup, identify risks, and build a detailed migration plan with clear timelines. This includes replacing employment contracts, transitioning payroll, transferring benefits where applicable, and securely handing over records and data. Each step is coordinated with your outgoing provider to avoid gaps in employment, payroll, or compliance.' },
      { q: 'Will payroll be interrupted?', a: 'No. We ensure salary payments continue without interruption during the transition. Payroll is coordinated so employees are paid on time, statutory deductions are processed correctly, and benefits remain active throughout the migration. Continuity is the primary focus of the entire process.' },
      { q: 'Is the migration legally compliant?', a: 'Yes. We manage the legal transition carefully to ensure employees move from one employer to another without creating compliance exposure. New employment contracts are issued, statutory registrations are transferred or established, and all documentation is prepared according to South African labour law. We conduct compliance checks to identify and correct any existing issues during the migration.' },
      { q: 'How are employees informed?', a: 'Employees receive clear communication about the migration, what it means for them, and what changes to expect. We coordinate messaging with you to ensure consistency and minimize uncertainty. The goal is to make the transition feel almost invisible while keeping employees informed and reassured throughout the process.' },
    ],
  },
  {
    slug: 'onboarding-offboarding',
    title: 'Onboarding & Offboarding',
    nav: 'Onboarding/Offboarding',
    excerpt:
      'Legends EOR manages the complete process, ensuring compliance, reducing risk, and maintaining professionalism.',
    intro: [
      'Onboard and offboard employees in South Africa quickly, professionally and in full compliance with local labour law.',
    ],
    overviewSub: 'See how we handle compliant contracts, statutory registrations, equipment setup, first days and employee exits.',
    servicesSub: 'Explore the HR, payroll, equipment and IT services that support every stage of the South African employee lifecycle.',
    ctaSub: 'Get a personalised cost comparison for hiring and onboarding your South African team within 24 hours.',
    overview: [
      {
        title: 'Compliant from day one',
        paragraphs: [
          'New hires get compliant South African employment contracts, statutory registrations, and a proper local onboarding, usually within 48 hours of your go-ahead.',
          'Equipment, system access, and first-day logistics are handled locally so people are productive immediately.',
        ],
        image: '/assets/services/ov-onboarding-offboarding-1.webp',
      },
      {
        title: 'Exits without exposure',
        paragraphs: [
          'When someone leaves, we run notice periods, documentation, final payments, and statutory requirements exactly as South African law demands.',
          'CCMA disputes are rare when exits are done properly, and if they happen, we handle them.',
        ],
        image: '/assets/services/ov-onboarding-offboarding-2.webp',
      },
    ],
    steps: [
      { title: 'Ready to work from day one', text: 'We coordinate contracts, payroll, equipment and access so every new employee can start confidently and without unnecessary delays.' },
      { title: 'Company property safely returned', text: 'When an employee leaves, we coordinate the collection of equipment and other company property on your behalf.' },
      { title: 'Employees guided throughout', text: 'We communicate directly with employees during onboarding and offboarding, explaining each step and keeping the process clear and professional.' },
    ],
    faqs: [
      { q: 'What does onboarding include?', a: 'Onboarding includes drafting compliant employment contracts, registering employees for PAYE, UIF, and SDL, setting up payroll, issuing employment documentation, and coordinating IT and office access if applicable. We manage the full process from contract signature to first day readiness. Employees receive clear communication about their role, responsibilities, and probation period before they start.' },
      { q: 'How do you ensure contracts are compliant?', a: 'We draft all employment contracts according to current South African labour law, including required clauses on notice periods, probation, leave, termination, and dispute resolution. Contracts are tailored to the role and seniority level while protecting your interests as the employer. We update contract templates when legislation changes to maintain compliance.' },
      { q: 'How do you handle employee terminations?', a: 'We guide you through the termination process to ensure it complies with South African labour law and minimises legal risk. This includes following correct procedures for dismissals, resignations, retrenchments, and mutual separations. We prepare termination letters, calculate final payments, coordinate exit processes, and ensure all statutory requirements are met.' },
      { q: 'How do you reduce CCMA risk?', a: 'We reduce CCMA risk by ensuring employment contracts, disciplinary processes, and terminations follow South African labour law correctly. We advise on procedural fairness, document all employment decisions properly, and guide you through high-risk situations before they escalate. If a dispute does reach the CCMA, we represent you as the legal employer.' },
    ],
  },
  {
    slug: 'office-space',
    title: 'Office Space',
    nav: 'Office Space',
    excerpt:
      'We offer private offices, dedicated desks, and meeting rooms with reliable infrastructure and on-site support.',
    intro: [
      'Give your South African team secure Cape Town office space with reliable power, fast internet and on-site HR and IT support.',
    ],
    overviewSub: 'Explore managed offices and dedicated desks in Cape Town, built for productive teams and uninterrupted work.',
    servicesSub: 'Explore the employment, IT and equipment services available alongside your managed South African office.',
    ctaSub: 'Get a tailored cost comparison for hiring and housing your South African team within 24 hours.',
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
          'HR and IT support are in the same building; problems get solved in person, in minutes.',
          'Office costs are consolidated into your single monthly invoice.',
        ],
        image: '/assets/services/ov-office-space-2.webp',
      },
    ],
    steps: [
      { title: 'In-office HR support', text: 'Your team works in-office alongside our HR Account Managers, giving employees direct, in-person support whenever they need it.' },
      { title: 'Protected against disruptions', text: 'Our managed office provides dependable power, internet and a professional environment where your employees can work without interruption.' },
      { title: 'Better teamwork, better output', text: 'Working together in one office helps employees collaborate more closely, build stronger relationships and produce better-quality work.' },
    ],
    faqs: [
      { q: 'What type of office space do you provide?', a: 'We provide private offices, dedicated desks, and meeting rooms in our own managed office space in South Africa. This includes access, utilities, internet, and on-site support. Office space is available based on your team size and working model, with everything managed under one contract.' },
      { q: 'Is the space suitable for hybrid teams?', a: 'Yes. Employees can use office space based on your company policy, whether that is full-time or hybrid. Dedicated desks and private offices are assigned to specific employees, while meeting rooms can be booked as needed. The setup supports flexible working arrangements without requiring separate leases or agreements.' },
      { q: 'Is backup power and internet available?', a: 'Yes. Our office space has backup power to maintain operations during load shedding and reliable internet connectivity to manage South African infrastructure challenges. Your team can work without interruption when local services fail. You do not need to manage infrastructure or arrange backup systems yourself.' },
      { q: 'Can employees work with HR and IT on-site?', a: 'Yes. Our HR and IT teams are based in the same office space as your employees. This means faster resolution of technical and HR issues, immediate access to support, and better overall employee experience. Onboarding new hires is simpler when support is available in person rather than remotely.' },
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
    overviewSub: 'See how our in-office IT team configures devices, resolves issues and applies your security policies locally.',
    servicesSub: 'Explore the equipment, office, HR and onboarding services that support your South African workforce.',
    ctaSub: 'Get a tailored cost comparison for hiring and supporting your South African team within 24 hours.',
    overview: [
      {
        title: 'IT that is actually there',
        paragraphs: [
          'Devices are set up before day one. Problems are fixed by local technicians, often in person, in your team\'s time zone.',
          'Your security policies, including MDM, VPN and access controls, are applied and maintained on every device.',
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
      { title: 'In-office IT support', text: 'Employees receive immediate, hands-on support from our in-office IT team, resolving technical issues quickly, minimising downtime and keeping your operations running smoothly.' },
      { title: 'Same Time Zone', text: 'Our in-office IT team is available on the ground, so technical problems can be resolved efficiently.' },
      { title: 'Technology ready from day one', text: 'We set up the software and access each employee needs, ensuring they can start work without avoidable technical delays.' },
    ],
    faqs: [
      { q: 'What IT support is included?', a: 'IT support includes device setup, hardware and software troubleshooting, network and connectivity issues, security management, and access control. We handle day-to-day technical support for your employees and coordinate with your internal IT team when required. New hire IT setup and offboarding access removal are managed as part of onboarding and offboarding processes.' },
      { q: 'Do you provide on-site support?', a: 'Yes. Our IT team is based on-site and available for hands-on troubleshooting and support. This is particularly important for resolving South African infrastructure challenges like power and connectivity issues that require local knowledge. Employees report problems directly to our team and issues are resolved faster than remote-only support allows.' },
      { q: 'How does IT integrate with onboarding?', a: 'New hires receive full IT setup as part of their first day. Devices are configured, accounts are created, security protocols are applied, and access is granted before they start work. IT setup is coordinated tightly with HR to ensure employees are ready to work immediately without waiting for technical access or equipment.' },
      { q: 'How do you handle access during offboarding?', a: 'All access is removed immediately when employees leave. This includes disabling accounts, revoking system access, wiping devices, and securing company data. IT offboarding is coordinated with HR to ensure access removal happens on the employee\'s last day. Devices are returned and handled securely according to your instructions.' },
    ],
  },
  {
    slug: 'it-equipment',
    title: 'IT Equipment',
    nav: 'IT Equipment',
    excerpt:
      'You can purchase laptops, monitors, and peripherals through our local webstore.',
    intro: [
      'Source, configure and deliver IT equipment anywhere in South Africa without international shipping, customs or vendor risk.',
    ],
    overviewSub: 'See how we procure, configure, deliver and maintain laptops, monitors and peripherals throughout the employee lifecycle.',
    servicesSub: 'Explore the IT support, office, HR and onboarding services available with locally sourced equipment.',
    ctaSub: 'Get a tailored cost comparison for hiring and equipping your South African team within 24 hours.',
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
      { title: 'Equipment delivered securely', text: 'We source and deliver high-quality equipment locally, reducing lead times and minimising the risk of delays, damage or loss in transit.' },
      { title: 'No customs complications', text: 'Local procurement avoids international shipping and South African customs, making equipment setup faster and much simpler.' },
      { title: 'Trusted local suppliers', text: 'We purchase through verified suppliers, protecting your business from unreliable vendors and ensuring you receive legitimate, suitable equipment.' },
    ],
    faqs: [
      { q: 'What equipment can be provided?', a: 'We provide laptops, monitors, keyboards, mice, headsets, and other peripherals through our local online webstore. Equipment is sourced from trusted South African suppliers and tailored to the employee\'s role and requirements. Replacement devices are handled locally when equipment fails or needs upgrading.' },
      { q: 'Who owns the equipment?', a: 'You own the equipment. We facilitate the purchase and manage the logistics, but ownership remains with you. This means you control equipment specifications, decide on replacements, and determine what happens to devices when employees leave. We simply handle the sourcing, delivery, and lifecycle management on your behalf.' },
      { q: 'Can we purchase equipment in our own currency?', a: 'Yes. You select equipment through our webstore and receive an invoice in your preferred currency. Equipment costs are included in your consolidated monthly invoice along with payroll and service fees. You avoid forced conversions to rands, separate vendor relationships, and currency exposure.' },
      { q: 'How is equipment delivered to employees?', a: 'Equipment is delivered directly to employees or handed over in person at our office. For new hires, devices are ready and configured on their first day in coordination with our IT team. You do not need to arrange international shipping, manage local logistics, or wait weeks for equipment to clear customs.' },
    ],
  },
]

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug)
}
