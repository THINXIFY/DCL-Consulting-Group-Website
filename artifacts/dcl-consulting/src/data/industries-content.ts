export interface EditorialPrinciple {
  title: string;
  copy: string;
}

export interface Sector {
  name: string;
  supportingLine: string;
  description: string;
}

export interface FundamentalArea {
  name: string;
  question: string;
  description: string;
}

export interface DecisionContext {
  name: string;
  description: string;
}

export const industriesHero = {
  eyebrow: 'Industries',
  headlineLines: ['Perspective across', 'different sectors.'],
  intro:
    'Every industry has its own commercial realities, economics, risks and strategic considerations. DCL brings a disciplined perspective to opportunities across a diverse range of sectors.',
  supporting:
    'Rather than applying a fixed sector template, we focus on understanding the characteristics of the opportunity, the environment in which it operates and the factors most relevant to the decision.',
  closingLines: ['Different sectors.', 'Different dynamics.', 'The same need for clarity.'],
  sectorSlices: ['Property', 'Technology', 'Healthcare', 'Infrastructure', 'Industrial', 'Consumer'],
};

export const sectorAgnostic = {
  headlineLines: ['Different industries.', 'The same need for clarity.'],
  lead: 'Sector knowledge matters, but sector labels alone do not explain whether an opportunity is compelling.',
  body: [
    'DCL approaches each opportunity by first understanding the commercial environment in which it operates. The relevant questions may change from one industry to another, but the objective remains consistent: identify what creates value, what introduces uncertainty and what should materially influence the decision.',
    'This means considering sector-specific realities without losing sight of the underlying fundamentals that determine how an opportunity may perform in practice.',
  ],
  principles: [
    {
      title: 'Sector context shapes the question',
      copy: 'Different industries require attention to different market dynamics, operating realities, dependencies and sources of risk.',
    },
    {
      title: 'Fundamentals still matter',
      copy: 'Commercial logic, economics, competitive position, execution and underlying assumptions remain central to understanding an opportunity.',
    },
    {
      title: 'Judgement adapts to the situation',
      copy: 'The analytical emphasis should reflect the decision being considered rather than follow a predetermined template.',
    },
  ] satisfies EditorialPrinciple[],
  closingLines: ['The framework is disciplined.', 'The perspective remains adaptable.'],
};

export const industriesWeAssess = {
  eyebrow: 'Industries we assess',
  headlineLines: ['Perspective across', 'different commercial environments.'],
  intro:
    'DCL applies disciplined analysis across a diverse range of industries, adapting the focus of each review to the commercial characteristics, economics, risks and strategic considerations relevant to the opportunity.',
  sectors: [
    {
      name: 'Real Estate & Property',
      supportingLine: 'Understanding value beyond the asset.',
      description:
        'Consider market conditions, demand, location, asset or business fundamentals, capital requirements, operating characteristics and the factors that may influence long-term commercial value.',
    },
    {
      name: 'Technology & AI',
      supportingLine: 'Evaluating commercial potential behind innovation.',
      description:
        'Examine the business model, adoption potential, scalability, competitive environment, technology dependencies and the path from innovation to sustainable commercial value.',
    },
    {
      name: 'Healthcare & Life Sciences',
      supportingLine: 'Assessing opportunity within a complex operating environment.',
      description:
        'Consider market need, commercial model, operating requirements, regulatory context, execution dependencies and the factors affecting the ability to create sustainable value.',
    },
    {
      name: 'Energy & Infrastructure',
      supportingLine: 'Long-term opportunity shaped by economics and execution.',
      description:
        'Examine demand, project or business economics, capital intensity, delivery requirements, operating dependencies, regulatory environment and long-term commercial resilience.',
    },
    {
      name: 'Financial Services',
      supportingLine: 'Understanding economics, risk and operating reality.',
      description:
        'Consider the business model, underlying economics, competitive position, regulatory environment, operating dependencies and the risks that may materially influence performance.',
    },
    {
      name: 'Industrial & Manufacturing',
      supportingLine: 'Commercial performance built on operating fundamentals.',
      description:
        'Assess demand, capacity, cost structure, supply chains, capital requirements, operational efficiency and the commercial factors influencing long-term competitiveness.',
    },
    {
      name: 'Consumer & Retail',
      supportingLine: 'Understanding demand, economics and customer behaviour.',
      description:
        'Consider customer demand, brand positioning, channels, margins, unit economics, competitive dynamics and the factors influencing sustainable commercial performance.',
    },
    {
      name: 'Logistics & Supply Chain',
      supportingLine: 'Evaluating networks, dependencies and resilience.',
      description:
        'Examine infrastructure, network economics, utilisation, operating costs, customer concentration, supply-chain dependencies and the ability to perform across changing conditions.',
    },
    {
      name: 'Hospitality & Leisure',
      supportingLine: 'Commercial performance shaped by demand and execution.',
      description:
        'Consider location, demand, utilisation, pricing, operating model, customer behaviour, cost structure and the factors that may influence resilience across market cycles.',
    },
    {
      name: 'Natural Resources & Materials',
      supportingLine: 'Understanding economics within market and operating constraints.',
      description:
        'Consider demand, cost structure, logistics, capital intensity, market dependencies, operating requirements and the factors capable of materially influencing commercial outcomes.',
    },
    {
      name: 'Professional & Business Services',
      supportingLine: 'Evaluating the strength behind service-led businesses.',
      description:
        'Examine revenue characteristics, client concentration, service economics, scalability, talent dependencies, competitive position and the sustainability of the underlying business model.',
    },
    {
      name: 'Emerging & Special Situations',
      supportingLine: 'Clarity where conventional frameworks may be insufficient.',
      description:
        'Consider opportunities involving evolving business models, unusual structures, fragmented information or greater uncertainty, with particular focus on assumptions, dependencies, execution and downside factors.',
    },
  ] satisfies Sector[],
  closingLines: ['The sector changes.', 'The need for clarity does not.'],
};

