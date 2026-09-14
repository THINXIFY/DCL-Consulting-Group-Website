export interface EditorialPrinciple {
  title: string;
  copy: string;
}

export interface Sector {
  name: string;
  supportingLine: string;
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
