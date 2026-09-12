export interface ExpertiseItem {
  title: string;
  category: string;
  copy: string;
  image: string;
}

export interface ApproachStage {
  title: string;
  copy: string;
}

export interface IndustryItem {
  name: string;
  context: string;
  image: string;
}

const img = (seed: string, w = 1400, h = 1000) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

export const expertise: ExpertiseItem[] = [
  {
    title: 'Investment Consulting',
    category: 'Decision support',
    copy: 'Strategic guidance for evaluating opportunities and identifying the factors that should influence an investment decision.',
    image: img('dcl-exp-investment'),
  },
  {
    title: 'Opportunity Analysis',
    category: 'Commercial context',
    copy: 'Structured assessment of the business, market, and underlying potential behind an opportunity.',
    image: img('dcl-exp-opportunity'),
  },
  {
    title: 'Risk & Opportunity Assessment',
    category: 'Material considerations',
    copy: 'Balanced consideration of material risks, assumptions, dependencies, and potential upside.',
    image: img('dcl-exp-risk'),
  },
  {
    title: 'Business & Financial Analysis',
    category: 'Performance review',
    copy: 'Review of business performance, economics, and relevant financial factors.',
    image: img('dcl-exp-financial'),
  },
  {
    title: 'Strategic Advisory',
    category: 'Commercial direction',
    copy: 'Independent perspective on strategic decisions, growth opportunities, and commercial direction.',
    image: img('dcl-exp-strategy'),
  },
  {
    title: 'Due Diligence Support',
    category: 'Decision readiness',
    copy: 'Organised review of important information, assumptions, and unresolved questions before a significant decision.',
    image: img('dcl-exp-diligence'),
  },
];

export const approach: ApproachStage[] = [
  { title: 'Understand', copy: 'Establish the opportunity, objective, and wider context.' },
  { title: 'Analyse', copy: 'Review the business, market, economics, and relevant information.' },
  { title: 'Challenge', copy: 'Test assumptions, dependencies, and areas of uncertainty.' },
  { title: 'Assess', copy: 'Bring risk, opportunity, and strategic considerations together.' },
  { title: 'Advise', copy: 'Translate the analysis into clear, decision relevant perspective.' },
];

export const industries: IndustryItem[] = [
  { name: 'Real Estate', context: 'Property, development, and asset backed opportunities.', image: img('dcl-ind-realestate') },
  { name: 'Technology', context: 'Technology enabled businesses and digital growth opportunities.', image: img('dcl-ind-technology') },
  { name: 'Artificial Intelligence', context: 'Emerging capabilities, applications, and business models.', image: img('dcl-ind-ai') },
  { name: 'Healthcare', context: 'Healthcare services and health related businesses.', image: img('dcl-ind-healthcare') },
  { name: 'Pharmaceuticals', context: 'Products, platforms, and commercial life sciences.', image: img('dcl-ind-pharma') },
  { name: 'Financial Services', context: 'Financial institutions, platforms, and enabling infrastructure.', image: img('dcl-ind-financial') },
  { name: 'Consumer & Retail', context: 'Consumer behaviour, brands, and distribution models.', image: img('dcl-ind-consumer') },
  { name: 'Energy', context: 'Energy businesses and the transition around them.', image: img('dcl-ind-energy') },
  { name: 'Infrastructure', context: 'Essential networks, assets, and long term investment.', image: img('dcl-ind-infrastructure') },
  { name: 'Industrial', context: 'Industrial businesses, products, and operating models.', image: img('dcl-ind-industrial') },
  { name: 'Hospitality', context: 'Experiences, property, and service led businesses.', image: img('dcl-ind-hospitality') },
  { name: 'Professional Services', context: 'Knowledge businesses and specialist operators.', image: img('dcl-ind-professional') },
];
