export interface LabeledItem {
  name: string;
  description: string;
}

export const riskHero = {
  label: 'A Clearer Perspective',
  headlineLines: ['Risk & Opportunity', 'Assessment'],
  intro: 'Independent analysis to help businesses and investors understand key risks, evaluate opportunities and make more confident decisions.',
  cta: { label: 'Discuss Your Requirements', href: '/#about' },
  keywords: ['Risk', 'Opportunity', 'Insight', 'Confidence'],
  imageStatementLines: ['Understand', 'tomorrow.', 'Act today.'],
};

export const riskOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['Better decisions', 'come from a fuller picture.'],
  body: [
    'Every opportunity involves uncertainty. A structured assessment of both risk and opportunity can help clarify the factors that matter most, reduce blind spots and support more informed decision-making.',
    'DCL provides an independent perspective designed to help clients understand both potential upside and the factors capable of changing the outcome.',
  ],
  statementLines: ['Insight today.', 'Opportunity tomorrow.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfRiskAssessment = {
  label: 'Key Areas of Risk & Opportunity Assessment',
  headlineLines: ['A balanced view', 'of what matters.'],
  areas: [
    { name: 'Risk Identification', description: 'Identify and assess strategic, commercial, operational, financial and market-related risks.' },
    { name: 'Opportunity Evaluation', description: 'Assess potential opportunities, value drivers, strategic relevance and possible upside.' },
    { name: 'Scenario Analysis', description: 'Consider different scenarios and the assumptions, dependencies and potential implications behind them.' },
    { name: 'Decision Support', description: 'Bring risks and opportunities together into a clearer, more structured perspective for decision-making.' },
  ] satisfies LabeledItem[],
};

export const riskOurApproach = {
  label: 'Our Approach',
  headlineLines: ['A structured lens', 'for better decisions.'],
  body: 'DCL combines analytical insight with commercial understanding to help clients evaluate risk and opportunity with greater clarity.',
  rows: [
    { name: 'Understand the Context', description: 'Review objectives, market dynamics and key uncertainties.' },
    { name: 'Analyse Risks & Opportunities', description: 'Assess material risks, possible upside, dependencies and relevant commercial factors.' },
    { name: 'Test Assumptions', description: 'Explore alternative scenarios and challenge the assumptions supporting the initial view.' },
    { name: 'Provide Strategic Insight', description: 'Bring the findings together into a clear perspective designed to support the next decision.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Process', href: '/approach' },
};

export const riskAreasOfSupport = {
  label: 'Areas of Support',
  headlineLines: ['Where we', 'can help.'],
  areas: [
    { name: 'Market & Sector Analysis', description: 'Assess trends, competitive dynamics and structural market factors.' },
    { name: 'Investment Opportunities', description: 'Evaluate potential investments and significant commercial opportunities.' },
    { name: 'Strategic Initiatives', description: 'Assess risks and opportunities around important business initiatives.' },
    { name: 'Portfolio Risk Review', description: 'Consider concentration, dependencies, liquidity and other material risk factors.' },
  ] satisfies LabeledItem[],
};

export const riskWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['Independent insight', 'for a more certain future.'],
  body: 'DCL combines analytical rigour, commercial understanding and objective perspective to help clients navigate complexity and make more informed decisions.',
  principles: ['Independent Perspective', 'Analytical Rigour', 'Commercial Focus', 'Practical Insight'],
};

export const riskFinalCta = {
  smallLine: "Let's Discuss Your Risk & Opportunity",
  headlineLines: ['See more clearly.', 'Move forward with confidence.'],
  supporting: 'Speak with DCL about your specific requirements and explore how independent analysis may support your next decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Risk', 'Insight', 'Opportunity', 'Progress'],
};
