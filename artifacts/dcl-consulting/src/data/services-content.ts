import { allMegaMenuServices } from './services-nav-content';

export interface DirectoryService {
  label: string;
  href: string;
}

export interface DirectoryFamilyImage {
  src: string;
  alt: string;
}

export interface DirectoryFamily {
  heading: string;
  line: string;
  image: DirectoryFamilyImage;
  services: DirectoryService[];
}

export interface WorkStage {
  name: string;
  description: string;
}

export interface Principle {
  name: string;
}

export interface FeaturedServiceImage {
  src: string;
  alt: string;
}

export interface FeaturedService {
  title: string;
  supporting: string;
  href: string;
  image: FeaturedServiceImage;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const servicesHero = {
  label: 'Independent Perspective. Lasting Value.',
  headline: 'Services',
  lead: 'Independent perspective across investment, assets, strategy and complex decision-making.',
  supporting: 'We help individuals, families, investors and organisations navigate important decisions with greater clarity, commercial understanding and confidence.',
  primaryCta: { label: 'Discuss Your Goals', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '#service-directory' },
  vocabulary: ['People', 'Perspective', 'Possibilities'],
  imageStatementLines: ['A more considered', 'tomorrow.'],
};

export const serviceDirectoryIntro = {
  label: 'Our Services',
  headlineLines: ['Expertise for', "what's next."],
  supporting:
    'We provide considered, independent advisory perspective across investment, real assets, corporate strategy and complex decision-making, tailored to the context and designed to support better long-term decisions.',
  statementLines: ['Different perspectives.', 'A clearer way forward.'],
};

export const serviceDirectory = {
  families: [
    {
      heading: 'Investment & Private Capital',
      line: 'Capital. Perspective. Opportunity.',
      image: { src: '/images/services/investment-consulting-hero.webp', alt: 'Upward view of a sharp-cornered glass office tower against a pale sky with visible geometric setbacks' },
      services: [
        { label: 'Investment Consulting', href: '/services/investment-consulting' },
        { label: 'Asset & Portfolio Advisory', href: '/services/asset-portfolio-advisory' },
        { label: 'Wealth Strategy Advisory', href: '/services/wealth-strategy-advisory' },
        { label: 'Private Capital Advisory', href: '/services/private-capital-advisory' },
      ],
    },
    {
      heading: 'Real Estate & Assets',
      line: 'Real assets. Real opportunities.',
      image: { src: '/images/services/real-estate-hero.webp', alt: 'Low-angle view of a tall blue-glass high-rise building against a cloudy sky, with an older building beside it' },
      services: [{ label: 'Real Estate Investment Advisory', href: '/services/real-estate-investment-advisory' }],
    },
    {
      heading: 'Corporate & Strategic',
      line: 'Strategy for a more resilient tomorrow.',
      image: { src: '/images/services/strategic-advisory-secondary.webp', alt: 'Elevated wide view of a city skyline and river at sunset with clusters of office towers among older rooftops' },
      services: [
        { label: 'Strategic Advisory', href: '/services/strategic-advisory' },
        { label: 'M&A & Acquisition Advisory', href: '/services/ma-acquisition-advisory' },
        { label: 'Market Entry & Expansion Advisory', href: '/services/market-entry-expansion-advisory' },
      ],
    },
    {
      heading: 'Analysis & Decision Support',
      line: 'Insight. Objectivity. Confidence.',
      image: { src: '/images/services/due-diligence-hero.webp', alt: 'Close-up of a building corner where grey stone masonry meets a smooth aluminum panel edge under an overcast sky' },
      services: [
        { label: 'Due Diligence Support', href: '/services/due-diligence-support' },
        { label: 'Risk & Opportunity Assessment', href: '/services/risk-opportunity-assessment' },
      ],
    },
  ] satisfies DirectoryFamily[],
};

export const howWeWork = {
  label: 'Our Approach',
  headlineLines: ['How we support', 'your decision-making.'],
  supporting: 'A disciplined and collaborative approach, bringing greater structure and clarity to complex decisions.',
  statementLines: ['Insight today.', 'Opportunity tomorrow.'],
  stages: [
    { name: 'Understand', description: 'We take the time to understand your goals, context and constraints.' },
    { name: 'Analyse', description: 'We apply relevant expertise to identify the factors that matter most.' },
    { name: 'Evaluate', description: 'We assess options, risks and opportunities with objectivity and a long-term perspective.' },
    { name: 'Advise', description: 'We communicate a clear, independent perspective designed to support the next decision.' },
  ] satisfies WorkStage[],
};

export const whyChooseDcl = {
  label: 'Why Clients Choose DCL',
  headlineLines: ['A more independent', 'perspective.'],
  body: "Clients work with DCL for independent thinking, commercial understanding and a disciplined approach to significant decisions. We focus on clarity, relevance and the factors that matter most to the client's objectives.",
  cta: { label: 'Our Approach', href: '/approach' },
  principles: ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication', 'Long-Term Thinking'] satisfies string[],
};

export const selectedServices = {
  label: 'Selected Services',
  headlineLines: ['In', 'focus.'],
  supporting: 'A closer look at some of the areas where DCL supports significant decisions.',
  link: { label: 'View All Services', href: '#service-directory' },
  featured: [
    {
      title: 'Investment Consulting',
      supporting: 'Clarify opportunities. Make more confident decisions.',
      href: '/services/investment-consulting',
      image: { src: '/images/general/services-selected-1.webp', alt: 'Dark glass high-rise tower photographed from a low angle against a blue sky' },
    },
    {
      title: 'M&A & Acquisition Advisory',
      supporting: 'Independent advice for significant transactions.',
      href: '/services/ma-acquisition-advisory',
      image: { src: '/images/general/services-selected-2.webp', alt: 'Curved glass-clad building wing meeting a rectilinear stone-and-glass building block at dusk' },
    },
    {
      title: 'Real Estate Investment Advisory',
      supporting: 'Strategic guidance across real estate opportunities.',
      href: '/services/real-estate-investment-advisory',
      image: { src: '/images/general/services-selected-3.webp', alt: 'Cream stone institutional building corner with rounded window bays photographed against a blue sky' },
    },
  ] satisfies FeaturedService[],
};

export const servicesFaq = {
  label: 'Client Questions',
  headlineLines: ['Frequently asked', 'questions.'],
  intro: "Straight answers to common questions about DCL's services, approach and how we work.",
  items: [
    {
      question: 'What types of clients does DCL work with?',
      answer: 'DCL works with individuals, families, private investors, businesses and organisations seeking independent perspective on significant investment, commercial or strategic decisions.',
    },
    {
      question: 'What types of decisions can DCL support?',
      answer: 'We support decisions across investment, real estate, private capital, corporate strategy, transactions, market expansion and situations requiring closer analysis or independent review.',
    },
    {
      question: 'Does DCL work across different industries?',
      answer: 'Yes. Our advisory perspective is applied across a broad range of sectors, with the scope of each engagement shaped by the specific decision and context involved.',
    },
    {
      question: 'Can DCL support cross-border or international opportunities?',
      answer: 'Yes. We regularly support clients evaluating opportunities, expansion plans and decisions that extend across multiple markets and jurisdictions.',
    },
    {
      question: 'How does DCL maintain an independent perspective?',
      answer: 'DCL operates as an independent advisory business. Our recommendations are shaped by the facts of each situation rather than any product, platform or third-party relationship.',
    },
    {
      question: 'Does DCL manage assets or execute investments?',
      answer: 'No. DCL is an independent advisory business. Our role is to provide analysis and perspective, not to hold client assets or make investment decisions on a client’s behalf.',
    },
    {
      question: 'How does an engagement typically begin?',
      answer: 'Most engagements begin with an initial conversation to understand the decision, the context and the perspective that would be most useful before any scope is agreed.',
    },
  ] satisfies FaqItem[],
  sideCta: { label: 'Still Have a Question?', headline: "We're here to help.", cta: { label: 'Get in Touch', href: '/#about' } },
};

export const servicesFinalCta = {
  label: "Let's Talk",
  headlineLines: ['Bring clarity to', 'the next decision.'],
  supporting: 'A conversation today can open up a clearer perspective on what comes next.',
  primaryCta: { label: 'Discuss Your Goals', href: '/#about' },
};

export interface Service {
  slug: string;
  name: string;
  description: string;
}

// Used only by the generic /services/:slug fallback for any route not
// already matched by one of the ten dedicated service pages registered
// in App.tsx - sourced from the mega-menu data so the approved name and
// description are never duplicated or allowed to drift out of sync.
export const allServices: Service[] = allMegaMenuServices.map((service) => ({
  slug: service.href.split('/').pop()!,
  name: service.label,
  description: service.description,
}));
