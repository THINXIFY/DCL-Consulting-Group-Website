import { describe, expect, it } from 'vitest';
import {
  keyAreasOfStrategicAdvisory,
  strategicAreasOfFocus,
  strategicFinalCta,
  strategicHero,
  strategicOurApproach,
  strategicOurPerspective,
  strategicWhyDcl,
} from './strategic-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { strategicHero, strategicOurPerspective, keyAreasOfStrategicAdvisory, strategicOurApproach, strategicAreasOfFocus, strategicWhyDcl, strategicFinalCta };

describe('strategic-advisory-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(strategicHero.label).toBe('Strategic Perspective');
    expect(strategicHero.headlineLines).toEqual(['Strategic', 'Advisory']);
    expect(strategicHero.keywords).toHaveLength(4);
  });

  it('key areas has exactly four areas', () => {
    expect(keyAreasOfStrategicAdvisory.areas).toHaveLength(4);
  });

  it('our approach has exactly four rows and a CTA, with no decorative numbering', () => {
    expect(strategicOurApproach.rows).toHaveLength(4);
    expect(strategicOurApproach.cta.label).toBe('Explore Our Process');
    for (const row of strategicOurApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('areas of focus has exactly four areas', () => {
    expect(strategicAreasOfFocus.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(strategicWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(strategicFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(strategicFinalCta.secondaryCta.href).toBe('/services');
    expect(strategicFinalCta.closing).toBe('Clarity Before Capital.');
    expect(strategicFinalCta.closingKeywords.length).toBeGreaterThan(0);
  });

  it('does not imply DCL holds money, has custody, or guarantees returns', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage']) {
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
