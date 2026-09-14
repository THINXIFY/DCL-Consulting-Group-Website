import { describe, expect, it } from 'vitest';
import {
  crossSectorPerspective,
  industriesFinalCta,
  industriesHero,
  industriesWeAssess,
  sectorAgnostic,
  sectorPerspectiveMatters,
  whatWeLookFor,
} from './industries-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

const SECTOR_ORDER = [
  'Real Estate & Property',
  'Technology & AI',
  'Healthcare & Life Sciences',
  'Energy & Infrastructure',
  'Financial Services',
  'Industrial & Manufacturing',
  'Consumer & Retail',
  'Logistics & Supply Chain',
  'Hospitality & Leisure',
  'Natural Resources & Materials',
  'Professional & Business Services',
  'Emerging & Special Situations',
];

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('industries-content', () => {
  it('has hero content with a three-line closing statement and between two and six sector slices', () => {
    expect(industriesHero.eyebrow).toBe('Industries');
    expect(industriesHero.closingLines).toEqual(['Different sectors.', 'Different dynamics.', 'The same need for clarity.']);
    expect(industriesHero.sectorSlices.length).toBeGreaterThanOrEqual(2);
    expect(industriesHero.sectorSlices.length).toBeLessThanOrEqual(6);
    for (const term of industriesHero.sectorSlices) {
      expect(term).not.toHaveProperty('number');
    }
  });

  it('has three sector-agnostic principles, each with a title and copy, no numbering', () => {
    expect(sectorAgnostic.principles).toHaveLength(3);
    for (const principle of sectorAgnostic.principles) {
      expect(principle).not.toHaveProperty('number');
      expect(principle.title).toBeTruthy();
      expect(principle.copy).toBeTruthy();
    }
    expect(sectorAgnostic.closingLines).toEqual(['The framework is disciplined.', 'The perspective remains adaptable.']);
  });

  it('has exactly the twelve approved sectors, in the approved order, each with real (non-numeric) content', () => {
    expect(industriesWeAssess.sectors.map((s) => s.name)).toEqual(SECTOR_ORDER);
    for (const sector of industriesWeAssess.sectors) {
      expect(sector).not.toHaveProperty('number');
      expect(sector.supportingLine).toBeTruthy();
      expect(sector.description).toBeTruthy();
      expect(sector.supportingLine).not.toMatch(/\d|%/);
      expect(sector.description).not.toMatch(/\d|%/);
    }
  });

  it('has exactly six fundamental areas, each with a name, question and description, no numbering', () => {
    expect(whatWeLookFor.areas).toHaveLength(6);
    for (const area of whatWeLookFor.areas) {
      expect(area).not.toHaveProperty('number');
      expect(area.name).toBeTruthy();
      expect(area.question).toBeTruthy();
      expect(area.description).toBeTruthy();
    }
    expect(whatWeLookFor.closingLines).toEqual(['Different industries require different emphasis.', 'The discipline of the questions remains.']);
  });

  it('has exactly six decision contexts, each with a name and description, no numbering', () => {
    expect(sectorPerspectiveMatters.contexts).toHaveLength(6);
    for (const context of sectorPerspectiveMatters.contexts) {
      expect(context).not.toHaveProperty('number');
      expect(context.name).toBeTruthy();
      expect(context.description).toBeTruthy();
    }
    expect(sectorPerspectiveMatters.closingLines).toEqual(['The decision may be familiar.', 'The environment rarely is.']);
  });

  it('has cross-sector perspective content with two to three background terms and a three-line closing statement', () => {
    expect(crossSectorPerspective.backgroundTerms.length).toBeGreaterThanOrEqual(2);
    expect(crossSectorPerspective.backgroundTerms.length).toBeLessThanOrEqual(3);
    expect(crossSectorPerspective.body).toHaveLength(2);
    expect(crossSectorPerspective.closingLines).toEqual(['Broader perspective.', 'Sharper questions.', 'Clearer judgement.']);
  });

  it('has final CTA content with both CTAs pointing at real destinations', () => {
    expect(industriesFinalCta.primaryCta.href).toBe('/#about');
    expect(industriesFinalCta.secondaryCta.href).toBe('/expertise');
    expect(industriesFinalCta.closing).toBe('Clarity Before Capital.');
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [
      ...allStrings(industriesHero),
      ...allStrings(sectorAgnostic),
      ...allStrings(industriesWeAssess),
      ...allStrings(whatWeLookFor),
      ...allStrings(sectorPerspectiveMatters),
      ...allStrings(crossSectorPerspective),
      ...allStrings(industriesFinalCta),
    ];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
