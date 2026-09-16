export interface LabeledItem {
  name: string;
  description: string;
}

export const privateCapitalHero = {
  label: 'Capital With Perspective',
  headlineLines: ['Private Capital', 'Advisory'],
  intro: 'Independent advisory support for private investors, entrepreneurs and businesses evaluating investment opportunities, structures and strategic options.',
  cta: { label: 'Discuss a Private Capital Opportunity', href: '/#about' },
  keywords: ['Opportunities', 'Structure', 'Execution', 'Value Creation'],
  imageStatementLines: ['Discipline.', 'Perspective.', 'Long-term value.'],
};

export const privateCapitalOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['More than capital.', 'A strategic partner.'],
  body: [
    'Private capital can create significant opportunity, but strong outcomes depend on more than capital alone. Commercial understanding, structure, risk, execution and strategic alignment can each materially influence the decision.',
    'DCL brings an independent perspective to help private investors and businesses examine these considerations with greater clarity.',
  ],
  statementLines: ['Ideas, capital', 'and expertise', 'in alignment.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfPrivateCapitalAdvisory = {
  label: 'Key Areas of Advisory',
  headlineLines: ['Supporting better', 'capital decisions.'],
  areas: [
    { name: 'Opportunity Evaluation', description: 'Assess investment opportunities, underlying fundamentals, commercial logic and strategic relevance.' },
    { name: 'Structuring Considerations', description: 'Consider alignment, incentives, dependencies and structural factors relevant to the opportunity.' },
    { name: 'Due Diligence Support', description: 'Bring structure to commercial, financial and strategic questions requiring deeper evaluation.' },
    { name: 'Value Creation Perspective', description: 'Consider the factors capable of supporting sustainable commercial development and long-term value.' },
  ] satisfies LabeledItem[],
};

export const investmentApproach = {
  label: 'Our Investment Approach',
  headlineLines: ['From opportunity', 'to long-term value.'],
  body: 'DCL combines commercial analysis with strategic perspective to support more informed decisions throughout significant private-capital opportunities.',
  rows: [
    { name: 'Evaluate Opportunities', description: 'Assess the investment case, commercial fundamentals and relevant context.' },
    { name: 'Analyse & Challenge', description: 'Test assumptions, dependencies, risks and potential outcomes.' },
    { name: 'Consider the Structure', description: 'Examine strategic alignment, incentives and factors that may influence execution.' },
    { name: 'Support the Next Decision', description: 'Provide independent advisory perspective as the opportunity progresses.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Approach', href: '/approach' },
};

export const investmentFocus = {
  label: 'Investment Focus',
  headlineLines: ['Targeted support across', 'private-capital strategies.'],
  areas: [
    { name: 'Direct Investments', description: 'Independent perspective around private investment opportunities and relevant commercial considerations.' },
    { name: 'Growth Capital', description: 'Advisory perspective around businesses considering capital to support growth, expansion or strategic development.' },
    { name: 'Special Situations', description: 'Independent analysis where greater complexity, uncertainty or unusual circumstances require deeper scrutiny.' },
    { name: 'Secondary Opportunities', description: 'Evaluation of secondary transactions or portfolio-related opportunities from a commercial and strategic perspective.' },
  ] satisfies LabeledItem[],
};

export const privateCapitalWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['Independent insight', 'for private capital investors.'],
  body: 'DCL brings commercial understanding, analytical discipline and independent perspective to help clients evaluate private-capital opportunities with greater confidence and clarity.',
  principles: ['Independent Perspective', 'Commercial Focus', 'Strategic Alignment', 'Long-Term Value'],
};

export const privateCapitalFinalCta = {
  smallLine: "Let's Discuss a Private Capital Opportunity",
  headlineLines: ['Turn opportunity', 'into long-term value.'],
  supporting: 'Speak with DCL about your investment objectives and explore how independent perspective may support your next private-capital decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Capital', 'Perspective', 'Value'],
};
