// Editorial commentary written for this page's launch, not verified
// published research. Deliberately no author bylines, no publication
// dates and no statistics - this project does not have real dated
// articles yet (see the homepage's `insights` export in
// `home-content.ts` for the same discipline applied elsewhere). Replace
// these entries with real published pieces as they become available;
// the shape below (category/title/excerpt/slug, optional image) is
// designed to be a drop-in replacement.

export interface InsightImage {
  src: string;
  alt: string;
}

export interface InsightItem {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  image?: InsightImage;
}

export type PerspectiveVariant = 'wide' | 'vertical' | 'text' | 'image';

export const insightsHero = {
  eyebrow: 'Insights',
  headlineLines: ['Perspective for', 'better decisions.'],
  lead: 'Independent thinking on investment, strategy, markets, risk and the forces shaping long-term opportunity.',
  image: {
    src: '/images/general/expertise-hero.webp',
    alt: 'Dark geometric roofline of angled architectural fins silhouetted against a dusk sky',
  },
};

export const featuredInsight: InsightItem = {
  slug: 'private-capital-discipline-in-uncertain-cycles',
  category: 'Private Capital',
  title: 'Where private capital finds discipline in uncertain cycles.',
  excerpt:
    'As liquidity conditions shift, the sharpest allocators return to fundamentals: patient structuring, realistic underwriting, and a clear view of downside risk before upside.',
  image: {
    src: '/images/general/contact-company-meeting.webp',
    alt: 'Four senior professionals in a strategic discussion around financial data displays in a modern office',
  },
};

export const latestPerspectives: Array<InsightItem & { variant: PerspectiveVariant }> = [
  {
    variant: 'wide',
    slug: 'market-entry-is-a-governance-question',
    category: 'Market Entry',
    title: 'Entering a new market is a governance question before it is a growth question.',
    excerpt:
      'The businesses that scale internationally with the fewest surprises are the ones that resolve structure, control and accountability before they resolve growth targets.',
    image: {
      src: '/images/services/market-entry-secondary.webp',
      alt: 'Symmetrical low-angle view of several glass skyscrapers converging toward a bright sky',
    },
  },
  {
    variant: 'vertical',
    slug: 'better-questions-not-more-of-them',
    category: 'Risk & Opportunity',
    title: 'The best risk frameworks ask better questions, not just more of them.',
    excerpt: 'Comprehensive is not the same as useful. A short list of the right questions, asked early, tends to outperform an exhaustive checklist asked late.',
    image: {
      src: '/images/services/risk-opportunity-secondary.webp',
      alt: 'Building facade split between dark shadow and warm golden sunlight on vertical fins',
    },
  },
  {
    variant: 'vertical',
    slug: 'diligence-that-looks-past-the-deal',
    category: 'M&A',
    title: 'Diligence that looks past the deal, to the business it becomes.',
    excerpt: 'The transaction is a moment. Integration, culture and capital structure determine whether the value identified in diligence is ever actually realised.',
    image: {
      src: '/images/services/ma-acquisition-secondary.webp',
      alt: 'Low-angle view of a cream stone building corner where two facades converge under a clear blue sky',
    },
  },
  {
    variant: 'text',
    slug: 'strategy-is-trade-offs-made-in-the-open',
    category: 'Strategic Advisory',
    title: 'Strategy is a series of trade-offs made in the open, not a document made in private.',
    excerpt: 'A strategy that cannot be explained plainly to the people expected to execute it rarely survives contact with reality.',
  },
  {
    variant: 'image',
    slug: 'real-assets-reward-patience',
    category: 'Real Estate',
    title: 'Real assets reward patience more consistently than they reward conviction alone.',
    excerpt: 'Conviction gets capital into a position. Patience, and a clear-eyed view of the holding period, is usually what gets it back out again.',
    image: {
      src: '/images/services/real-estate-secondary-2.webp',
      alt: 'Close-up of a curved white concrete building facade with rounded glass bay windows',
    },
  },
];

export const insightThemes: string[] = ['Investment', 'Strategy', 'Private Capital', 'Real Estate', 'Markets', 'Risk', 'Transactions', 'International Growth'];

export const dclViewpoint = {
  label: 'The DCL Viewpoint',
  headlineLines: ['Clarity begins with', 'the right questions.'],
  copy: 'Our insights are designed to help investors and decision-makers examine opportunity with greater context, discipline and perspective.',
  links: [
    { label: 'Our Approach', href: '/approach' },
    { label: 'Our Expertise', href: '/expertise' },
  ],
  image: {
    src: '/images/home/home-about-architecture.webp',
    alt: 'Board-formed concrete building corner with an angular roofline against a deep blue sky',
  },
};

// Full archive - a superset of the items already surfaced above, plus a
// couple more, so nothing needs to be duplicated by hand. Rendered as a
// plain rule-divided list, not cards.
export const insightsArchive: InsightItem[] = [
  featuredInsight,
  ...latestPerspectives.map(({ variant: _variant, ...item }) => item),
  {
    slug: 'independent-analysis-where-consensus-feels-comfortable',
    category: 'Investment Perspective',
    title: 'Independent analysis is most valuable exactly where consensus feels comfortable.',
    excerpt: 'Alignment across a room is not evidence of a sound decision. It is often a signal that the harder questions have not yet been asked.',
  },
  {
    slug: 'headline-numbers-rarely-show-where-the-risk-sits',
    category: 'Business & Financial Analysis',
    title: 'The headline numbers rarely tell you where the risk is sitting.',
    excerpt: 'Structural assumptions buried in a model deserve as much scrutiny as the figures on its surface.',
  },
];

export const insightsFinalCta = {
  eyebrow: 'Start a Conversation',
  headlineLines: ['Turn perspective into', 'clearer decisions.'],
  copy: 'Speak with DCL about an opportunity, strategic question or investment decision.',
  cta: { label: 'Contact DCL', href: '/contact' },
};
