import { describe, expect, it } from 'vitest';
import { allMegaMenuServices, servicesMegaMenu } from './services-nav-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

const EXPECTED_ROUTES = [
  '/services/real-estate-investment-advisory',
  '/services/investment-consulting',
  '/services/asset-portfolio-advisory',
  '/services/wealth-strategy-advisory',
  '/services/private-capital-advisory',
  '/services/strategic-advisory',
  '/services/ma-acquisition-advisory',
  '/services/market-entry-expansion-advisory',
  '/services/due-diligence-support',
  '/services/risk-opportunity-assessment',
];

describe('services-nav-content', () => {
  it('lists exactly the ten completed service pages, each with a route and a description', () => {
    expect(allMegaMenuServices).toHaveLength(10);
    const hrefs = allMegaMenuServices.map((service) => service.href).sort();
    expect(hrefs).toEqual([...EXPECTED_ROUTES].sort());
    for (const service of allMegaMenuServices) {
      expect(service.label.length).toBeGreaterThan(0);
      expect(service.description.length).toBeGreaterThan(0);
    }
  });

  it('has no duplicate routes', () => {
    const hrefs = allMegaMenuServices.map((service) => service.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('groups all four service categories with the expected counts', () => {
    expect(servicesMegaMenu.groups).toHaveLength(4);
    const investment = servicesMegaMenu.groups.find((g) => g.heading === 'Investment & Private Capital');
    const realEstate = servicesMegaMenu.groups.find((g) => g.heading === 'Real Estate & Assets');
    const corporate = servicesMegaMenu.groups.find((g) => g.heading === 'Corporate & Strategic');
    const analysis = servicesMegaMenu.groups.find((g) => g.heading === 'Analysis & Decision Support');
    expect(investment?.services).toHaveLength(4);
    expect(realEstate?.services).toHaveLength(1);
    expect(corporate?.services).toHaveLength(3);
    expect(analysis?.services).toHaveLength(2);
  });

  it('includes a View All Services link to the hub', () => {
    expect(servicesMegaMenu.viewAll).toEqual({ label: 'View All Services', href: '/services' });
  });

  it('uses the approved public service names, not the regulated renames', () => {
    const labels = allMegaMenuServices.map((s) => s.label);
    expect(labels).toContain('Asset & Portfolio Advisory');
    expect(labels).toContain('Wealth Strategy Advisory');
    expect(labels).not.toContain('Asset Management');
    expect(labels).not.toContain('Wealth Management');
  });

  it('does not imply DCL provides brokerage, transaction execution, or formal legal opinion', () => {
    const text = allMegaMenuServices.map((s) => s.description).join(' ').toLowerCase();
    for (const phrase of ['brokerage', 'we execute', 'formal legal opinion', 'guarantee']) {
      expect(text).not.toContain(phrase);
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [servicesMegaMenu.label, servicesMegaMenu.description, ...allMegaMenuServices.flatMap((s) => [s.label, s.description])];
    for (const value of strings) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
