export interface SectorImage {
  src: string;
  alt: string;
}

export interface Sector {
  name: string;
  description: string;
  image?: SectorImage;
}

export interface EvaluationFactor {
  name: string;
  description: string;
}

export const industriesHero = {
  label: 'Industries',
  headlineLines: ['Different sectors.', 'A broader perspective.'],
  lead: 'DCL works across a range of industries, bringing independent perspective and commercial understanding to complex opportunities and strategic decisions.',
  primaryCta: { label: 'Explore Our Services', href: '/services' },
  secondaryCta: { label: 'Our Approach', href: '/approach' },
  imageStatementLines: ['Sectors', 'Ideas', 'People', 'Progress'],
};

export const ourIndustries = {
  label: 'Our Industries',
  headlineLines: ['Sector expertise', 'for real-world opportunities.'],
  supporting: 'DCL combines cross-sector perspective with commercial understanding, helping clients examine opportunities, challenges and important decisions within their wider industry context.',
  featured: [
    {
      name: 'Real Estate & Property',
      description: 'Advisory support across residential, commercial and real-asset opportunities.',
      image: { src: '/images/industries/sector-real-estate.webp', alt: 'Modern multi-story apartment buildings with balconies perched atop a rocky cliff edge under a clear blue sky' },
    },
    {
      name: 'Technology & AI',
      description: 'Strategic insight across technology, software and emerging digital sectors.',
      image: { src: '/images/industries/sector-technology.webp', alt: 'Close-up low-angle view of a blue mirrored glass office tower corner reflecting clouds in a grid pattern' },
    },
    {
      name: 'Healthcare & Life Sciences',
      description: 'Strategic insight across healthcare, pharmaceuticals and related industries.',
      image: { src: '/images/industries/sector-healthcare.webp', alt: 'Curved pale stone clinical research building exterior with large oval window openings' },
    },
    {
      name: 'Energy & Infrastructure',
      description: 'Advisory perspective on energy transition, resources and sustainable infrastructure.',
      image: { src: '/images/industries/sector-energy.webp', alt: 'Wind turbines and rows of solar panels spread across a valley floor with mountains in the background' },
    },
    {
      name: 'Financial Services',
      description: 'Insight across financial markets, asset management and related services.',
      image: { src: '/images/industries/sector-financial.webp', alt: 'Dense cluster of dark glass office towers with lit windows in a financial district at dusk' },
    },
    {
      name: 'Industrial & Manufacturing',
      description: 'Supporting growth, investment and transformation across industrial sectors.',
      image: { src: '/images/industries/sector-industrial.webp', alt: 'Row of large white cylindrical industrial storage tanks with catwalk railings against a clear blue sky' },
    },
  ] satisfies Sector[],
  compact: [
    { name: 'Consumer & Retail', description: 'Perspective across consumer brands, retail models and changing demand.' },
    { name: 'Logistics & Supply Chain', description: 'Supporting investment and growth across logistics and supply networks.' },
    { name: 'Hospitality & Leisure', description: 'Commercial perspective across hospitality, travel and leisure businesses.' },
    { name: 'Natural Resources & Materials', description: 'Advisory support around resources, materials and related commercial decisions.' },
    { name: 'Professional & Business Services', description: 'Independent perspective across professional and business service providers.' },
    { name: 'Emerging & Special Situations', description: 'Analysis where evolving business models or unusual structures require closer scrutiny.' },
  ] satisfies Sector[],
};

export const globalPerspective = {
  label: 'A Global Perspective',
  headlineLines: ['Opportunities', 'across borders.'],
  copy: 'DCL combines sector-aware analysis with broader commercial and strategic perspective, helping clients evaluate opportunities in local and international contexts.',
  cta: { label: 'Our Approach', href: '/approach' },
};

export const whatWeLookFor = {
  headlineLines: ['The sector changes.', 'The fundamentals still matter.'],
  factors: [
    { name: 'Market Context', description: 'Understand demand, positioning and the environment surrounding the opportunity.' },
    { name: 'Business Model', description: 'Consider how the business or opportunity creates value in practice.' },
    { name: 'Financial Fundamentals', description: 'Review the underlying economics, performance and relevant assumptions.' },
    { name: 'Competitive Position', description: 'Assess standing relative to comparable businesses and alternatives.' },
    { name: 'Risk & Dependencies', description: 'Identify uncertainties, dependencies and factors capable of changing the outcome.' },
    { name: 'Strategic Relevance', description: 'Consider how the opportunity fits the wider strategic objective.' },
  ] satisfies EvaluationFactor[],
};

export const whereSectorPerspectiveMatters = {
  headlineLines: ['Industry context matters', 'when the decision does.'],
  situations: ['Investment Opportunities', 'Acquisitions', 'Market Entry', 'Growth & Expansion', 'Strategic Partnerships', 'Business Assessment'],
};

export const industriesFinalCta = {
  headlineLines: ['A clearer view', 'of the opportunity.'],
  supporting: 'Discuss an opportunity with DCL and explore how independent analysis and sector-aware perspective may support your decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Expertise', href: '/expertise' },
  closing: 'Clarity Before Capital.',
};
