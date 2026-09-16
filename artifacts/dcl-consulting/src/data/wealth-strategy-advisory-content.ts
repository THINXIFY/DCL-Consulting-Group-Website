export interface LabeledItem {
  name: string;
  description: string;
}

export const wealthHero = {
  label: 'Long-Term Perspective',
  headlineLines: ['Wealth Strategy', 'Advisory'],
  intro: 'Independent strategic perspective for individuals, families and private capital seeking greater clarity around long-term wealth priorities, investment considerations, preservation, diversification and future planning.',
  cta: { label: 'Discuss Your Wealth Strategy', href: '/#about' },
  keywords: ['Preserve', 'Grow', 'Structure', 'Generations'],
  imageStatementLines: ['A more considered', 'approach to wealth.'],
};

export const wealthOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['Wealth is broader', 'than financial assets.'],
  body: [
    'Long-term wealth decisions extend beyond individual investments. They can involve capital priorities, diversification, liquidity, succession considerations, risk and the relationship between current decisions and future objectives.',
    'DCL provides an independent strategic perspective designed to help clients consider these factors with greater structure and clarity.',
  ],
  statementLines: ['Clarity today', 'for future', 'generations.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfWealthStrategy = {
  label: 'Key Areas of Wealth Strategy',
  headlineLines: ['Supporting your', 'wider objectives.'],
  areas: [
    { name: 'Wealth Structure', description: 'Consider how assets, investment priorities and long-term objectives fit within a broader wealth strategy.' },
    { name: 'Investment Perspective', description: 'Independent perspective around investment decisions, diversification, portfolio considerations and strategic priorities.' },
    { name: 'Succession & Legacy', description: 'Consider intergenerational objectives, continuity and the long-term implications of current decisions.' },
    { name: 'Risk Considerations', description: 'Identify concentration, liquidity, dependency and other factors capable of influencing long-term objectives.' },
  ] satisfies LabeledItem[],
};

export const wealthOurApproach = {
  label: 'Our Approach',
  headlineLines: ['A structured process', 'for long-term confidence.'],
  body: 'DCL combines analytical perspective with commercial understanding to help clients consider long-term wealth decisions with greater structure and clarity.',
  rows: [
    { name: 'Understand Your Objectives', description: 'Clarify priorities, constraints, time horizon and the decisions being considered.' },
    { name: 'Analyse the Broader Picture', description: 'Examine assets, investment considerations, risks, dependencies and relevant strategic factors.' },
    { name: 'Develop Strategic Insights', description: 'Identify priorities, alternatives and areas that deserve further consideration.' },
    { name: 'Support the Next Step', description: 'Provide a clear advisory perspective designed to support subsequent decisions and professional discussions.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Process', href: '/approach' },
};

export const areasOfSupport = {
  label: 'Areas of Support',
  headlineLines: ['From strategy', 'to implementation.'],
  areas: [
    { name: 'Wealth Strategy', description: 'Independent perspective around long-term capital and wealth priorities.' },
    { name: 'Family Capital Perspective', description: 'Strategic support for families and private capital considering significant investments, assets and long-term priorities.' },
    { name: 'Succession & Legacy Considerations', description: 'Perspective around continuity, future priorities and intergenerational considerations.' },
    { name: 'Philanthropic Strategy', description: 'Strategic perspective around philanthropic objectives, allocation priorities and longer-term impact considerations.' },
  ] satisfies LabeledItem[],
};

export const wealthWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['A considered partner', 'for what matters most.'],
  body: 'DCL provides independent, commercially grounded perspective to help clients consider long-term wealth priorities with greater structure, context and clarity.',
  principles: ['Independent Perspective', 'Long-Term Thinking', 'Holistic Approach', 'Clear Communication'],
};

export const wealthFinalCta = {
  smallLine: "Let's Discuss Your Wealth Strategy",
  headlineLines: ['Build a stronger', 'future with clarity.'],
  supporting: 'Speak with DCL about your long-term wealth priorities and explore how independent strategic perspective may support future decisions.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Wealth', 'Perspective', 'Generations'],
};
