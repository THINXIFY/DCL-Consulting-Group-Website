export type ExpertiseIcon = 'commercial-analysis' | 'financial-review' | 'strategic-insight' | 'risk-evaluation';

export interface ExpertiseArea {
  label: string;
  headlineLines: [string, string];
  copy: string;
  icon: ExpertiseIcon;
  href: string;
}

export interface ApproachStage {
  title: string;
  copy: string;
}

export interface IndustryItem {
  name: string;
  context: string;
}

export const heroContent = {
  eyebrow: 'Independent insight. London and international.',
  headlineLines: ['Clarity', 'Before Capital.'],
  lead: 'DCL Consulting helps investors evaluate opportunities with greater clarity through disciplined analysis, strategic insight, and independent perspective.',
  primaryCta: { label: 'Explore Our Expertise', href: '#expertise' },
  secondaryCta: { label: 'Start a Conversation', href: '#about' },
  image: {
    src: '/images/home/home-hero-architecture.webp',
    alt: 'Curved glass office tower facade reflecting a dusk sky, London',
  },
};

export const aboutContent = {
  eyebrow: 'About us',
  title: 'Clarity begins with understanding.',
  supporting: 'A considered perspective, for decisions that deserve one.',
  body: [
    'DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support.',
    'We help investors and businesses understand opportunities more clearly by examining commercial fundamentals, financial considerations, material risks, and strategic context.',
    'Our role is to bring shape to the uncertain. We combine rigorous research with commercial understanding to reveal what matters, what is missing, and what should happen next.',
    "Quietly independent and deliberately close to the work, we operate as a trusted extension of our clients' thinking.",
  ],
  image: {
    src: '/images/home/home-about-architecture.webp',
    alt: 'Board-formed concrete building corner with an angular roofline against a deep blue sky',
  },
  principles: [
    { title: 'Independent', copy: 'Perspective free from product or platform interest.' },
    { title: 'Disciplined', copy: 'Rigorous analysis applied to every material assumption.' },
    { title: 'Considered', copy: 'Clear judgement, weighed against the wider context.' },
  ],
};

export const expertiseSection = {
  eyebrow: 'Our Expertise',
  headlineLines: ['Different expertise.', 'A clearer view.'] as [string, string],
  body: 'We combine commercial insight, analytical discipline and real-world experience to help clients evaluate opportunities, navigate complexity and make better-informed decisions.',
  cta: { label: 'Explore Our Expertise', href: '/expertise' },
  image: {
    src: '/images/home/home-expertise-architecture.webp',
    alt: 'Sweeping curved stone facade of a contemporary building against a deep blue sky',
  },
  imageStatementLines: ['Insight', 'applied', 'to real', 'opportunity.'] as string[],
  areas: [
    {
      label: 'Commercial Analysis',
      headlineLines: ['Commercial insight', 'for real decisions.'],
      copy: 'We assess market dynamics, competitive positioning and commercial fundamentals to provide a clearer understanding of opportunity and value.',
      icon: 'commercial-analysis',
      href: '/expertise#four-lenses',
    },
    {
      label: 'Financial Review',
      headlineLines: ['Stronger foundations', 'for opportunity.'],
      copy: 'We analyse financial characteristics, performance and resilience to support better-informed decisions across significant investment opportunities.',
      icon: 'financial-review',
      href: '/expertise#four-lenses',
    },
    {
      label: 'Strategic Insight',
      headlineLines: ['Perspective for', 'a changing world.'],
      copy: 'We identify options, test assumptions and consider broader strategic implications to help clients navigate complex environments.',
      icon: 'strategic-insight',
      href: '/expertise#four-lenses',
    },
    {
      label: 'Risk Evaluation',
      headlineLines: ['Clarity through', 'deeper understanding.'],
      copy: 'We evaluate uncertainty, dependencies and downside considerations to support more resilient and well-founded decisions.',
      icon: 'risk-evaluation',
      href: '/expertise#four-lenses',
    },
  ] satisfies ExpertiseArea[],
  bottomStrip: {
    eyebrow: 'Our Approach in Practice',
    statementLines: ['Expertise is most valuable', 'when it leads to clarity.'] as [string, string],
    copy: 'We apply our expertise with a pragmatic, independent mindset, always focused on the factors that matter most to our clients.',
    cta: { label: 'Our Approach', href: '/approach' },
  },
};

