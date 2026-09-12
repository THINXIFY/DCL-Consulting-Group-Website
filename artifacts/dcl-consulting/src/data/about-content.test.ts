import { describe, expect, it } from 'vitest';
import { howWeThink, leadershipApproach, leadershipFacts, leadershipImage, whatDefinesDcl } from './about-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(allStrings);
  }
  return [];
}

describe('about-content', () => {
  it('has four how-we-think chapters, each with a title, question, and copy', () => {
    expect(howWeThink).toHaveLength(4);
    for (const item of howWeThink) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.question).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('uses a verified picsum photo ID (not a random seed) for the leadership context image', () => {
    expect(leadershipImage).toMatch(/^https:\/\/picsum\.photos\/id\/\d+\//);
  });

  it('has four what-defines-dcl principles', () => {
    expect(whatDefinesDcl).toHaveLength(4);
    for (const item of whatDefinesDcl) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has three leadership-approach principles', () => {
    expect(leadershipApproach).toHaveLength(3);
    for (const item of leadershipApproach) {
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has exactly the three confirmed leadership facts, nothing invented', () => {
    expect(leadershipFacts).toEqual([
      { label: 'Director', value: 'David Christopher Lebond' },
      { label: 'Company', value: 'DCL Consulting and Investments Limited' },
      { label: 'Registered', value: 'England & Wales' },
    ]);
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [...allStrings(howWeThink), ...allStrings(whatDefinesDcl), ...allStrings(leadershipApproach), ...allStrings(leadershipFacts)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
