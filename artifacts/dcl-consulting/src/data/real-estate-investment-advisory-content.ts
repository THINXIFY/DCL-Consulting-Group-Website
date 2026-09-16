export interface LabeledItem {
  name: string;
  description: string;
}

export const realEstateHero = {
  label: 'Real Assets. Real Perspective.',
  headlineLines: ['Real Estate', 'Investment Advisory'],
  supporting:
    'Independent perspective for investors and businesses evaluating property and real-estate opportunities through commercial, financial and strategic analysis.',
  cta: { label: 'Discuss Your Objectives', href: '/#about' },
  keywords: ['Market', 'Fundamentals', 'Risk', 'Strategic Value'],
  imageStatementLines: ['More than property.', 'A broader perspective', 'on what is possible.'],
};

export const ourPerspective = {
  label: 'Our Perspective',
  headlineLines: ['Value goes', 'beyond the asset.'],
  body: [
    'Real estate is more than a physical asset. Its investment potential is shaped by market conditions, location, commercial fundamentals, capital requirements, operating characteristics and strategic relevance.',
    'DCL brings an independent perspective to these factors to help clients develop a clearer understanding of the opportunity before significant decisions are made.',
  ],
  link: { label: 'Our Approach', href: '/approach' },
  statementLines: ['Different perspectives.', 'Stronger decisions.'],
  microCopy: 'Independent thinking for more considered real-estate decisions.',
};

export const whatWeAssess = {
  label: 'What We Assess',
  headlineLines: ['A holistic view', 'of opportunity.'],
  areas: [
    {
      name: 'Market & Location',
      description: 'Assess market dynamics, location fundamentals, demand conditions and the wider environment surrounding the opportunity.',
    },
    {
      name: 'Commercial Fundamentals',
      description: 'Examine income potential, occupancy or utilisation, competitive positioning, business logic and relevant operating assumptions.',
    },
    {
      name: 'Capital & Operations',
      description: 'Consider capital requirements, operating efficiency, development implications and factors influencing commercial performance.',
    },
    {
      name: 'Strategic Value',
      description: 'Evaluate how the asset or opportunity fits within the wider investment objective and long-term decision.',
    },
  ] satisfies LabeledItem[],
};

export const howWeEvaluate = {
  label: 'How We Evaluate Opportunities',
  headlineLines: ['A disciplined', 'and independent', 'process.'],
  intro: 'DCL combines market perspective, commercial analysis, financial considerations and strategic judgement to evaluate real-estate opportunities with greater clarity.',
  rows: [
    { name: 'Understand the Opportunity', description: 'Examine the asset, market and strategic context.' },
    { name: 'Challenge Assumptions', description: 'Test the assumptions and dependencies supporting the initial case.' },
    { name: 'Analyse the Fundamentals', description: 'Focus on economics, operating characteristics and commercial reality.' },
    { name: 'Consider the Wider Picture', description: 'Assess how the opportunity fits the broader investment objective.' },
    { name: 'Communicate the View', description: 'Bring the analysis together into a clear decision-focused perspective.' },
  ] satisfies LabeledItem[],
};

export const commercialFinancial = {
  label: 'Commercial & Financial Considerations',
  headlineLines: ['Insight that supports', 'better investment decisions.'],
  body: 'DCL examines the commercial and financial considerations that may materially influence value, performance, risk and the long-term investment case.',
  list: [
    'Income and return potential',
    'Occupier demand and leasing dynamics',
    'Development and asset repositioning considerations',
    'Capital structure and financing considerations',
    'Operating costs and efficiency',
    'Long-term value and exit scenarios',
  ],
};

export const riskDueDiligence = {
  label: 'Risk & Due Diligence',
  headlineLines: ['A deeper look', 'to reduce uncertainty.'],
  body: 'Real-estate opportunities can be influenced by market, commercial, operational, development and structural factors. DCL helps bring greater structure to the issues that deserve closer scrutiny before a significant decision.',
  list: [
    'Market and planning considerations',
    'Technical and environmental considerations',
    'Legal and structural considerations',
    'Development and execution dependencies',
    'Operating and commercial risks',
    'Key assumptions requiring further scrutiny',
  ],
};

export const whereWeSupport = {
  label: 'Where We Can Support',
  headlineLines: ['Across the real-estate', 'investment lifecycle.'],
  areas: [
    { name: 'Acquisitions', description: 'Independent perspective when evaluating potential property or real-estate investments.' },
    { name: 'Investment Review', description: 'Structured assessment of existing or prospective real-estate opportunities.' },
    { name: 'Portfolio Decisions', description: 'Strategic perspective around individual assets within a wider portfolio context.' },
    { name: 'Development Opportunities', description: 'Assessment of development or repositioning opportunities and associated commercial considerations.' },
    { name: 'Strategic Property Decisions', description: 'Independent perspective around complex or significant real-estate decisions.' },
  ] satisfies LabeledItem[],
};

export const whyDcl = {
  label: 'Why DCL',
  headlineLines: ['A considered partner', 'in real-estate decision-making.'],
  body: 'DCL combines independent perspective, disciplined analysis and commercial understanding to help clients develop a clearer view of significant real-estate opportunities and decisions.',
  principles: ['Independent Perspective', 'Disciplined Analysis', 'Commercial Understanding', 'Clear Communication'],
};

export const realEstateFinalCta = {
  smallLines: ['Real Perspective.', 'Real Progress.'],
  headlineLines: ['Bring greater clarity', 'to the next real-estate decision.'],
  supporting: 'Discuss a real-estate investment opportunity, asset review or strategic property decision with DCL and explore how independent analysis may support the next step.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
};
