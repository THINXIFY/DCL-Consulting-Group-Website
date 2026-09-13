export interface AnalyticalLens {
  category: string;
  phrase: string;
}

export interface Perspective {
  category: string;
  question: string;
  copy: string;
}

export interface ExpertiseArea {
  title: string;
  supportingLine: string;
  description: string;
}

export interface DecisionContext {
  title: string;
  supportingLine: string;
  description: string;
}

export const expertiseHero = {
  eyebrow: 'Expertise',
  headlineLines: ['Expertise applied', 'to the decision.'],
  intro:
    'DCL Consulting brings together commercial analysis, financial perspective, risk awareness and strategic judgement to help investors and businesses evaluate opportunities with greater clarity.',
  supporting:
    'Different opportunities require different questions. Our role is to identify the factors that matter, examine them from the right perspectives and help build a clearer view of the decision.',
  closingLines: ['Analysis with purpose.', 'Perspective with relevance.'],
  lenses: [
    { category: 'Commercial', phrase: 'How does the opportunity work in practice?' },
    { category: 'Financial', phrase: 'What do the economics indicate?' },
    { category: 'Risk', phrase: 'What could materially change the outcome?' },
    { category: 'Strategic', phrase: 'How does it fit the wider objective?' },
  ] satisfies AnalyticalLens[],
};

export const howWeAddPerspective = {
  headlineLines: ['A broader view', 'of what matters.'],
  intro:
    'A strong decision rarely depends on a single factor. DCL examines opportunities through complementary perspectives to build a more complete understanding of what may influence the outcome.',
  perspectives: [
    {
      category: 'Commercial',
      question: 'How does the opportunity work in practice?',
      copy: 'Consider the business model, market position, operating environment, commercial logic and the factors that support real-world viability.',
    },
    {
      category: 'Financial',
      question: 'What do the economics indicate?',
      copy: 'Examine the financial characteristics, underlying assumptions, performance considerations and economic factors relevant to the opportunity.',
    },
    {
      category: 'Risk',
      question: 'What could materially change the outcome?',
      copy: 'Identify uncertainties, dependencies, downside considerations and assumptions that warrant closer scrutiny before a decision is made.',
    },
    {
      category: 'Strategic',
      question: 'How does it fit the wider objective?',
      copy: 'Consider how the opportunity aligns with broader priorities, timing, alternatives and the strategic direction behind the decision.',
    },
  ] satisfies Perspective[],
  closingLines: ['Perspective becomes valuable', 'when it changes how the decision is understood.'],
};

export const coreExpertise = {
  headlineLines: ['Focused expertise', 'for complex decisions.'],
  intro:
    'DCL applies structured analysis and independent perspective across a range of investment and strategic questions. Each engagement is shaped around the decision, the available information and the issues that require the greatest attention.',
  areas: [
    {
      title: 'Investment Consulting',
      supportingLine: 'Independent perspective throughout the investment decision.',
      description:
        'Structured support for investors evaluating significant opportunities, helping clarify the commercial context, relevant assumptions, strategic considerations and questions that deserve closer examination.',
    },
    {
      title: 'Opportunity Analysis',
      supportingLine: 'Understanding what sits behind the opportunity.',
      description:
        'A focused assessment of the underlying proposition, including its commercial logic, market context, key assumptions, potential strengths and areas requiring further scrutiny.',
    },
    {
      title: 'Risk & Opportunity Assessment',
      supportingLine: 'Considering upside and uncertainty together.',
      description:
        'Evaluation of the factors that may support an opportunity alongside the risks, dependencies and uncertainties that could materially influence the outcome.',
    },
    {
      title: 'Business & Financial Analysis',
      supportingLine: 'A clearer view of the underlying fundamentals.',
      description:
        'Review of relevant business and financial considerations to help understand performance, economics, operating characteristics and the factors influencing commercial viability.',
    },
    {
      title: 'Strategic Advisory',
      supportingLine: 'Connecting the opportunity to the wider objective.',
      description:
        'Strategic perspective for businesses and investors considering growth, expansion, partnerships, acquisitions or other important commercial decisions.',
    },
    {
      title: 'Due Diligence Support',
      supportingLine: 'Bringing structure to deeper evaluation.',
      description:
        'Support in organising and examining relevant information, assumptions, dependencies and unresolved questions as part of a broader decision-making or due-diligence process.',
    },
  ] satisfies ExpertiseArea[],
  closingLines: ['Expertise is most valuable', 'when it brings the decision into focus.'],
};

export const whereExpertiseApplies = {
  eyebrow: 'Where it applies',
  headlineLines: ['Where perspective', 'becomes valuable.'],
  intro:
    "DCL's expertise can be applied across a range of investment and strategic situations where greater clarity, deeper analysis and independent judgement can support the decision.",
  contexts: [
    {
      title: 'Investment Opportunities',
      supportingLine: 'A clearer view before capital is committed.',
      description: 'Assess the commercial case, relevant assumptions, risks and strategic considerations surrounding a potential investment.',
    },
    {
      title: 'Acquisitions',
      supportingLine: 'Understanding what sits behind the transaction.',
      description: 'Develop a clearer view of the business, its underlying fundamentals and the issues that may influence an acquisition decision.',
    },
    {
      title: 'Growth & Expansion',
      supportingLine: 'Evaluating opportunity beyond the immediate upside.',
      description: 'Consider new markets, expansion opportunities and the commercial, financial and strategic factors behind growth.',
    },
    {
      title: 'Strategic Partnerships',
      supportingLine: 'Assessing fit, rationale and dependency.',
      description: 'Examine the strategic fit, commercial logic, dependencies and potential implications of a proposed partnership.',
    },
    {
      title: 'Business Assessment',
      supportingLine: 'Looking beneath headline performance.',
      description: 'Review relevant business fundamentals, operating characteristics and financial or commercial considerations to build a clearer understanding of the organisation.',
    },
    {
      title: 'Complex Strategic Decisions',
      supportingLine: 'Structure when several factors matter at once.',
      description: 'Bring independent perspective to decisions shaped by uncertainty, competing priorities or multiple commercial and strategic considerations.',
    },
  ] satisfies DecisionContext[],
  closingLines: ['Different situations.', 'The same need for clarity.'],
};

export const expertiseFinalCta = {
  headlineLines: ['A clearer view', 'before the next decision.'],
  supporting:
    'Discuss an investment opportunity, strategic question or business assessment with DCL and explore where independent perspective may add value.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Contact DCL', href: '/#about' },
  closing: 'Clarity Before Capital.',
};
