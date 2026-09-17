export type ExpertiseIcon = 'bar-chart' | 'building' | 'clipboard' | 'pie-chart';

export interface ExpertiseCapability {
  label: string;
  href: string;
}

export interface ExpertiseGroup {
  heading: string;
  copy: string;
  icon: ExpertiseIcon;
  capabilities: ExpertiseCapability[];
}

export interface ApproachStage {
  title: string;
  copy: string;
}

export interface IndustryItem {
  name: string;
  context: string;
  image: { src: string; alt: string };
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
  headlineLines: ['Clarity begins with', 'understanding.'] as [string, string],
  supporting: 'A considered perspective, for decisions that deserve one.',
  body: [
    'DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support.',
    'We help investors and businesses understand opportunities more clearly by examining commercial fundamentals, financial considerations, material risks, and strategic context.',
    'Our role is to bring shape to the uncertain. We combine rigorous research with commercial understanding to reveal what matters, what is missing, and what should happen next.',
    "Quietly independent and deliberately close to the work, we operate as a trusted extension of our clients' thinking.",
  ],
  cta: { label: 'Learn More', href: '/about' },
  microStatementLines: ['A clearer perspective', 'for a more certain tomorrow.'] as [string, string],
  image: {
    src: 'https://marbholding.com/wp-content/uploads/2026/09/about-dcl-home.webp',
    alt: 'DCL Consulting branded signage mounted on a marble office wall beside a glass-walled meeting room, with a branded notebook and pen on the desk in the foreground',
  },
  imageMicroLines: ['Insight', 'Perspective', 'Progress'] as [string, string, string],
  panel: {
    companyName: 'DCL Consulting and Investments Limited',
    facts: [
      { icon: 'building', label: 'Private limited company' },
      { icon: 'file', label: 'Registered in England and Wales' },
      { icon: 'hash', label: 'Company no. 10086906' },
    ] as { icon: 'building' | 'file' | 'hash'; label: string }[],
    statementLines: ['A stronger tomorrow', 'through deeper understanding.'] as [string, string],
  },
};

export const servicesSection = {
  eyebrow: 'Our Services',
  headlineLines: ["Expertise for", "what's next."] as [string, string],
  supporting: 'Independent advisory perspective across investment, real assets, corporate strategy and complex decision-making.',
  cta: { label: 'Explore All Services', href: '/services' },
  microLabel: 'Four areas. A clearer perspective.',
  sideMicroLines: ['Perspective', 'Discipline', 'Better decisions'] as [string, string, string],
  bottomMicroLines: ['Complex questions.', 'A clearer path.'] as [string, string],
  backgroundImage: 'https://marbholding.com/wp-content/uploads/2026/09/ChatGPT-Image-Sep-17-2026-10_28_08-AM.webp',
  familyIcons: {
    'Investment & Private Capital': 'https://marbholding.com/wp-content/uploads/2026/09/profit.png',
    'Real Estate & Assets': 'https://marbholding.com/wp-content/uploads/2026/09/residential.png',
    'Corporate & Strategic': 'https://marbholding.com/wp-content/uploads/2026/09/workplace.png',
    'Analysis & Decision Support': 'https://marbholding.com/wp-content/uploads/2026/09/analysis.png',
  } as Record<string, string>,
};

