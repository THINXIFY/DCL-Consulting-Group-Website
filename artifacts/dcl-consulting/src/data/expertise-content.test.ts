import { describe, expect, it } from 'vitest';
import { coreExpertise, expertiseFinalCta, expertiseHero, fourLenses, whereExpertiseApplies, whyDclExpertise } from './expertise-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

const REAL_SERVICE_ROUTES = [
  '/services',
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

const ALL_CONTENT = { expertiseHero, fourLenses, coreExpertise, whereExpertiseApplies, whyDclExpertise, expertiseFinalCta };

describe('expertise-content', () => {
  it('hero has the label, two-line headline, lead, supporting line, and both CTAs', () => {
    expect(expertiseHero.headlineLines).toHaveLength(2);
    expect(expertiseHero.primaryCta.href).toBe('/services');
    expect(expertiseHero.secondaryCta.href).toBe('#four-lenses');
  });

  it('four lenses has exactly four lenses', () => {
    expect(fourLenses.lenses).toHaveLength(4);
  });

  it('core expertise has exactly six capabilities, each with a real, valid route', () => {
    expect(coreExpertise.capabilities).toHaveLength(6);
    for (const capability of coreExpertise.capabilities) {
      expect(REAL_SERVICE_ROUTES).toContain(capability.href);
      expect(capability.title).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('every core expertise capability with a dedicated service page routes to it directly, not the generic hub', () => {
    const dedicated = ['Investment Consulting', 'Risk & Opportunity Assessment', 'Strategic Advisory', 'Due Diligence Support'];
    for (const capability of coreExpertise.capabilities) {
      if (dedicated.includes(capability.title)) {
        expect(capability.href).not.toBe('/services');
      }
    }
  });

  it('where expertise applies has exactly six areas, each with a valid route, and a view-all link', () => {
    expect(whereExpertiseApplies.areas).toHaveLength(6);
    for (const area of whereExpertiseApplies.areas) {
      expect(REAL_SERVICE_ROUTES).toContain(area.href);
    }
    expect(whereExpertiseApplies.link.href).toBe('/services');
  });

  it('why DCL expertise has exactly four principles', () => {
    expect(whyDclExpertise.principles).toHaveLength(4);
  });

  it('final CTA has the label, headline, supporting copy, both CTAs, and closing lines', () => {
    expect(expertiseFinalCta.label).toBe("Let's Talk");
    expect(expertiseFinalCta.primaryCta.href).toBe('/#about');
    expect(expertiseFinalCta.secondaryCta.href).toBe('/services');
    expect(expertiseFinalCta.closingLines).toHaveLength(2);
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
