export interface LabeledItem {
  name: string;
  description: string;
}

export const dueDiligenceHero = {
  label: 'Independent Review',
  headlineLines: ['Due Diligence', 'Support'],
  intro: 'Structured due diligence support for investors, businesses and decision-makers seeking greater clarity before important commercial or investment decisions.',
  cta: { label: 'Discuss a Due Diligence Requirement', href: '/#about' },
  keywords: ['Analysis', 'Risk', 'Clarity', 'Confidence'],
  imageStatementLines: ['Deeper insight.', 'Stronger decisions.'],
};

export const dueDiligenceOurPerspective = {
  label: 'Our Perspective',
  headlineLines: ['Better decisions', 'start with better insight.'],
  body: [
    'Effective due diligence helps identify opportunities, risks, assumptions and areas requiring deeper investigation before significant decisions are made.',
    'DCL provides an independent, structured approach designed to bring greater clarity to complex evaluations.',
  ],
  statementLines: ['Clarity reduces risk.', 'Insight creates opportunity.'],
  link: { label: 'Our Approach', href: '/approach' },
};

export const keyAreasOfDueDiligence = {
  label: 'Key Areas of Due Diligence',
  headlineLines: ['A comprehensive,', 'independent review.'],
  areas: [
    { name: 'Commercial Due Diligence', description: 'Assess market context, business model, competitive positioning, customers and commercial assumptions.' },
    { name: 'Financial Review', description: 'Examine financial characteristics, key assumptions, performance drivers and areas requiring further scrutiny.' },
    { name: 'Operational Due Diligence', description: 'Review operational capabilities, processes, dependencies and execution risks.' },
    { name: 'Legal & Regulatory Considerations', description: 'Identify areas that may require specialist legal, regulatory or compliance review.' },
  ] satisfies LabeledItem[],
};

export const dueDiligenceProcess = {
  label: 'Our Due Diligence Process',
  headlineLines: ['A structured approach', 'for greater confidence.'],
  body: 'DCL takes a focused and disciplined approach to due diligence, helping clients identify material findings, uncertainties and areas requiring closer attention.',
  rows: [
    { name: 'Define Scope & Objectives', description: 'Clarify the decision, priorities and information requirements.' },
    { name: 'Review & Analyse', description: 'Examine relevant information, documentation, assumptions and available evidence.' },
    { name: 'Identify Key Findings', description: 'Highlight material issues, opportunities, uncertainties and areas requiring additional attention.' },
    { name: 'Provide Clear Reporting', description: 'Present findings in a structured, decision-focused format.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Process', href: '/approach' },
};

export const dueDiligenceAreasOfSupport = {
  label: 'Areas of Support',
  headlineLines: ['Tailored diligence', 'for your needs.'],
  areas: [
    { name: 'Investment Due Diligence', description: 'Independent review supporting investment and strategic decisions.' },
    { name: 'Vendor Due Diligence Support', description: 'Independent perspective around information preparation and key commercial considerations.' },
    { name: 'Commercial & Market Review', description: 'Assessment of markets, sectors, competition and commercial dynamics.' },
    { name: 'Operational & Risk Review', description: 'Evaluation of operating dependencies, execution considerations and material business risks.' },
  ] satisfies LabeledItem[],
};

export const dueDiligenceWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['Independent analysis', 'for informed decisions.'],
  body: 'DCL brings analytical discipline, commercial understanding and objective perspective to help clients evaluate complex opportunities with greater clarity.',
  principles: ['Independent Perspective', 'Analytical Rigour', 'Commercial Understanding', 'Practical Insight'],
};

export const dueDiligenceFinalCta = {
  smallLine: "Let's Discuss Your Due Diligence",
  headlineLines: ['Reduce uncertainty.', 'Make better decisions.'],
  supporting: 'Speak with DCL about your due diligence requirements and explore how independent review may support a more informed decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
  closingKeywords: ['Analysis', 'Insight', 'Confidence'],
};
