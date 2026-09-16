import { describe, expect, it } from 'vitest';
import {
  keyAreasOfMaAdvisory,
  maFinalCta,
  maHero,
  maOurPerspective,
  maWhyDcl,
  transactionApproach,
  transactionFocus,
} from './ma-acquisition-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { maHero, maOurPerspective, keyAreasOfMaAdvisory, transactionApproach, transactionFocus, maWhyDcl, maFinalCta };

describe('ma-acquisition-advisory-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(maHero.label).toBe('Transaction Perspective');
    expect(maHero.headlineLines).toEqual(['M&A & Acquisition', 'Advisory']);
    expect(maHero.keywords).toHaveLength(4);
  });

  it('key areas of M&A advisory has exactly four areas', () => {
    expect(keyAreasOfMaAdvisory.areas).toHaveLength(4);
  });

  it('transaction approach has exactly four rows and a CTA, with no decorative numbering', () => {
    expect(transactionApproach.rows).toHaveLength(4);
    expect(transactionApproach.cta.label).toBe('Explore Our Approach');
    for (const row of transactionApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('transaction focus has exactly four areas', () => {
    expect(transactionFocus.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(maWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(maFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(maFinalCta.secondaryCta.href).toBe('/services');
    expect(maFinalCta.closing).toBe('Clarity Before Capital.');
    expect(maFinalCta.closingKeywords.length).toBeGreaterThan(0);
  });

  it('does not imply brokerage or direct transaction execution', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['brokerage', 'we execute', 'guarantee', 'guaranteed return', 'we source deals']) {
      expect(text).not.toContain(phrase);
    }
  });

  it('does not imply DCL holds money, has custody, or manages client assets', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['we manage your', 'custody of', 'discretionary portfolio', 'discretionary management']) {
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
