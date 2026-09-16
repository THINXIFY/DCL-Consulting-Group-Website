export interface LabeledItem {
  name: string;
  description: string;
}

export const marketHero = {
  label: 'New Markets. Greater Possibilities.',
  headlineLines: ['Market Entry &', 'Expansion Advisory'],
  intro: 'Independent advisory support to help businesses evaluate new markets, expansion opportunities and international growth strategies.',
  cta: { label: 'Discuss an Opportunity', href: '/#about' },
  keywords: ['Markets', 'Growth', 'Expansion', 'Opportunity'],
  imageStatementLines: ['Expand', 'with insight.', 'Grow with purpose.'],
};

export const marketOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['New markets.', 'A stronger tomorrow.'],
  body: [
    'Entering new markets or expanding into new regions requires more than ambition. It requires a clear understanding of the opportunity, competitive environment, commercial realities, operational requirements and factors capable of influencing long-term success.',
    'DCL provides independent perspective to help clients evaluate expansion opportunities with greater structure and clarity.',
  ],
  statementLines: ['Local insight.', 'Global perspective.', 'Real opportunity.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfMarketEntry = {
  label: 'Key Areas of Market Entry & Expansion',
  headlineLines: ['Building a stronger', 'route to market.'],
  areas: [
    { name: 'Market Assessment', description: 'Evaluate market attractiveness, competitive dynamics, demand conditions and relevant regulatory considerations.' },
    { name: 'Entry Strategy', description: 'Consider the most appropriate route to market based on objectives, commercial realities and available options.' },
    { name: 'Operational Readiness', description: 'Assess capabilities, resources, operating requirements and challenges relevant to successful market entry.' },
    { name: 'Growth & Scaling', description: 'Identify opportunities to establish, scale and strengthen a market position over time.' },
  ] satisfies LabeledItem[],
};

export const marketOurApproach = {
  label: 'Our Approach',
  headlineLines: ['From opportunity', 'to sustainable growth.'],
  body: 'DCL helps clients assess, plan and prepare for market-entry and expansion opportunities through a structured, commercially grounded approach.',
  rows: [
    { name: 'Define the Opportunity', description: 'Clarify the target market, strategic objective and commercial ambition.' },
    { name: 'Analyse the Market', description: 'Evaluate demand, competition, market structure, barriers and material success factors.' },
    { name: 'Develop an Entry Strategy', description: 'Consider appropriate routes to market, partnerships, operating models and implementation options.' },
    { name: 'Support Execution', description: 'Provide ongoing advisory perspective as the expansion plan progresses.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Approach', href: '/approach' },
};

export const marketAreasOfFocus = {
  label: 'Areas of Focus',
  headlineLines: ['Where growth', 'can take shape.'],
  areas: [
    { name: 'Geographic Expansion', description: 'Support entry into new regions and international markets.' },
    { name: 'Strategic Market Entry', description: 'Assessment of market opportunities, strategic fit and routes to market.' },
    { name: 'Business Expansion', description: 'Advisory perspective around significant growth, diversification and expansion initiatives.' },
    { name: 'Local Partnerships', description: 'Evaluation of potential strategic partners, alliances and joint opportunities.' },
  ] satisfies LabeledItem[],
};

export const marketWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['A strategic partner', 'for what’s next.'],
  body: 'DCL combines broader strategic perspective with commercial understanding to help clients evaluate expansion opportunities and navigate complexity with greater confidence.',
  principles: ['Global Perspective', 'Commercial Understanding', 'Strategic Focus', 'Long-Term Value'],
};

export const marketFinalCta = {
  smallLine: "Let's Discuss Your Expansion Plans",
  headlineLines: ['New markets.', 'Greater possibilities.'],
  supporting: 'Speak with DCL about your expansion objectives and explore how independent perspective may support the next stage.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Markets', 'Insight', 'Growth', 'Progress'],
};
