import { describe, expect, it } from 'vitest';
import {
  howWeWorkWithPartners,
  internationalPerspective,
  partnersFinalCta,
  partnersHero,
  partnershipAreas,
  whatWeValue,
  whyPartnershipsMatter,
} from './partners-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { partnersHero, whyPartnershipsMatter, howWeWorkWithPartners, partnershipAreas, whatWeValue, internationalPerspective, partnersFinalCta };

describe('partners-content', () => {
  it('has three why-partnerships principles, no numbering fields', () => {
    expect(whyPartnershipsMatter.principles).toHaveLength(3);
    expect(whyPartnershipsMatter.principles.map((p) => p.label)).toEqual(['Complementary Expertise', 'Broader Context', 'Aligned Objectives']);
  });

  it('has four how-we-work stages with no step numbers', () => {
    expect(howWeWorkWithPartners.stages).toHaveLength(4);
    expect(howWeWorkWithPartners.stages.map((s) => s.label)).toEqual(['Understand', 'Align', 'Collaborate', 'Deliver']);
    for (const stage of howWeWorkWithPartners.stages) {
      expect(stage).not.toHaveProperty('number');
    }
  });

  it('has exactly six partnership areas', () => {
    expect(partnershipAreas.areas).toHaveLength(6);
    expect(partnershipAreas.areas.map((a) => a.name)).toEqual([
      'Investment & Private Capital',
      'Real Estate & Assets',
      'Corporate Strategy',
      'M&A & Transactions',
      'Market Entry & International Expansion',
      'Due Diligence & Specialist Analysis',
    ]);
  });

  it('has exactly six what-we-value principles', () => {
    expect(whatWeValue.principles).toHaveLength(6);
    expect(whatWeValue.principles.map((p) => p.name)).toEqual(['Independence', 'Clarity', 'Professionalism', 'Commercial Understanding', 'Trust', 'Long-Term Thinking']);
  });

  it('does not invent any partner names, logos, quotes or statistics anywhere in the page content', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const forbidden of ['trusted by', 'testimonial', 'logo', '% of', 'award-winning', 'selected relationships']) {
      expect(text).not.toContain(forbidden);
    }
  });

  it('routes every CTA to a real, existing route', () => {
    const REAL_ROUTES = new Set(['/contact', '/approach', '/industries']);
    expect(REAL_ROUTES.has(partnersHero.primaryCta.href)).toBe(true);
    expect(REAL_ROUTES.has(partnersHero.secondaryCta.href)).toBe(true);
    expect(REAL_ROUTES.has(internationalPerspective.cta.href)).toBe(true);
    expect(REAL_ROUTES.has(partnersFinalCta.primaryCta.href)).toBe(true);
    expect(REAL_ROUTES.has(partnersFinalCta.secondaryCta.href)).toBe(true);
  });

  it('uses real, locally hosted images, not hot-linked placeholders', () => {
    expect(partnersHero.image.src).toContain('/images/home/');
    expect(partnersHero.image.alt).toBeTruthy();
    expect(internationalPerspective.image.src).toContain('/images/home/');
    expect(internationalPerspective.image.alt).toBeTruthy();
  });

  it('contains no decorative numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      if (value.startsWith('/') || value.startsWith('http')) continue;
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
