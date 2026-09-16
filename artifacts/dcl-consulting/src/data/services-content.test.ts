import { describe, expect, it } from 'vitest';
import {
  allServices,
  howWeWork,
  selectedServices,
  serviceDirectory,
  serviceDirectoryIntro,
  servicesFaq,
  servicesFinalCta,
  servicesHero,
  whyChooseDcl,
} from './services-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

const EXPECTED_ROUTES = [
  '/services/investment-consulting',
  '/services/asset-portfolio-advisory',
  '/services/wealth-strategy-advisory',
  '/services/private-capital-advisory',
  '/services/real-estate-investment-advisory',
  '/services/strategic-advisory',
  '/services/ma-acquisition-advisory',
  '/services/market-entry-expansion-advisory',
  '/services/due-diligence-support',
  '/services/risk-opportunity-assessment',
];

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { servicesHero, serviceDirectoryIntro, serviceDirectory, howWeWork, whyChooseDcl, selectedServices, servicesFaq, servicesFinalCta };

describe('services-content', () => {
  it('hero has the label, headline, lead, supporting copy, both CTAs, and vocabulary', () => {
    expect(servicesHero.headline).toBe('Services');
    expect(servicesHero.vocabulary).toHaveLength(3);
    expect(servicesHero.primaryCta.href).toBe('/#about');
  });

  it('service directory contains exactly four families covering all ten completed service routes, with no duplicates', () => {
    expect(serviceDirectory.families).toHaveLength(4);
    const allDirectoryServices = serviceDirectory.families.flatMap((f) => f.services);
    expect(allDirectoryServices).toHaveLength(10);
    const hrefs = allDirectoryServices.map((s) => s.href).sort();
    expect(hrefs).toEqual([...EXPECTED_ROUTES].sort());
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it('the Investment & Private Capital family has four services and Real Estate & Assets has one', () => {
    const investment = serviceDirectory.families.find((f) => f.heading === 'Investment & Private Capital');
    const realEstate = serviceDirectory.families.find((f) => f.heading === 'Real Estate & Assets');
    expect(investment?.services).toHaveLength(4);
    expect(realEstate?.services).toHaveLength(1);
  });

  it('the Corporate & Strategic family has three services and Analysis & Decision Support has two', () => {
    const corporate = serviceDirectory.families.find((f) => f.heading === 'Corporate & Strategic');
    const analysis = serviceDirectory.families.find((f) => f.heading === 'Analysis & Decision Support');
    expect(corporate?.services).toHaveLength(3);
    expect(analysis?.services).toHaveLength(2);
  });

  it('how we work has exactly four stages with no decorative numbering', () => {
    expect(howWeWork.stages).toHaveLength(4);
    for (const stage of howWeWork.stages) {
      expect(stage.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('why choose DCL has a CTA and at least four principles', () => {
    expect(whyChooseDcl.cta.href).toBe('/approach');
    expect(whyChooseDcl.principles.length).toBeGreaterThanOrEqual(4);
  });

  it('selected services features exactly three services with valid, real routes', () => {
    expect(selectedServices.featured).toHaveLength(3);
    for (const item of selectedServices.featured) {
      expect(EXPECTED_ROUTES).toContain(item.href);
    }
  });

  it('FAQ has exactly seven questions and a side CTA', () => {
    expect(servicesFaq.items).toHaveLength(7);
    expect(servicesFaq.sideCta.cta.label.length).toBeGreaterThan(0);
  });

  it('the asset-management FAQ answer does not imply custody, execution, or discretionary management', () => {
    const item = servicesFaq.items.find((i) => i.question.toLowerCase().includes('manage assets'));
    expect(item).toBeDefined();
    const text = item!.answer.toLowerCase();
    expect(text).not.toContain('we manage your');
    expect(text).not.toContain('custody of');
  });

  it('final CTA has the label, headline, supporting copy, and primary CTA', () => {
    expect(servicesFinalCta.label).toBe("Let's Talk");
    expect(servicesFinalCta.primaryCta.href).toBe('/#about');
  });

  it('allServices derives exactly ten services from the mega-menu data, matching the directory routes', () => {
    expect(allServices).toHaveLength(10);
    const slugs = allServices.map((s) => s.slug).sort();
    const expectedSlugs = EXPECTED_ROUTES.map((r) => r.split('/').pop()).sort();
    expect(slugs).toEqual(expectedSlugs);
  });

  it('does not imply DCL holds money, has custody, executes trades, or guarantees returns', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage', 'discretionary portfolio', 'discretionary management']) {
      expect(text).not.toContain(phrase);
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
