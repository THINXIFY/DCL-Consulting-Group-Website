import { describe, expect, it } from 'vitest';
import {
  keyAreasOfRiskAssessment,
  riskAreasOfSupport,
  riskFinalCta,
  riskHero,
  riskOurApproach,
  riskOurPerspective,
  riskWhyDcl,
} from './risk-opportunity-assessment-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { riskHero, riskOurPerspective, keyAreasOfRiskAssessment, riskOurApproach, riskAreasOfSupport, riskWhyDcl, riskFinalCta };

describe('risk-opportunity-assessment-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(riskHero.label).toBe('A Clearer Perspective');
    expect(riskHero.headlineLines).toEqual(['Risk & Opportunity', 'Assessment']);
    expect(riskHero.keywords).toHaveLength(4);
  });

  it('key areas has exactly four areas', () => {
    expect(keyAreasOfRiskAssessment.areas).toHaveLength(4);
  });

  it('our approach has exactly four rows and a CTA, with no decorative numbering', () => {
    expect(riskOurApproach.rows).toHaveLength(4);
    expect(riskOurApproach.cta.label).toBe('Explore Our Process');
    for (const row of riskOurApproach.rows) {
      expect(row.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('areas of support has exactly four areas', () => {
    expect(riskAreasOfSupport.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(riskWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs, the closing line, and closing keywords', () => {
    expect(riskFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(riskFinalCta.secondaryCta.href).toBe('/services');
    expect(riskFinalCta.closing).toBe('Clarity Before Capital.');
    expect(riskFinalCta.closingKeywords.length).toBeGreaterThan(0);
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