export const approach: ApproachStage[] = [
  { title: 'Understand', copy: 'We take the time to understand the opportunity, objective and wider context.' },
  { title: 'Analyse', copy: 'We review the business, market, economics and information that matter most.' },
  { title: 'Evaluate', copy: 'We assess options, risks and opportunities with objectivity and a long-term view.' },
  { title: 'Advise', copy: 'We translate the analysis into a clear, independent perspective you can act on.' },
];

export const approachBandImage = {
  src: '/images/home/home-approach-band.webp',
  alt: 'Four consultants in conversation on a glass-walled terrace overlooking a coastal mountain landscape at sunset, with the DCL monogram mounted on a marble wall',
};

export const industries: IndustryItem[] = [
  { name: 'Real Estate & Property', context: 'Advisory support across residential, commercial and real-asset opportunities.' },
  { name: 'Technology & AI', context: 'Strategic insight across technology, software and emerging digital sectors.' },
  { name: 'Healthcare & Life Sciences', context: 'Strategic insight across healthcare, pharmaceuticals and related industries.' },
  { name: 'Energy & Infrastructure', context: 'Advisory perspective on energy transition, resources and sustainable infrastructure.' },
  { name: 'Financial Services', context: 'Insight across financial markets, asset management and related services.' },
  { name: 'Industrial & Manufacturing', context: 'Supporting growth, investment and transformation across industrial sectors.' },
];

export const industriesImage = {
  src: '/images/home/home-industries.webp',
  alt: 'Two glass high-rise towers with a honeycomb facade pattern viewed from below against the sky',
};

export interface QualityItem {
  title: string;
  copy: string;
}

export interface CompanyFact {
  label: string;
  value: string;
}

export const whyDcl: QualityItem[] = [
  {
    title: 'Independent Perspective',
    copy: 'Advice shaped by the facts of the situation, not by product, platform or third-party relationship.',
  },
  {
    title: 'Analytical Discipline',
    copy: 'A structured approach that tests assumptions and looks past the surface of an opportunity.',
  },
  {
    title: 'Commercial Understanding',
    copy: 'Perspective grounded in how businesses, markets and transactions actually work.',
  },
  {
    title: 'Clear Communication',
    copy: 'Analysis translated into a perspective that is clear, direct and genuinely useful.',
  },
  {
    title: 'Long-Term Thinking',
    copy: 'A perspective weighed against what matters beyond the immediate decision.',
  },
];

export const whyDclImage = {
  src: '/images/home/home-why-dcl.webp',
  alt: 'Angular white building facade with a diamond geometric cladding pattern against a blue sky',
};

export const companyFacts: CompanyFact[] = [
  { label: 'Company', value: 'DCL Consulting and Investments Limited' },
  { label: 'Company Type', value: 'Private Limited Company' },
  { label: 'Registered In', value: 'England & Wales' },
  { label: 'Company Number', value: '10086906' },
  { label: 'Director', value: 'David Christopher Lebond' },
];

export interface InsightItem {
  theme: string;
  statement: string;
}

// Editorial perspective statements, not dated articles - the project does not
// yet contain published insight content, so no titles, dates, read times or
// article routes are implied here (see brief guardrail on fabricated content).
export const insights: InsightItem[] = [
  {
    theme: 'On Independence',
    statement: 'Advice shaped by the facts of the situation, not by product, platform or third-party relationship.',
  },
  {
    theme: 'On Discipline',
    statement: 'The value of analysis often lies in what it rules out, not only in what it confirms.',
  },
  {
    theme: 'On Decisions',
    statement: 'Clarity before capital - a considered perspective, before capital moves.',
  },
];

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: 'What does DCL do?',
    answer: 'DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support, helping clients evaluate opportunities with greater clarity.',
  },
  {
    question: 'Who does DCL work with?',
    answer: 'We work with individuals, families, private investors, businesses and organisations seeking independent perspective on significant investment, commercial or strategic decisions.',
  },
  {
    question: 'How is DCL different?',
    answer: 'Our perspective is independent and shaped only by the facts of the situation, combining rigorous analysis with commercial understanding rather than any product or platform interest.',
  },
  {
    question: 'Does DCL manage or execute investments?',
    answer: 'No. DCL is an independent advisory business. Our role is to provide analysis and perspective, not to hold client assets or execute investment decisions on a client’s behalf.',
  },
  {
    question: 'How do we start a conversation?',
    answer: 'Most engagements begin with an initial conversation to understand the decision, the context and the perspective that would be most useful before any scope is agreed.',
  },
];
