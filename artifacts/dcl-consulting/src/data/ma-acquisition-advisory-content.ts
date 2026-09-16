export interface LabeledItem {
  name: string;
  description: string;
}

export const maHero = {
  label: 'Transaction Perspective',
  headlineLines: ['M&A & Acquisition', 'Advisory'],
  intro: 'Independent advisory perspective for businesses, investors and decision-makers evaluating acquisitions, strategic transactions and complex corporate opportunities.',
  cta: { label: 'Discuss a Transaction', href: '/#about' },
  keywords: ['Opportunity', 'Structure', 'Risk', 'Value'],
  imageStatementLines: ['Strategic transactions.', 'Lasting value.'],
};

export const maOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['More than a transaction.', 'A strategic opportunity.'],
  body: [
    'Successful acquisitions require more than financial analysis. Strategic fit, commercial fundamentals, risk, structure and execution can all materially influence the outcome.',
    'DCL provides an independent perspective to help clients examine these factors before important decisions are made.',
  ],
  statementLines: ['The right', 'opportunity.', 'A stronger', 'tomorrow.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfMaAdvisory = {
  label: 'Key Areas of M&A Advisory',
  headlineLines: ['Supporting better', 'transaction decisions.'],
  areas: [
    { name: 'Target Evaluation', description: 'Assess strategic fit, commercial fundamentals and the underlying rationale for an acquisition.' },
    { name: 'Commercial Analysis', description: 'Examine business fundamentals, market position, economics and material assumptions.' },
    { name: 'Structure & Negotiation Perspective', description: 'Consider transaction structure, incentives, dependencies and important commercial terms.' },
    { name: 'Integration Considerations', description: 'Review strategic priorities and factors that may influence post-transaction value creation.' },
  ] satisfies LabeledItem[],
};

export const transactionApproach = {
  label: 'Transaction Approach',
  headlineLines: ['From opportunity', 'to successful outcomes.'],
  body: 'We provide independent advisory support across the transaction lifecycle, helping clients make informed decisions at every stage.',
  rows: [
    { name: 'Evaluate the Opportunity', description: 'Assess strategic rationale, context and key value drivers.' },
    { name: 'Conduct Detailed Analysis', description: 'Review financial, commercial and strategic factors.' },
    { name: 'Consider Structure & Terms', description: 'Examine relevant structures, dependencies and negotiation considerations.' },
    { name: 'Support the Decision', description: 'Provide independent perspective as the transaction progresses.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Approach', href: '/approach' },
};

export const transactionFocus = {
  label: 'Transaction Focus',
  headlineLines: ['Focused support across', 'the deal cycle.'],
  areas: [
    { name: 'Buy-Side Advisory', description: 'Independent perspective for businesses and investors evaluating acquisitions.' },
    { name: 'Sell-Side Perspective', description: 'Strategic and commercial perspective for owners considering a potential transaction.' },
    { name: 'Mergers & Strategic Combinations', description: 'Advisory perspective around significant combinations and complex corporate opportunities.' },
    { name: 'Divestments & Carve-Outs', description: 'Strategic perspective around divestments, separation decisions and portfolio repositioning.' },
  ] satisfies LabeledItem[],
};

export const maWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['A disciplined approach', 'to complex transactions.'],
  body: 'DCL combines independent judgement, analytical rigour and commercial understanding to help clients evaluate transaction opportunities with greater clarity.',
  principles: ['Independent Perspective', 'Transaction Discipline', 'Commercial Focus', 'Long-Term Value'],
};

export const maFinalCta = {
  smallLine: "Let's Discuss a Transaction",
  headlineLines: ['Create value', 'with the right perspective.'],
  supporting: 'Speak with DCL about your transaction objectives and explore how independent advisory perspective may support the next decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Opportunity', 'Insight', 'Execution'],
};
