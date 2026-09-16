export interface LabeledItem {
  name: string;
  description: string;
}

export const strategicHero = {
  label: 'Strategic Perspective',
  headlineLines: ['Strategic', 'Advisory'],
  intro: 'Independent strategic advice to help businesses, investors and leaders navigate complexity, evaluate opportunities and make better-informed long-term decisions.',
  cta: { label: 'Discuss Your Objectives', href: '/#about' },
  keywords: ['Strategy', 'Growth', 'Transformation', 'Value'],
  imageStatementLines: ['Ideas.', 'Perspective.', 'Progress.'],
};

export const strategicOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['A clearer path', 'for what is next.'],
  body: [
    'Strategic decisions require a broad perspective, commercial understanding and the ability to distinguish what matters most from what simply creates noise.',
    'DCL helps clients examine strategic choices with greater context, discipline and clarity.',
  ],
  statementLines: ['Strategy today', 'for a stronger', 'tomorrow.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfStrategicAdvisory = {
  label: 'Key Areas of Strategic Advisory',
  headlineLines: ['Supporting meaningful', 'progress.'],
  areas: [
    { name: 'Strategic Planning', description: 'Help define priorities, strategic direction and the decisions required to move forward.' },
    { name: 'Growth Opportunities', description: 'Evaluate potential growth paths, market opportunities and strategic alternatives.' },
    { name: 'Organisational Strategy', description: 'Consider capabilities, operating priorities and organisational alignment.' },
    { name: 'Value Enhancement', description: 'Identify strategic opportunities capable of strengthening long-term commercial value.' },
  ] satisfies LabeledItem[],
};

export const strategicOurApproach = {
  label: 'Our Approach',
  headlineLines: ['From insight', 'to action.'],
  body: 'DCL combines independent perspective with commercial analysis to help clients move from complexity toward clearer and more actionable strategic decisions.',
  rows: [
    { name: 'Understand the Context', description: 'Review objectives, market dynamics, priorities and relevant constraints.' },
    { name: 'Analyse & Challenge', description: 'Evaluate options, assumptions, dependencies and possible outcomes.' },
    { name: 'Develop Strategic Options', description: 'Identify practical, well-considered alternatives and implications.' },
    { name: 'Support Implementation', description: 'Provide advisory perspective as decisions move toward execution.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Process', href: '/approach' },
};

export const strategicAreasOfFocus = {
  label: 'Areas of Focus',
  headlineLines: ['Where we', 'can help.'],
  areas: [
    { name: 'Corporate Strategy', description: 'Strategic direction and decision support for established businesses.' },
    { name: 'Market Expansion', description: 'Perspective around entry into new markets, sectors or geographies.' },
    { name: 'Business Transformation', description: 'Advisory support during significant periods of organisational or commercial change.' },
    { name: 'Partnerships & JVs', description: 'Strategic assessment of partnerships, joint ventures and collaborative opportunities.' },
  ] satisfies LabeledItem[],
};

export const strategicWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['Independent perspective', 'for stronger outcomes.'],
  body: 'DCL combines analytical insight, commercial understanding and practical judgement to help clients make better strategic decisions.',
  principles: ['Independent Perspective', 'Commercial Focus', 'Practical Approach', 'Clear Communication'],
};

export const strategicFinalCta = {
  smallLine: "Let's Discuss Your Strategy",
  headlineLines: ['Turn possibility', 'into progress.'],
  supporting: 'Speak with DCL about your strategic objectives and explore how independent perspective may support the next stage.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Strategy', 'Insight', 'Opportunity'],
};
