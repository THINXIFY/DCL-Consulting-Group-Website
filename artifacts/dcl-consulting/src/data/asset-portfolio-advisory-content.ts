export interface LabeledItem {
  name: string;
  description: string;
}

export const assetPortfolioHero = {
  label: 'Portfolio Perspective',
  headlineLines: ['Asset & Portfolio', 'Advisory'],
  intro: 'Strategic perspective around assets and portfolios, including underlying fundamentals, concentration, risk considerations and broader investment objectives.',
  cta: { label: 'Discuss Your Portfolio', href: '/#about' },
  keywords: ['Assets', 'Portfolios', 'Risk', 'Resilience'],
  imageStatementLines: ['A more complete view', 'of your portfolio.'],
};

export const assetOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['More than individual assets.', 'A broader perspective.'],
  body: [
    'Effective portfolio decisions require a clear understanding of individual assets, sectors and markets, how they work together and how they align with wider investment objectives.',
    'DCL provides independent advisory perspective to help clients examine assets and portfolios through a broader commercial, strategic and risk-aware lens.',
  ],
  statementLines: ['A more connected', 'perspective for', 'long-term value.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfAdvisory = {
  label: 'Key Areas of Advisory',
  headlineLines: ['Supporting stronger', 'portfolio decisions.'],
  areas: [
    { name: 'Portfolio Structure', description: 'Consider asset composition, diversification, concentration and the overall shape of the portfolio.' },
    { name: 'Asset Quality', description: 'Evaluate underlying fundamentals, commercial characteristics, performance drivers and long-term potential.' },
    { name: 'Risk Considerations', description: 'Consider concentration, exposure, downside scenarios, dependencies and asset-specific uncertainty.' },
    { name: 'Strategic Objectives', description: 'Align portfolio considerations with wider investment priorities and long-term goals.' },
  ] satisfies LabeledItem[],
};

export const analyticalApproach = {
  label: 'Our Analytical Approach',
  headlineLines: ['A structured process', 'for better decisions.'],
  body: 'DCL reviews portfolios and underlying assets through a commercial and strategic lens, helping identify opportunities, risks and factors relevant to long-term portfolio resilience.',
  rows: [
    { name: 'Review Portfolio Objectives', description: 'Understand objectives, constraints, priorities and key considerations.' },
    { name: 'Analyse Assets & Exposures', description: 'Evaluate asset fundamentals, portfolio composition and concentration.' },
    { name: 'Assess Risks & Opportunities', description: 'Consider market, sector and asset-specific factors that may influence outcomes.' },
    { name: 'Develop Strategic Insights', description: 'Identify options, priorities and areas deserving further attention.' },
    { name: 'Support Implementation', description: 'Provide clear advisory perspective around the next stage of decision-making.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Process', href: '/approach' },
};

export const portfolioConsiderations = {
  label: 'Portfolio Considerations',
  headlineLines: ['A more complete', 'view of value.'],
  body: 'DCL considers the factors that can influence portfolio performance, resilience and strategic relevance across different market conditions.',
  list: [
    'Asset allocation and diversification considerations',
    'Sector and geographic exposure',
    'Liquidity and capital efficiency',
    'Income and return considerations',
    'Risk management and downside scenarios',
    'Long-term value creation',
  ],
  cta: { label: 'Discuss Your Portfolio', href: '/#about' },
};

export const assetWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['Independent insight', 'for long-term perspective.'],
  body: 'DCL combines analytical review with commercial understanding to help clients make more informed portfolio and asset decisions.',
  principles: ['Independent Perspective', 'Portfolio Focus', 'Risk Aware Approach', 'Long-Term Thinking'],
};

export const assetFinalCta = {
  smallLine: "Let's Discuss Your Portfolio",
  headlineLines: ['A clearer path', 'to long-term value.'],
  supporting: 'Speak with DCL about your portfolio or asset considerations and explore how an independent advisory perspective may support longer-term objectives.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
};
