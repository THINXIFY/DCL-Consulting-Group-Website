export interface ServiceNavItem {
  label: string;
  href: string;
  description: string;
}

export interface ServiceNavGroup {
  heading: string;
  services: ServiceNavItem[];
}

export const servicesMegaMenu = {
  label: 'Services',
  description: 'Independent perspective across investment, assets, corporate strategy and complex decision-making.',
  viewAll: { label: 'View All Services', href: '/services' },
  groups: [
    {
      heading: 'Investment & Private Capital',
      services: [
        { label: 'Investment Consulting', href: '/services/investment-consulting', description: 'Independent perspective around significant investment decisions.' },
        { label: 'Asset & Portfolio Advisory', href: '/services/asset-portfolio-advisory', description: 'Strategic perspective around assets, portfolios and risk.' },
        { label: 'Wealth Strategy Advisory', href: '/services/wealth-strategy-advisory', description: 'Long-term perspective around wealth priorities and capital decisions.' },
        { label: 'Private Capital Advisory', href: '/services/private-capital-advisory', description: 'Independent support for private-capital opportunities.' },
      ],
    },
    {
      heading: 'Real Estate & Assets',
      services: [
        { label: 'Real Estate Investment Advisory', href: '/services/real-estate-investment-advisory', description: 'Commercial and strategic perspective around real-estate opportunities.' },
      ],
    },
    {
      heading: 'Corporate & Strategic',
      services: [
        { label: 'Strategic Advisory', href: '/services/strategic-advisory', description: 'Independent perspective around growth, direction and strategic change.' },
        { label: 'M&A & Acquisition Advisory', href: '/services/ma-acquisition-advisory', description: 'Strategic analysis around acquisitions and significant transactions.' },
        { label: 'Market Entry & Expansion Advisory', href: '/services/market-entry-expansion-advisory', description: 'Commercial perspective around new markets and growth opportunities.' },
      ],
    },
    {
      heading: 'Analysis & Decision Support',
      services: [
        { label: 'Due Diligence Support', href: '/services/due-diligence-support', description: 'Structured independent review before important decisions.' },
        { label: 'Risk & Opportunity Assessment', href: '/services/risk-opportunity-assessment', description: 'Balanced analysis of uncertainty, upside and material factors.' },
      ],
    },
  ] satisfies ServiceNavGroup[],
};

// Flat list of every completed service, in the same order as the
// desktop/mobile group presentation - both surfaces now share one
// canonical order (Investment & Private Capital, Real Estate & Assets,
// Corporate & Strategic, Analysis & Decision Support), so there is no
// separate mobile-only ordering to maintain.
export const allMegaMenuServices: ServiceNavItem[] = servicesMegaMenu.groups.flatMap((group) => group.services);
