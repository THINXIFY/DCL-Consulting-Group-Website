export interface InformationTerm {
  label: string;
}

export interface DecisionArea {
  label: string;
  question: string;
  copy: string;
}

export interface EvaluationStage {
  name: string;
  statement: string;
  description: string;
}

export interface ChallengeQuestion {
  question: string;
  copy: string;
}

export interface JudgementIdea {
  title: string;
  copy: string;
}

export interface EngagementPrinciple {
  title: string;
  copy: string;
}

export const approachHero = {
  eyebrow: 'Our approach',
  headlineLines: ['From information', 'to informed judgement.'],
  intro:
    'DCL approaches significant investment and strategic decisions through a disciplined process designed to bring greater structure, perspective and clarity to complex information.',
  supporting:
    'The objective is not simply to gather more information. It is to understand what matters, challenge what is assumed and focus attention on the factors most relevant to the decision.',
  closingLines: ['Understand.', 'Analyse.', 'Challenge.', 'Assess.', 'Advise.'],
  informationTerms: [
    { label: 'Context' },
    { label: 'Evidence' },
    { label: 'Assumptions' },
    { label: 'Risk' },
    { label: 'Relevance' },
    { label: 'Judgement' },
  ] satisfies InformationTerm[],
};

export const understandingDecision = {
  headlineLines: ['Before analysis,', 'understand the decision.'],
  intro: 'Every engagement begins by establishing what is being considered, why the decision matters and which questions need to be answered.',
  areas: [
    {
      label: 'The Objective',
      question: 'What is the client ultimately trying to decide?',
      copy: 'Clarify the purpose of the review, the decision that must be made and the outcome the analysis is intended to support.',
    },
    {
      label: 'The Context',
      question: 'What sits around the opportunity?',
      copy: 'Understand the commercial environment, timing, stakeholders, available alternatives and wider circumstances surrounding the decision.',
    },
    {
      label: 'The Information',
      question: 'What do we know, and what remains incomplete?',
      copy: 'Identify the information available, its relevance, important gaps and areas where assumptions may be carrying more weight than evidence.',
    },
    {
      label: 'The Priorities',
      question: 'What could materially influence the decision?',
      copy: 'Separate critical factors from background information and determine where deeper attention is likely to add the most value.',
    },
  ] satisfies DecisionArea[],
  closingLines: ['Clarity begins by defining', 'the question correctly.'],
};

export const evaluationProcess = {
  eyebrow: 'Our evaluation process',
  headlineLines: ['A disciplined path', 'from information to insight.'],
  intro: "DCL's evaluation process brings structure to complex opportunities by moving through connected stages of understanding and judgement.",
  stages: [
    {
      name: 'Understand',
      statement: 'Start with the decision itself.',
      description: 'Establish the decision, objectives, context and information available before forming a view.',
    },
    {
      name: 'Analyse',
      statement: 'Examine what actually drives the opportunity.',
      description: 'Examine the commercial, financial and strategic fundamentals most relevant to the opportunity.',
    },
    {
      name: 'Challenge',
      statement: 'Test what must be true.',
      description: 'Test assumptions, question dependencies and identify areas where further scrutiny may materially change the view.',
    },
    {
      name: 'Assess',
      statement: 'Separate what matters from what does not.',
      description: 'Consider opportunity alongside uncertainty, distinguishing the factors that matter most from those that are less relevant.',
    },
    {
      name: 'Advise',
      statement: 'Turn analysis into a clearer decision.',
      description:
        'Bring the analysis together into a clear, decision-focused perspective that communicates what matters, what remains uncertain and where attention should be directed.',
    },
  ] satisfies EvaluationStage[],
  closingLines: ['The process is structured.', 'The judgement remains considered.'],
};

export const challengeAssumptions = {
  headlineLines: ['Good analysis should', 'withstand challenge.'],
  intro:
    'An opportunity can appear compelling when its assumptions remain untested. DCL examines the logic behind the opportunity to identify where greater scrutiny may change the view.',
  questions: [
    {
      question: 'What must be true?',
      copy: 'Identify the assumptions the opportunity depends upon and consider how important each one is to the overall case.',
    },
    {
      question: 'What may be missing?',
      copy: 'Look for information gaps, dependencies or considerations that may not yet be reflected in the initial view.',
    },
    {
      question: 'What could change?',
      copy: 'Consider the commercial, financial, market or strategic developments that could materially alter the outcome.',
    },
    {
      question: 'What deserves more attention?',
      copy: 'Focus further analysis on the issues with the greatest potential to influence the decision.',
    },
  ] satisfies ChallengeQuestion[],
  closingLines: ['Challenge is not about finding reasons to reject an opportunity.', 'It is about understanding it more completely.'],
};

export const analysisToJudgement = {
  headlineLines: ['Analysis matters', 'when it sharpens judgement.'],
  intro: 'The value of analysis lies in identifying what is material, understanding uncertainty and translating complexity into a clearer basis for decision-making.',
  backgroundTerms: ['Commercial', 'Financial', 'Assumptions', 'Context', 'Risk', 'Timing', 'Dependencies', 'Evidence', 'Alternatives', 'Strategy'],
  ideas: [
    { title: 'What matters', copy: 'Identify the factors most likely to influence the decision.' },
    {
      title: 'What remains uncertain',
      copy: 'Make clear where evidence is incomplete, assumptions remain important or outcomes depend on unresolved factors.',
    },
    {
      title: 'What follows',
      copy: 'Communicate the resulting perspective in a way that supports the next decision, discussion or stage of evaluation.',
    },
  ] satisfies JudgementIdea[],
  closingLines: ['More information does not always create more clarity.', 'Better judgement does.'],
};

export const workingWithDcl = {
  headlineLines: ['A focused engagement,', 'built around the decision.'],
  intro: 'DCL engagements are shaped around the opportunity, the questions that need answering and the level of analysis required.',
  principles: [
    {
      title: 'Defined Scope',
      copy: 'Begin with a clear understanding of the decision, objectives and areas requiring attention.',
    },
    {
      title: 'Relevant Information',
      copy: 'Focus on the information and considerations most relevant to the engagement rather than unnecessary complexity.',
    },
    {
      title: 'Direct Communication',
      copy: 'Maintain clear communication around the issues being examined, emerging observations and areas requiring further consideration.',
    },
    {
      title: 'Decision-Focused Output',
      copy: "Conclude with a structured perspective designed to support the client's next decision or stage of review.",
    },
  ] satisfies EngagementPrinciple[],
  closingLines: ['The scope may change.', 'The standard of thinking should not.'],
};

export const approachFinalCta = {
  headlineLines: ['Bring greater clarity', 'to the next decision.'],
  supporting: 'Discuss an investment opportunity, strategic question or business assessment with DCL and explore how a disciplined evaluation process may support the decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Expertise', href: '/expertise' },
  closing: 'Clarity Before Capital.',
};
