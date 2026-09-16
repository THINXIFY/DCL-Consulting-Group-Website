import { describe, expect, it } from 'vitest';
import {
  keyAreasOfMarketEntry,
  marketAreasOfFocus,
  marketFinalCta,
  marketHero,
  marketOurApproach,
  marketOurPerspective,
  marketWhyDcl,
} from './market-entry-expansion-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { marketHero, marketOurPerspective, keyAreasOfMarketEntry, marketOurApproach, marketAreasOfFocus, marketWhyDcl, marketFinalCta };

describe('market-entry-expansion-advisory-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(marketHero.label).toBe('New Markets. Greater Possibilities.');
    expect(marketHero.headlineLines).toEqual(['Market Entry &', 'Expansion Advisory']);
    expect(marketHero.keywords).toHaveLength(4);
  });

  it('key areas has exactly four areas', () => {
    expect(keyAreasOfMarketEntry.areas).toHaveLength(4);
  });

  it('our approach has exactly four rows and a CTA, with no decorative numbering', () => {
    expect(marketOurApproach.rows).toHaveLength(4);
    expect(marketOurApproach.cta.label).toBe('Explore Our Approach');
    for (const row of marketOurApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('areas of focus has exactly four areas', () => {
    expect(marketAreasOfFocus.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(marketWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(marketFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(marketFinalCta.secondaryCta.href).toBe('/services');
    expect(marketFinalCta.closing).toBe('Clarity Before Capital.');
    expect(marketFinalCta.closingKeywords.length).toBeGreaterThan(0);
  });

  it('does not imply DCL holds money, has custody, or guarantees returns', () => {
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
