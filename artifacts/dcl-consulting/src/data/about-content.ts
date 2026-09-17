export interface DocumentPlane {
  label: string;
}

export interface ThinkChapter {
  title: string;
  question: string;
  copy: string;
  planePhrase: string;
}

export interface DefiningPrinciple {
  title: string;
  copy: string;
}

export interface LeadershipMember {
  initials: string;
  name: string;
  role: string;
}

export interface CompanyFact {
  label: string;
  value: string;
}

export const aboutHero = {
  eyebrow: 'About DCL',
  headlineLines: ['Clarity begins', 'with understanding.'],
  headlineEmphasis: 'Clarity',
  intro:
    'DCL Consulting and Investments Limited provides independent investment consulting and strategic decision support for investors and businesses navigating important opportunities and complex decisions.',
  supporting:
    'We bring together commercial understanding, financial perspective, risk awareness and strategic judgement to help clients see the factors that matter more clearly.',
  closing: 'Independent perspective. Disciplined analysis. Clearer decisions.',
};

export const heroDocumentPlanes: DocumentPlane[] = [
  { label: 'Investment Evaluation' },
  { label: 'Commercial Context' },
  { label: 'Risk Considerations' },
  { label: 'Strategic Perspective' },
  { label: 'Decision Support' },
];

export const whoWeAre = {
  headlineLines: ['Independent thinking', 'for decisions that matter.'],
  lead: 'DCL Consulting helps investors and businesses develop a clearer understanding of opportunities before significant decisions are made.',
  bodyOne:
    'Our role is to examine the wider picture, understanding the commercial fundamentals, financial considerations, assumptions, uncertainties and strategic context surrounding an opportunity.',
  bodyTwo:
    'Rather than approaching every situation with a predetermined answer, we focus on the questions that are most relevant to the decision. This allows complex information to be considered with greater structure, perspective and clarity.',
  closingLead: 'The objective is simple:',
  closingLines: ['a better-informed view', 'of what matters,', 'what remains uncertain', 'and what deserves', 'closer attention.'],
};

export const howWeThink = {
  headlineLines: ['Better decisions begin', 'with better questions.'],
  intro:
    'Before forming a view, DCL considers an opportunity from multiple perspectives, establishing the context, examining the fundamentals, challenging assumptions and focusing attention on the factors most likely to influence the outcome.',
  chapters: [
    {
      title: 'Context',
      question: 'What are we actually considering?',
      copy: 'Understand the opportunity, the objective, the decision-makers involved and the wider commercial or strategic context.',
      planePhrase: 'Understand the environment',
    },
    {
      title: 'Fundamentals',
      question: 'What is creating the underlying value?',
      copy: 'Examine the business model, market position, economics, performance and the factors supporting the opportunity.',
      planePhrase: 'Identify what creates value',
    },
    {
      title: 'Risk',
      question: 'What could materially change the outcome?',
      copy: 'Challenge assumptions, identify dependencies and consider uncertainties or downside factors that deserve closer scrutiny.',
      planePhrase: 'Test what could change',
    },
    {
      title: 'Judgement',
      question: 'What matters most from here?',
      copy: 'Bring the evidence together, distinguish material issues from background information and focus on what should influence the decision.',
      planePhrase: 'Focus the decision',
    },
  ] satisfies ThinkChapter[],
  closing: 'Information creates value when it leads to clearer judgement.',
};

export const whatDefinesDcl = {
  headlineLines: ['The quality of the view', 'depends on the standard behind it.'],
  intro:
    "DCL's work is guided by a small number of principles that shape how opportunities are examined and how conclusions are communicated.",
  brandStatement: 'Clarity Before Capital.',
  principles: [
    {
      title: 'Independent Perspective',
      copy: 'A considered view shaped by the opportunity and the available evidence rather than a predetermined conclusion.',
    },
    {
      title: 'Analytical Discipline',
      copy: 'Structured evaluation focused on the commercial, financial and strategic factors most relevant to the decision.',
    },
    {
      title: 'Commercial Understanding',
      copy: 'Attention to how businesses, markets and opportunities work in practice, not only how they appear on paper.',
    },
    {
      title: 'Clear Communication',
      copy: 'Complex information translated into a clearer understanding of what matters, what remains uncertain and what deserves attention.',
    },
  ] satisfies DefiningPrinciple[],
  closingLines: ['Independent thinking.', 'Structured judgement.', 'Clear communication.'],
};

export const leadership = {
  eyebrow: 'Leadership',
  headlineLines: ['Leadership grounded', 'in considered judgement.'],
  intro: "A concise view of the people who guide DCL's approach to investment and strategic decisions.",
  members: [
    { initials: 'DL', name: 'David Christopher Lebond', role: 'Chairman' },
    { initials: 'SG', name: 'Sandeep Gupta', role: 'Managing Director' },
    { initials: 'SR', name: 'Stephan Rotstein', role: 'CFO' },
    { initials: 'PG', name: 'Patrick Gabaryan', role: 'COO' },
  ] satisfies LeadershipMember[],
  cta: { label: 'Meet the Team', href: '/team' },
};

export const companyFoundations = {
  headline: 'Built on a clear foundation.',
  intro: 'DCL Consulting and Investments Limited is a private limited company registered in England and Wales.',
  facts: [
    { label: 'Company', value: 'DCL Consulting and Investments Limited' },
    { label: 'Company Type', value: 'Private Limited Company' },
    { label: 'Registered In', value: 'England & Wales' },
    { label: 'Company Number', value: '10086906' },
    { label: 'Director', value: 'David Christopher Lebond' },
  ] satisfies CompanyFact[],
  anchorLines: ['DCL Consulting', 'and Investments Limited'],
};

export const finalCta = {
  headlineLines: ['Bring greater clarity', 'to the next decision.'],
  supporting:
    'Whether considering an investment opportunity, business decision or strategic question, DCL can provide an independent perspective focused on what matters.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Expertise', href: '/#expertise' },
  closing: 'Clarity Before Capital.',
};
