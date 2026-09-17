export interface SectorImage {
  src: string;
  alt: string;
}

export interface Sector {
  name: string;
  description: string;
  image?: SectorImage;
}

export const industriesHero = {
  eyebrow: 'Industries',
  headlineLines: ['Deep knowledge.', 'Broader perspectives.'],
  lead: 'We bring cross-sector perspective, disciplined analysis and commercial understanding to help clients navigate complexity and evaluate opportunity with greater clarity.',
  image: {
    src: '/images/industries/industries-hero.webp',
    alt: 'Dark glass skyscraper with a sharp double-peaked crown rising into a dusk sky, lit windows glowing amber',
  },
  imageStatementLines: ['Sectors', 'Context', 'Clarity'],
};

export const industriesIntro = {
  eyebrow: 'Our Industries',
  headlineLines: ['Sector perspective for', 'a complex world.'],
  copy: 'DCL works across a diverse range of industries, combining commercial understanding, strategic insight and disciplined analysis to support better-informed decisions.',
  principles: ['Sector Understanding', 'Commercial Context', 'Independent Perspective'],
};

// One featured (largest), two medium, three compact-with-image, and six
// text-led rows - deliberately not a uniform 12-tile grid. Only the six
// sectors with real, sector-matched photography already in this project
// (public/images/industries/) get an image treatment; the other six are
// text-led editorial rows rather than paired with an unrelated stock
// photo and a misleading alt description.
export const industryDirectory = {
  featured: {
    name: 'Real Estate & Property',
    description: 'Advisory support across residential, commercial and real-asset opportunities.',
    image: { src: '/images/industries/sector-real-estate.webp', alt: 'Modern multi-story apartment buildings with balconies perched atop a rocky cliff edge under a clear blue sky' },
  } satisfies Sector,
  medium: [
    {
      name: 'Technology & AI',
      description: 'Strategic insight across technology, software and emerging digital sectors.',
      image: { src: '/images/industries/sector-technology.webp', alt: 'Close-up low-angle view of a blue mirrored glass office tower corner reflecting clouds in a grid pattern' },
    },
    {
      name: 'Financial Services',
      description: 'Insight across financial markets, asset management and related services.',
      image: { src: '/images/industries/sector-financial.webp', alt: 'Dense cluster of dark glass office towers with lit windows in a financial district at dusk' },
    },
  ] satisfies Sector[],
  compactImage: [
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
      name: 'Industrial & Manufacturing',
      description: 'Supporting growth, investment and transformation across industrial sectors.',
      image: { src: '/images/industries/sector-industrial.webp', alt: 'Row of large white cylindrical industrial storage tanks with catwalk railings against a clear blue sky' },
    },
  ] satisfies Sector[],
  textRows: [
    { name: 'Consumer & Retail', description: 'Perspective across consumer brands, retail models and changing demand.' },
    { name: 'Logistics & Supply Chain', description: 'Supporting investment and growth across logistics and supply networks.' },
    { name: 'Hospitality & Leisure', description: 'Commercial perspective across hospitality, travel and leisure businesses.' },
    { name: 'Natural Resources & Materials', description: 'Advisory support around resources, materials and related commercial decisions.' },
    { name: 'Professional & Business Services', description: 'Independent perspective across professional and business service providers.' },
    { name: 'Emerging & Special Situations', description: 'Analysis where evolving business models or unusual structures require closer scrutiny.' },
  ] satisfies Sector[],
};

export const disciplinedApproach = {
  label: 'Our Discipline',
  headlineLines: ['Different sectors.', 'One disciplined approach.'],
  copy: 'Across industries, our focus remains consistent: understanding fundamentals, evaluating risk, identifying opportunity and bringing greater clarity to complex decisions.',
  columns: [
    { name: 'Commercial Context', description: 'Understanding the market, positioning and environment surrounding the opportunity.' },
    { name: 'Market Dynamics', description: 'Reading demand, competition and the forces shaping the sector over time.' },
    { name: 'Risk & Resilience', description: 'Identifying uncertainties and dependencies capable of changing the outcome.' },
    { name: 'Strategic Opportunity', description: 'Considering how the opportunity fits a wider strategic objective.' },
  ],
};

export const crossSectorPerspective = {
  label: 'A Cross-Sector View',
  headlineLines: ['Perspective across', 'industries.'],
  copy: 'Many strategic and investment decisions sit at the intersection of sectors. We consider the wider commercial, financial and strategic context rather than viewing opportunities in isolation.',
  image: {
    src: '/images/industries/global-perspective.webp',
    alt: 'Aerial view of a dense downtown business district under an overcast sky with dozens of office towers',
  },
};

export const whereInsightMatters = {
  label: 'Where It Matters',
  headlineLines: ['Where sector insight', 'shapes the decision.'],
  items: ['Investment Evaluation', 'Market Entry', 'Strategic Growth', 'Acquisitions', 'Due Diligence', 'Risk Assessment', 'Private Capital', 'International Expansion'],
};

export const industriesFinalCta = {
  eyebrow: 'Start a Conversation',
  headlineLines: ['Your industry.', 'Our perspective.'],
  copy: 'Speak with DCL about an opportunity, strategic question or investment decision.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
