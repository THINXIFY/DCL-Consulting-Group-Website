import { describe, expect, it } from 'vitest';
import { industriesHero, industriesWeAssess, sectorAgnostic } from './industries-content';

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

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [...allStrings(industriesHero), ...allStrings(sectorAgnostic), ...allStrings(industriesWeAssess)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
