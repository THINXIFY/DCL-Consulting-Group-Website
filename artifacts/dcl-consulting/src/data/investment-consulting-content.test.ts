import { describe, expect, it } from 'vitest';
import {
  areasOfFocus,
  investmentAnalysis,
  investmentConsultingHero,
  investmentFinalCta,
  investmentWhyDcl,
  ourApproach,
  whatWeEvaluate,
} from './investment-consulting-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { investmentConsultingHero, ourApproach, whatWeEvaluate, investmentAnalysis, areasOfFocus, investmentWhyDcl, investmentFinalCta };

describe('investment-consulting-content', () => {
  it('hero has the label, two-line headline, intro, CTA, and four keywords', () => {
    expect(investmentConsultingHero.label).toBe('Investment Perspective');
    expect(investmentConsultingHero.headlineLines).toEqual(['Investment', 'Consulting']);
    expect(investmentConsultingHero.keywords).toHaveLength(4);
  });

  it('what we evaluate has exactly five areas', () => {
    expect(whatWeEvaluate.areas).toHaveLength(5);
  });

  it('investment analysis has exactly five rows and a CTA', () => {
    expect(investmentAnalysis.rows).toHaveLength(5);
    expect(investmentAnalysis.cta.label).toBe('Explore Our Process');
  });

  it('areas of focus has exactly four areas', () => {
    expect(areasOfFocus.areas).toHaveLength(4);
  });

  it('why DCL has exactly four principles', () => {
    expect(investmentWhyDcl.principles).toHaveLength(4);
  });

  it('final CTA has both CTAs and the closing line', () => {
    expect(investmentFinalCta.primaryCta.label).toBe('Start a Conversation');
    expect(investmentFinalCta.secondaryCta.href).toBe('/services');
    expect(investmentFinalCta.closing).toBe('Clarity Before Capital.');
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
