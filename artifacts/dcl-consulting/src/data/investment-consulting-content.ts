export interface LabeledItem {
  name: string;
  description: string;
}

export const investmentConsultingHero = {
  label: 'Investment Perspective',
  headlineLines: ['Investment', 'Consulting'],
  intro: 'Independent perspective for investors and businesses evaluating significant opportunities, assumptions, risks and strategic considerations before important decisions are made.',
  cta: { label: 'Discuss Your Objectives', href: '/#about' },
  keywords: ['Opportunity', 'Analysis', 'Risk', 'Strategy'],
  imageStatementLines: ['Better perspective.', 'Stronger decisions.'],
};

export const ourApproach = {
  label: 'Our Approach',
  headlineLines: ['A clearer view', 'for important decisions.'],
  body: [
    'DCL provides independent investment consulting to help investors and businesses assess significant opportunities with greater clarity, structure and discipline.',
    'Our work focuses on understanding the opportunity, examining the underlying fundamentals, challenging assumptions and identifying the factors most relevant to the decision.',
  ],
  link: { label: 'Our Approach', href: '/approach' },
  statementLines: ['Independent thinking', 'for complex decisions.'],
};

export const whatWeEvaluate = {
  label: 'What We Evaluate',
  headlineLines: ['Key elements', 'of opportunity.'],
  areas: [
    { name: 'Market Dynamics', description: 'Evaluate market conditions, trends, demand drivers and relevant competitive factors.' },
    { name: 'Business Fundamentals', description: 'Assess the underlying business model, commercial logic, operating characteristics and sustainability.' },
    { name: 'Financial Considerations', description: 'Review relevant financial characteristics, capital requirements, economics and return considerations.' },
    { name: 'Risks & Uncertainty', description: 'Identify important assumptions, dependencies, downside factors and areas requiring further scrutiny.' },
    { name: 'Strategic Fit', description: 'Consider alignment with wider objectives, timing, alternatives and long-term priorities.' },
  ] satisfies LabeledItem[],
};

export const investmentAnalysis = {
  label: 'Our Investment Analysis',
  headlineLines: ['From information', 'to informed perspective.'],
  intro: 'DCL brings structure and discipline to complex information, helping clients move from facts and assumptions toward a clearer understanding of the opportunity.',
  rows: [
    { name: 'Understand', description: 'Review the opportunity and its wider context.' },
    { name: 'Analyse', description: 'Assess key drivers, fundamentals and relevant assumptions.' },
    { name: 'Challenge', description: 'Test the logic, risks, dependencies and alternatives.' },
    { name: 'Consider', description: 'Align the findings with strategic objectives and wider priorities.' },
    { name: 'Communicate', description: 'Present a clear, decision-focused perspective.' },
  ] satisfies LabeledItem[],
  cta: { label: 'Explore Our Process', href: '/approach' },
};

export const areasOfFocus = {
  label: 'Areas of Focus',
  headlineLines: ['Where we', 'can support.'],
  areas: [
    { name: 'Investment Opportunities', description: 'Independent assessment of potential investments across sectors and geographies.' },
    { name: 'Strategic Review', description: 'Analysis of strategic options, including growth, diversification, restructuring or repositioning.' },
    { name: 'Transaction Support', description: 'Independent advisory perspective during evaluations, negotiations and key decision points.' },
    { name: 'Special Situations', description: 'Greater scrutiny where complexity, uncertainty or unusual circumstances exist.' },
  ] satisfies LabeledItem[],
};

export const investmentWhyDcl = {
  label: 'Why DCL',
  headlineLines: ['A disciplined approach', 'to investment decisions.'],
  body: 'DCL combines independent thinking, commercial understanding and analytical discipline to support better-informed investment decisions.',
  principles: ['Independent Perspective', 'Analytical Discipline', 'Commercial Understanding', 'Clear Communication'],
};

export const investmentFinalCta = {
  smallLine: "Let's Discuss Your Opportunity",
  headlineLines: ['Bring greater clarity', "to what's next."],
  supporting: 'Speak with DCL about an investment opportunity or strategic decision and explore how independent analysis may support the next step.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Services', href: '/services' },
  closing: 'Clarity Before Capital.',
};
