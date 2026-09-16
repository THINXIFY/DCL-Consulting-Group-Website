import { describe, expect, it } from 'vitest';
import {
  areasOfSupport,
  keyAreasOfWealthStrategy,
  wealthFinalCta,
  wealthHero,
  wealthOurApproach,
  wealthOurPerspective,
  wealthWhyDcl,
} from './wealth-strategy-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { wealthHero, wealthOurPerspective, keyAreasOfWealthStrategy, wealthOurApproach, areasOfSupport, wealthWhyDcl, wealthFinalCta };

describe('wealth-strategy-advisory-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(wealthHero.label).toBe('Long-Term Perspective');
    expect(wealthHero.headlineLines).toEqual(['Wealth Strategy', 'Advisory']);
    expect(wealthHero.keywords).toHaveLength(4);
  });

  it('key areas of wealth strategy has exactly four areas', () => {
    expect(keyAreasOfWealthStrategy.areas).toHaveLength(4);
  });

  it('our approach has exactly four rows and a CTA, with no decorative numbering in row names', () => {
    expect(wealthOurApproach.rows).toHaveLength(4);
    expect(wealthOurApproach.cta.label).toBe('Explore Our Process');
    for (const row of wealthOurApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('areas of support has exactly four areas', () => {
    expect(areasOfSupport.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(wealthWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(wealthFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(wealthFinalCta.secondaryCta.href).toBe('/services');
    expect(wealthFinalCta.closing).toBe('Clarity Before Capital.');
    expect(wealthFinalCta.closingKeywords.length).toBeGreaterThan(0);
  });

  it('uses Wealth Strategy Advisory language, not Wealth Management, and never implies discretionary management or guarantees', () => {
    const text = allStrings(ALL_CONTENT).join(' ');
    expect(text).not.toContain('Wealth Management');
    const lower = text.toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage', 'discretionary portfolio', 'discretionary management']) {
      expect(lower).not.toContain(phrase);
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
