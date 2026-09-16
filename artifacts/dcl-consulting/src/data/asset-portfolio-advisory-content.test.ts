import { describe, expect, it } from 'vitest';
import {
  analyticalApproach,
  assetFinalCta,
  assetOurPerspective,
  assetPortfolioHero,
  assetWhyDcl,
  keyAreasOfAdvisory,
  portfolioConsiderations,
} from './asset-portfolio-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { assetPortfolioHero, assetOurPerspective, keyAreasOfAdvisory, analyticalApproach, portfolioConsiderations, assetWhyDcl, assetFinalCta };

describe('asset-portfolio-advisory-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(assetPortfolioHero.label).toBe('Portfolio Perspective');
    expect(assetPortfolioHero.headlineLines).toEqual(['Asset & Portfolio', 'Advisory']);
    expect(assetPortfolioHero.keywords).toHaveLength(4);
  });

  it('key areas of advisory has exactly four areas', () => {
    expect(keyAreasOfAdvisory.areas).toHaveLength(4);
  });

  it('analytical approach has exactly five rows and a CTA, with no decorative numbering in row names', () => {
    expect(analyticalApproach.rows).toHaveLength(5);
    expect(analyticalApproach.cta.label).toBe('Explore Our Process');
    for (const row of analyticalApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('portfolio considerations has six list items and a CTA', () => {
    expect(portfolioConsiderations.list).toHaveLength(6);
    expect(portfolioConsiderations.cta.label).toBe('Discuss Your Portfolio');
  });

  it('why DCL has exactly four principles', () => {
    expect(assetWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs and the closing line', () => {
    expect(assetFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(assetFinalCta.secondaryCta.href).toBe('/services');
    expect(assetFinalCta.closing).toBe('Clarity Before Capital.');
  });

  it('does not rename the service to Asset Management or Portfolio Management', () => {
    const text = allStrings(ALL_CONTENT).join(' ');
    expect(text).not.toContain('Asset Management');
    expect(text).not.toContain('Portfolio Management');
  });

  it('does not imply DCL holds money, has custody, executes trades, or guarantees returns', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage', 'discretionary portfolio management', 'investment fund']) {
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