export const whatWeLookFor = {
  eyebrow: 'What we look for across sectors',
  headlineLines: ['The sector changes.', 'The fundamentals still matter.'],
  intro:
    'Every industry has its own operating realities, but strong evaluation still depends on understanding the fundamentals that shape commercial value, resilience and strategic relevance.',
  areas: [
    {
      name: 'Market context',
      question: 'What environment does the opportunity operate within?',
      description: 'Consider demand, market structure, competitive dynamics, timing and the external conditions that may materially influence the opportunity.',
    },
    {
      name: 'Business model',
      question: 'How is value actually created?',
      description: 'Examine how the business or opportunity generates revenue, delivers value, manages costs and translates activity into sustainable commercial performance.',
    },
    {
      name: 'Financial fundamentals',
      question: 'What do the economics indicate?',
      description: 'Consider the underlying economics, performance characteristics, capital requirements, assumptions and financial factors most relevant to the decision.',
    },
    {
      name: 'Competitive position',
      question: 'What supports differentiation or resilience?',
      description: 'Assess positioning, competitive pressures, barriers, customer relationships and the factors that may strengthen or weaken the opportunity over time.',
    },
    {
      name: 'Risk & dependencies',
      question: 'What could materially change the outcome?',
      description: 'Identify the assumptions, dependencies, operational constraints and uncertainties capable of materially influencing performance or execution.',
    },
    {
      name: 'Strategic relevance',
      question: 'How does the opportunity fit the wider objective?',
      description: 'Consider timing, alternatives, strategic alignment and whether the opportunity supports the broader direction behind the decision.',
    },
  ] satisfies FundamentalArea[],
  closingLines: ['Different industries require different emphasis.', 'The discipline of the questions remains.'],
};

export const sectorPerspectiveMatters = {
  eyebrow: 'Where sector perspective matters',
  headlineLines: ['Industry context matters', 'when the decision does.'],
  intro:
    'Sector perspective becomes particularly valuable when commercial conditions, operating realities or industry-specific dependencies could materially affect the decision.',
  contexts: [
    {
      name: 'Investment opportunities',
      description: 'Understand how sector conditions, commercial fundamentals and industry-specific risks may influence the attractiveness of an opportunity.',
    },
    {
      name: 'Acquisitions',
      description: 'Consider the target within its market, competitive environment, operating model and sector-specific commercial realities.',
    },
    {
      name: 'Market entry',
      description: 'Assess demand, competition, operating requirements, barriers and the practical implications of entering a new market.',
    },
    {
      name: 'Growth & expansion',
      description: 'Evaluate whether sector conditions, economics, resources and execution requirements support sustainable expansion.',
    },
    {
      name: 'Strategic partnerships',
      description: 'Consider sector dynamics, commercial fit, dependencies and the implications of combining capabilities or entering a strategic relationship.',
    },
    {
      name: 'Business assessment',
      description: 'Develop a clearer understanding of performance, positioning and the industry factors influencing the underlying business.',
    },
  ] satisfies DecisionContext[],
  closingLines: ['The decision may be familiar.', 'The environment rarely is.'],
};

export const crossSectorPerspective = {
  headlineLines: ['Insight can travel', 'across industries.'],
  lead: 'Different sectors often reveal different approaches to growth, economics, resilience, execution and risk.',
  body: [
    'Examining opportunities across varied commercial environments can help challenge assumptions and provide a broader perspective on what may be possible, what may be unusual and what deserves closer attention.',
    'Cross-sector perspective does not replace industry-specific understanding. It can strengthen it by introducing additional reference points, questions and ways of thinking about the decision.',
  ],
  backgroundTerms: ['Growth', 'Risk', 'Resilience'],
  closingLines: ['Broader perspective.', 'Sharper questions.', 'Clearer judgement.'],
};

export const industriesFinalCta = {
  smallStatementLines: ['Sector perspective.', 'Decision clarity.'],
  headlineLines: ['A clearer view', 'of the opportunity.'],
  supporting: 'Discuss an opportunity with DCL and explore how independent analysis and sector-aware perspective may support the decision.',
  primaryCta: { label: 'Start a Conversation', href: '/#about' },
  secondaryCta: { label: 'Explore Our Expertise', href: '/expertise' },
  closing: 'Clarity Before Capital.',
};