export const expertiseSection = {
  eyebrow: 'Our Expertise',
  headlineLines: ["Expertise for", "what's next."] as [string, string],
  body: 'Independent, disciplined perspective across investment, real assets, corporate strategy and complex decision-making.',
  cta: { label: 'Explore All Expertise', href: '/expertise' },
  microLabel: 'Four areas. A clearer perspective.',
  groups: [
    {
      heading: 'Investment & Private Capital',
      copy: 'Independent perspective around significant investment and capital decisions.',
      icon: 'bar-chart',
      capabilities: [
        { label: 'Investment Consulting', href: '/services/investment-consulting' },
        { label: 'Asset & Portfolio Advisory', href: '/services/asset-portfolio-advisory' },
        { label: 'Wealth Strategy Advisory', href: '/services/wealth-strategy-advisory' },
        { label: 'Private Capital Advisory', href: '/services/private-capital-advisory' },
      ],
    },
    {
      heading: 'Real Estate & Assets',
      copy: 'Commercial and strategic perspective around real estate opportunities.',
      icon: 'building',
      capabilities: [{ label: 'Real Estate Investment Advisory', href: '/services/real-estate-investment-advisory' }],
    },
    {
      heading: 'Corporate & Strategic',
      copy: 'Independent analysis around growth, transactions and strategic change.',
      icon: 'clipboard',
      capabilities: [
        { label: 'Strategic Advisory', href: '/services/strategic-advisory' },
        { label: 'M&A & Acquisition Advisory', href: '/services/ma-acquisition-advisory' },
        { label: 'Market Entry & Expansion Advisory', href: '/services/market-entry-expansion-advisory' },
      ],
    },
    {
      heading: 'Analysis & Decision Support',
      copy: 'Structured, independent review ahead of important decisions.',
      icon: 'pie-chart',
      capabilities: [
        { label: 'Due Diligence Support', href: '/services/due-diligence-support' },
        { label: 'Risk & Opportunity Assessment', href: '/services/risk-opportunity-assessment' },
      ],
    },
  ] satisfies ExpertiseGroup[],
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
  {
    name: 'Real Estate & Property',
    context: 'Advisory support across residential, commercial and real-asset opportunities.',
    image: { src: '/images/industries/sector-real-estate.webp', alt: 'Modern multi-story apartment buildings with balconies perched atop a rocky cliff edge under a clear blue sky' },
  },
  {
    name: 'Technology & AI',
    context: 'Strategic insight across technology, software and emerging digital sectors.',
    image: { src: '/images/industries/sector-technology.webp', alt: 'Close-up low-angle view of a blue mirrored glass office tower corner reflecting clouds in a grid pattern' },
  },
  {
    name: 'Healthcare & Life Sciences',
    context: 'Strategic insight across healthcare, pharmaceuticals and related industries.',
    image: { src: '/images/industries/sector-healthcare.webp', alt: 'Curved pale stone clinical research building exterior with large oval window openings' },
  },
  {
    name: 'Energy & Infrastructure',
    context: 'Advisory perspective on energy transition, resources and sustainable infrastructure.',
    image: { src: '/images/industries/sector-energy.webp', alt: 'Wind turbines and rows of solar panels spread across a valley floor with mountains in the background' },
  },
  {
    name: 'Financial Services',
    context: 'Insight across financial markets, asset management and related services.',
    image: { src: '/images/industries/sector-financial.webp', alt: 'Dense cluster of dark glass office towers with lit windows in a financial district at dusk' },
  },
  {
    name: 'Industrial & Manufacturing',
    context: 'Supporting growth, investment and transformation across industrial sectors.',
    image: { src: '/images/industries/sector-industrial.webp', alt: 'Row of large white cylindrical industrial storage tanks with catwalk railings against a clear blue sky' },
  },
];

export const industriesSection = {
  eyebrow: 'Industries',
  headlineLines: ['Insight across', 'every sector.'] as [string, string],
  supporting: 'We evaluate opportunities on their own fundamentals, not a fixed sector template, so our perspective travels wherever the work takes us.',
  cta: { label: 'View All Industries', href: '/industries' },
  microLines: ['Real insight', 'Real opportunity', 'A clearer tomorrow'] as [string, string, string],
  backgroundImage: 'https://marbholding.com/wp-content/uploads/2026/09/ChatGPT-Image-Sep-17-2026-10_52_45-AM.png',
};

export type QualityIcon = 'eye' | 'bar-chart' | 'layers' | 'message' | 'globe';

export interface QualityItem {
  title: string;
  copy: string;
  icon: QualityIcon;
}

export interface CompanyFact {
  label: string;
  value: string;
}

export const whyDcl: QualityItem[] = [
  {
    title: 'Independent Perspective',
    copy: 'Advice shaped by the facts of the situation, not by product, platform or third-party relationship.',
    icon: 'eye',
  },
  {
    title: 'Analytical Discipline',
    copy: 'A structured approach that tests assumptions and looks past the surface of an opportunity.',
    icon: 'bar-chart',
  },
  {
    title: 'Commercial Understanding',
    copy: 'Perspective grounded in how businesses, markets and transactions actually work.',
    icon: 'layers',
  },
  {
    title: 'Clear Communication',
    copy: 'Analysis translated into a perspective that is clear, direct and genuinely useful.',
    icon: 'message',
  },
  {
    title: 'Long-Term Thinking',
    copy: 'A perspective weighed against what matters beyond the immediate decision.',
    icon: 'globe',
  },
];

export const whyDclImage = {
  src: '/images/home/home-why-dcl.webp',
  alt: 'Angular white building facade with a diamond geometric cladding pattern against a blue sky',
};

export const whyDclSection = {
  eyebrow: 'Why DCL',
  headlineLines: ['A disciplined way', 'to see the decision.'] as [string, string],
  body: "DCL's approach is designed around clarity, independence and disciplined evaluation, focusing attention on the factors that matter most.",
  cta: { label: 'Our Approach', href: '/approach' },
  microLines: ['Insight', 'Perspective', 'Progress'] as [string, string, string],
  microStatementLines: ['A clearer tomorrow', 'through deeper understanding.'] as [string, string],
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
