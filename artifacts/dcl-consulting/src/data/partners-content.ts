export interface PartnersPrinciple {
  label: string;
  headline: string;
  copy: string;
}

export interface PartnersStage {
  label: string;
  headline: string;
  copy: string;
}

export interface PartnershipArea {
  name: string;
  copy: string;
}

export interface ValuePrinciple {
  name: string;
  copy: string;
}

export const partnersHero = {
  eyebrow: 'Strategic Partnerships',
  headlineLines: ['Stronger perspectives', 'through collaboration.'],
  lead: 'The right relationships can bring together complementary expertise, broader context and new possibilities.',
  body: 'DCL works with organisations, specialist advisers and strategic counterparts where collaboration can create a clearer and more complete perspective around important investment, commercial and strategic decisions.',
  primaryCta: { label: 'Discuss a Partnership', href: '/contact' },
  secondaryCta: { label: 'Our Approach', href: '/approach' },
  statementLines: ['Shared thinking.', 'Complementary expertise.', 'Long-term value.'],
  image: {
    src: '/images/home/home-industries.webp',
    alt: 'Two glass towers with a honeycomb facade converging toward the sky, representing structures working together',
  },
};

export const whyPartnershipsMatter = {
  eyebrow: 'Why Partnerships Matter',
  headlineLines: ['Better outcomes can begin', 'with a broader perspective.'],
  body: [
    'Complex decisions rarely exist in isolation.',
    'Investment, commercial and strategic opportunities may involve different markets, sectors, technical disciplines, local environments and specialist considerations.',
    'Thoughtful collaboration can bring together the right perspectives while keeping the client’s objectives and the quality of the decision at the centre.',
  ],
  principles: [
    {
      label: 'Complementary Expertise',
      headline: 'The right expertise at the right moment.',
      copy: 'Collaboration can bring specialist knowledge into a wider strategic or investment perspective when it genuinely strengthens the quality of the analysis.',
    },
    {
      label: 'Broader Context',
      headline: 'A more complete view of the opportunity.',
      copy: 'Different professional, sector and geographic perspectives can reveal considerations that may otherwise remain outside the immediate view.',
    },
    {
      label: 'Aligned Objectives',
      headline: 'Collaboration with a clear purpose.',
      copy: 'We believe successful partnerships begin with clear expectations, professional standards and alignment around the needs of the opportunity.',
    },
  ] satisfies PartnersPrinciple[],
};

export const howWeWorkWithPartners = {
  eyebrow: 'How We Work With Partners',
  headlineLines: ['Independent thinking.', 'Connected expertise.'],
  intro: 'Our approach to collaboration is structured, transparent and centred on the requirements of the decision.',
  stages: [
    {
      label: 'Understand',
      headline: 'Start with the opportunity.',
      copy: 'We clarify the objectives, context and areas where complementary expertise may add meaningful value.',
    },
    {
      label: 'Align',
      headline: 'Establish a shared framework.',
      copy: 'We define roles, expectations, responsibilities and the principles guiding the collaboration.',
    },
    {
      label: 'Collaborate',
      headline: 'Bring the right perspectives together.',
      copy: 'Relevant expertise is combined while maintaining clear communication, professional independence and accountability.',
    },
    {
      label: 'Deliver',
      headline: 'Focus on what matters.',
      copy: 'The combined perspective is translated into practical, decision-relevant insight for the client or opportunity.',
    },
  ] satisfies PartnersStage[],
};

export const partnershipAreas = {
  eyebrow: 'Where We Collaborate',
  headlineLines: ['Where complementary expertise', 'can add perspective.'],
  areas: [
    { name: 'Investment & Private Capital', copy: 'Collaboration around investment opportunities, capital considerations and complex private-market decisions.' },
    { name: 'Real Estate & Assets', copy: 'Specialist perspective around real estate, real assets, technical considerations and asset-related opportunities.' },
    { name: 'Corporate Strategy', copy: 'Complementary expertise around strategic development, transformation, growth and significant business decisions.' },
    { name: 'M&A & Transactions', copy: 'Specialist perspectives supporting the evaluation of acquisitions, transactions and corporate combinations.' },
    { name: 'Market Entry & International Expansion', copy: 'Local, sector and specialist context relevant to cross-border growth and new-market decisions.' },
    { name: 'Due Diligence & Specialist Analysis', copy: 'Focused expertise where commercial, operational, technical, legal or other specialist review may be relevant.' },
  ] satisfies PartnershipArea[],
};

export const whatWeValue = {
  eyebrow: 'What We Value',
  headlineLines: ['The standard of the relationship', 'matters as much as the opportunity.'],
  intro: 'We look for relationships built around professional standards, complementary strengths and a shared commitment to clear, thoughtful decision-making.',
  principles: [
    { name: 'Independence', copy: 'Independent judgement should remain central to every collaboration.' },
    { name: 'Clarity', copy: 'Roles, expectations and communication should remain clear throughout.' },
    { name: 'Professionalism', copy: 'High standards of conduct and delivery are essential.' },
    { name: 'Commercial Understanding', copy: 'Expertise should remain grounded in the reality of the opportunity.' },
    { name: 'Trust', copy: 'Strong relationships depend on discretion, reliability and mutual respect.' },
    { name: 'Long-Term Thinking', copy: 'The strongest partnerships create value beyond a single interaction.' },
  ] satisfies ValuePrinciple[],
};

export const internationalPerspective = {
  eyebrow: 'International Perspective',
  headlineLines: ['Perspective', 'without borders.'],
  body: [
    'Investment and strategic decisions increasingly cross sectors, markets and geographies.',
    'Where relevant, strong professional relationships can provide valuable local or specialist context while DCL maintains a clear view of the wider commercial and strategic picture.',
  ],
  cta: { label: 'Explore Our Industries', href: '/industries' },
  statementLines: ['Global context.', 'Local understanding.', 'Clearer decisions.'],
  image: {
    src: '/images/home/home-expertise-architecture.webp',
    alt: 'Sweeping curved stone facade of a contemporary institutional building against a deep blue sky',
  },
};

export const partnersFinalCta = {
  eyebrow: "Let's Work Together",
  headlineLines: ['A stronger perspective', 'starts with the right relationship.'],
  body: 'If you see an opportunity for DCL and your organisation to bring complementary expertise together, we would be pleased to start a conversation.',
  primaryCta: { label: 'Discuss a Partnership', href: '/contact' },
  secondaryCta: { label: 'Contact DCL', href: '/contact' },
  closing: 'Clarity through collaboration.',
};
