import { describe, expect, it } from 'vitest';
import {
  commercialFinancial,
  howWeEvaluate,
  ourPerspective,
  realEstateFinalCta,
  realEstateHero,
  riskDueDiligence,
  whatWeAssess,
  whereWeSupport,
  whyDcl,
} from './real-estate-investment-advisory-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = {
  realEstateHero,
  ourPerspective,
  whatWeAssess,
  howWeEvaluate,
  commercialFinancial,
  riskDueDiligence,
  whereWeSupport,
  whyDcl,
  realEstateFinalCta,
};

describe('real-estate-investment-advisory-content', () => {
  it('hero has the label, two-line headline, supporting copy, CTA, and four keywords', () => {
    expect(realEstateHero.label).toBe('Real Assets. Real Perspective.');
    expect(realEstateHero.headlineLines).toEqual(['Real Estate', 'Investment Advisory']);
    expect(realEstateHero.cta).toEqual({ label: 'Discuss Your Objectives', href: '/#about' });
    expect(realEstateHero.keywords).toHaveLength(4);
  });

  it('what we assess has exactly four areas, each with a name and description', () => {
    expect(whatWeAssess.areas).toHaveLength(4);
    for (const area of whatWeAssess.areas) {
      expect(area.name.length).toBeGreaterThan(0);
      expect(area.description.length).toBeGreaterThan(0);
    }
  });

  it('how we evaluate has exactly five rows', () => {
    expect(howWeEvaluate.rows).toHaveLength(5);
  });

  it('commercial and financial has six list items', () => {
    expect(commercialFinancial.list).toHaveLength(6);
  });

  it('risk and due diligence has six list items and mentions no risk score or percentage', () => {
    expect(riskDueDiligence.list).toHaveLength(6);
    const text = [riskDueDiligence.body, ...riskDueDiligence.list].join(' ').toLowerCase();
    expect(text).not.toMatch(/%|percent|risk score/);
  });

  it('where we can support has exactly five areas', () => {
    expect(whereWeSupport.areas).toHaveLength(5);
  });

  it('why DCL has exactly four principles', () => {
    expect(whyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs and the closing line', () => {
    expect(realEstateFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(realEstateFinalCta.secondaryCta.href).toBe('/services');
    expect(realEstateFinalCta.closing).toBe('Clarity Before Capital.');
  });

  it('does not imply DCL directly manages money, holds assets, or guarantees returns', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage', 'fund manager']) {
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
