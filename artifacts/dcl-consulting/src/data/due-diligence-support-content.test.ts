import { describe, expect, it } from 'vitest';
import {
  dueDiligenceAreasOfSupport,
  dueDiligenceFinalCta,
  dueDiligenceHero,
  dueDiligenceOurPerspective,
  dueDiligenceProcess,
  dueDiligenceWhyDcl,
  keyAreasOfDueDiligence,
} from './due-diligence-support-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = {
  dueDiligenceHero,
  dueDiligenceOurPerspective,
  keyAreasOfDueDiligence,
  dueDiligenceProcess,
  dueDiligenceAreasOfSupport,
  dueDiligenceWhyDcl,
  dueDiligenceFinalCta,
};

describe('due-diligence-support-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(dueDiligenceHero.label).toBe('Independent Review');
    expect(dueDiligenceHero.headlineLines).toEqual(['Due Diligence', 'Support']);
    expect(dueDiligenceHero.keywords).toHaveLength(4);
  });

  it('key areas of due diligence has exactly four areas', () => {
    expect(keyAreasOfDueDiligence.areas).toHaveLength(4);
  });

  it('does not imply DCL itself provides formal legal opinion', () => {
    const legal = keyAreasOfDueDiligence.areas.find((a) => a.name.includes('Legal'));
    expect(legal?.description.toLowerCase()).not.toContain('we provide legal opinion');
    expect(legal?.description.toLowerCase()).toContain('specialist legal');
  });

  it('due diligence process has exactly four rows and a CTA, with no decorative numbering', () => {
    expect(dueDiligenceProcess.rows).toHaveLength(4);
    expect(dueDiligenceProcess.cta.label).toBe('Explore Our Process');
    for (const row of dueDiligenceProcess.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('areas of support has exactly four areas', () => {
    expect(dueDiligenceAreasOfSupport.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(dueDiligenceWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(dueDiligenceFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(dueDiligenceFinalCta.secondaryCta.href).toBe('/services');
    expect(dueDiligenceFinalCta.closing).toBe('Clarity Before Capital.');
    expect(dueDiligenceFinalCta.closingKeywords.length).toBeGreaterThan(0);
  });

  it('does not imply DCL holds money, has custody, or guarantees outcomes', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'we manage your', 'custody of', 'execute trades', 'brokerage']) {
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
