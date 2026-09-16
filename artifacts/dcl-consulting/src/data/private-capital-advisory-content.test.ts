import { describe, expect, it } from 'vitest';
import {
  investmentApproach,
  investmentFocus,
  keyAreasOfPrivateCapitalAdvisory,
  privateCapitalFinalCta,
  privateCapitalHero,
  privateCapitalOurPerspective,
  privateCapitalWhyDcl,
} from './private-capital-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = {
  privateCapitalHero,
  privateCapitalOurPerspective,
  keyAreasOfPrivateCapitalAdvisory,
  investmentApproach,
  investmentFocus,
  privateCapitalWhyDcl,
  privateCapitalFinalCta,
};

describe('private-capital-advisory-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(privateCapitalHero.label).toBe('Capital With Perspective');
    expect(privateCapitalHero.headlineLines).toEqual(['Private Capital', 'Advisory']);
    expect(privateCapitalHero.keywords).toHaveLength(4);
  });

  it('key areas of advisory has exactly four areas', () => {
    expect(keyAreasOfPrivateCapitalAdvisory.areas).toHaveLength(4);
  });

  it('investment approach has exactly four rows and a CTA, with no decorative numbering in row names', () => {
    expect(investmentApproach.rows).toHaveLength(4);
    expect(investmentApproach.cta.label).toBe('Explore Our Approach');
    for (const row of investmentApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('investment focus has exactly four areas', () => {
    expect(investmentFocus.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(privateCapitalWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(privateCapitalFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(privateCapitalFinalCta.secondaryCta.href).toBe('/services');
    expect(privateCapitalFinalCta.closing).toBe('Clarity Before Capital.');
    expect(privateCapitalFinalCta.closingKeywords.length).toBeGreaterThan(0);
  });

  it('does not promise deal sourcing, returns, or direct transaction execution', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['we source deals', 'guaranteed return', 'we execute', 'guarantee']) {
      expect(text).not.toContain(phrase);
    }
  });

  it('does not imply DCL holds money, has custody, or operates discretionary management', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['we manage your', 'custody of', 'discretionary portfolio', 'discretionary management', 'brokerage']) {
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
