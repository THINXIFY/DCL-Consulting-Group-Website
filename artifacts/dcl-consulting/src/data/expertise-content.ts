export interface LensImage {
  src: string;
  alt: string;
}

export interface Lens {
  title: string;
  description: string;
  image: LensImage;
}

export interface CoreCapability {
  title: string;
  headline: string;
  copy: string;
  ctaLabel: string;
  href: string;
}

export interface ApplicationAreaImage {
  src: string;
  alt: string;
}

export interface ApplicationArea {
  title: string;
  description: string;
  href: string;
  image: ApplicationAreaImage;
}

export const expertiseHero = {
  label: 'Our Expertise',
  headlineLines: ['Expertise built', 'for clearer decisions.'],
  lead: 'DCL brings together investment consulting, strategic advisory, commercial analysis and independent decision support to help private and corporate clients navigate complex opportunities with greater clarity and confidence.',
  supporting: 'Independent perspective for a more complex world.',
  primaryCta: { label: 'Our Services', href: '/services' },
  secondaryCta: { label: 'Explore Our Expertise', href: '#four-lenses' },
  imageStatementLines: ['Different', 'perspectives.', 'A brighter', 'tomorrow.'],
};

export const fourLenses = {
  label: 'How We Add Perspective',
  headlineLines: ['Four lenses.', 'A clearer view.'],
  intro: 'DCL combines different forms of expertise to help clients evaluate what matters most before important investment, commercial and strategic decisions.',
  lenses: [
    {
      title: 'Commercial Analysis',
      description: 'Assessing business fundamentals, market dynamics and commercial potential.',
      image: { src: '/images/services/asset-portfolio-secondary.webp', alt: 'Angled close-up of a glass office tower facade with repeating vertical mullions' },
    },
    {
      title: 'Financial Review',
      description: 'Reviewing financial characteristics, economics, resilience and relevant assumptions.',
      image: { src: '/images/services/due-diligence-secondary.webp', alt: 'Close-up of a sandstone building facade with fine vertical fluting and sharp shadow lines' },
    },
    {
      title: 'Strategic Insight',
      description: 'Identifying options, testing assumptions and considering the broader strategic context.',
      image: { src: '/images/services/strategic-advisory-hero.webp', alt: 'Low-angle view of a diagrid glass facade catching warm evening light with a crescent moon visible' },
    },
    {
      title: 'Risk Evaluation',
      description: 'Understanding uncertainty, dependencies, downside factors and potential opportunities.',
      image: { src: '/images/services/risk-opportunity-hero.webp', alt: 'Silhouette of angled roof fins on a building against a dusk sky gradating from purple to orange' },
    },
  ] satisfies Lens[],
};

export const coreExpertise = {
  label: 'Our Core Expertise',
  headlineLines: ['Specialist expertise.', 'Real-world impact.'],
  intro: 'DCL brings together complementary advisory capabilities designed to support better-informed decisions across investment, strategy and complex commercial situations.',
  statementLines: ['Experience.', 'Perspective.', 'Results.'],
  capabilities: [
    {
      title: 'Investment Consulting',
      headline: 'Investment Consulting',
      copy: 'Independent advisory perspective around significant investment opportunities, commercial considerations, risk and strategic fit.',
      ctaLabel: 'Learn More',
      href: '/services/investment-consulting',
    },
    {
      title: 'Opportunity Analysis',
      headline: 'Opportunity Analysis',
      copy: 'A focused assessment of the commercial logic, market context and assumptions behind an opportunity, before it is taken further.',
      ctaLabel: 'View Our Services',
      href: '/services',
    },
    {
      title: 'Risk & Opportunity Assessment',
      headline: 'Risk & Opportunity Assessment',
      copy: 'Balanced analysis of potential upside alongside uncertainty, dependencies and the factors capable of changing an outcome.',
      ctaLabel: 'Learn More',
      href: '/services/risk-opportunity-assessment',
    },
    {
      title: 'Business & Financial Analysis',
      headline: 'Business & Financial Analysis',
      copy: 'Review of relevant business and financial considerations to help understand performance, economics and commercial viability.',
      ctaLabel: 'View Our Services',
      href: '/services',
    },
    {
      title: 'Strategic Advisory',
      headline: 'Strategic Advisory',
      copy: 'Independent perspective for businesses and investors considering growth, direction and significant strategic change.',
      ctaLabel: 'Learn More',
      href: '/services/strategic-advisory',
    },
    {
      title: 'Due Diligence Support',
      headline: 'Due Diligence Support',
      copy: 'Structured, independent review of relevant information, assumptions and dependencies before an important decision is made.',
      ctaLabel: 'Learn More',
      href: '/services/due-diligence-support',
    },
  ] satisfies CoreCapability[],
};

