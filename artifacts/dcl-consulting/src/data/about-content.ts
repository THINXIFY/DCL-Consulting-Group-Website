export interface ThinkChapter {
  title: string;
  question: string;
  copy: string;
  image: string;
}

export interface DefiningPrinciple {
  title: string;
  copy: string;
}

export interface LeadershipPrinciple {
  title: string;
  copy: string;
}

export interface LeadershipFact {
  label: string;
  value: string;
}

const img = (seed: string, w = 1400, h = 1000) => `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

export const aboutHeroImage = img('dcl-about-hero-facade', 1800, 1400);
export const whoWeAreImage = img('dcl-who-we-are-office', 1400, 1100);
export const leadershipImage = img('dcl-leadership-context', 1200, 1500);

export const howWeThink: ThinkChapter[] = [
  {
    title: 'Context',
    question: 'What are we actually considering?',
    copy: 'Understand the opportunity, the objective, the decision-makers involved and the wider commercial or strategic context.',
    image: img('dcl-think-context', 900, 700),
  },
  {
    title: 'Fundamentals',
    question: 'What is creating the underlying value?',
    copy: 'Examine the business model, market position, economics, performance and the factors supporting the opportunity.',
    image: img('dcl-think-fundamentals', 900, 700),
  },
  {
    title: 'Risk',
    question: 'What could materially change the outcome?',
    copy: 'Challenge assumptions, identify dependencies and consider uncertainties or downside factors that deserve closer scrutiny.',
    image: img('dcl-think-risk', 900, 700),
  },
  {
    title: 'Judgement',
    question: 'What matters most from here?',
    copy: 'Bring the evidence together, distinguish material issues from background information and focus on what should influence the decision.',
    image: img('dcl-think-judgement', 900, 700),
  },
];

export const whatDefinesDcl: DefiningPrinciple[] = [
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
];

export const leadershipApproach: LeadershipPrinciple[] = [
  {
    title: 'Understand before concluding.',
    copy: 'Establish the context and the important facts before forming a view.',
  },
  {
    title: 'Challenge where necessary.',
    copy: 'Question assumptions and identify areas that require greater scrutiny.',
  },
  {
    title: 'Communicate what matters clearly.',
    copy: 'Translate analysis into a perspective that is relevant to the decision.',
  },
];

export const leadershipFacts: LeadershipFact[] = [
  { label: 'Director', value: 'David Christopher Lebond' },
  { label: 'Company', value: 'DCL Consulting and Investments Limited' },
  { label: 'Registered', value: 'England & Wales' },
];