export const whereExpertiseApplies = {
  label: 'Where Our Expertise Applies',
  headlineLines: ['Across markets.', 'Across opportunities.'],
  copy: 'DCL applies its advisory perspective across a range of sectors, asset classes and strategic situations, from private capital and real estate to corporate growth, acquisitions and international expansion.',
  link: { label: 'View All Services', href: '/services' },
  areas: [
    {
      title: 'Private Capital',
      description: 'Independent perspective around private investment opportunities and strategic capital decisions.',
      href: '/services/private-capital-advisory',
      image: { src: '/images/services/private-capital-secondary.webp', alt: 'Dimly lit concrete stairway leading up to an illuminated glass entrance at night' },
    },
    {
      title: 'Real Estate',
      description: 'Commercial and strategic analysis around property and real-asset opportunities.',
      href: '/services/real-estate-investment-advisory',
      image: { src: '/images/services/real-estate-secondary-2.webp', alt: 'Close-up of a curved white concrete building facade with rounded glass bay windows' },
    },
    {
      title: 'Corporate Strategy',
      description: 'Support around growth, transformation and major strategic decisions.',
      href: '/services/strategic-advisory',
      image: { src: '/images/services/strategic-advisory-secondary.webp', alt: 'Elevated wide view of a city skyline and river at sunset with clusters of office towers' },
    },
    {
      title: 'Market Entry',
      description: 'Assessment of new markets, expansion opportunities and routes to growth.',
      href: '/services/market-entry-expansion-advisory',
      image: { src: '/images/services/market-entry-hero.webp', alt: 'Low-angle view of two glass skyscrapers connected by enclosed sky bridges' },
    },
    {
      title: 'M&A',
      description: 'Independent perspective across acquisitions and significant corporate transactions.',
      href: '/services/ma-acquisition-advisory',
      image: { src: '/images/services/ma-acquisition-secondary.webp', alt: 'Low-angle view of a cream stone building corner where two facades converge under a clear blue sky' },
    },
    {
      title: 'Cross-Border Opportunities',
      description: 'Strategic support around international markets and complex cross-border opportunities.',
      href: '/services',
      image: { src: '/images/industries/global-perspective.webp', alt: 'Aerial view of a dense downtown business district under an overcast sky with dozens of office towers' },
    },
  ] satisfies ApplicationArea[],
};

export const whyDclExpertise = {
  label: 'Why DCL Expertise',
  headlineLines: ['A more independent', 'perspective.'],
  copy: 'DCL combines specialist expertise with an independent mindset, helping clients focus on the factors that matter most and make better-informed decisions with greater clarity.',
  principles: [
    { name: 'Independent Perspective', description: "Objective analysis aligned with the client's goals." },
    { name: 'Analytical Discipline', description: 'Structured thinking and rigorous review.' },
    { name: 'Commercial Understanding', description: 'Real-world consideration of business and market context.' },
    { name: 'Clear Communication', description: 'Complex ideas presented in a clear and decision-focused way.' },
  ],
};

export const expertiseFinalCta = {
  label: "Let's Talk",
  headlineLines: ['Bring clarity', 'to what’s next.'],
  supporting: 'Speak with DCL about an investment, strategic or commercial decision and explore how independent expertise may support your next move.',
  primaryCta: { label: 'Discuss Your Goals', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closingLines: ['Different perspectives.', 'A brighter tomorrow.'],
};
