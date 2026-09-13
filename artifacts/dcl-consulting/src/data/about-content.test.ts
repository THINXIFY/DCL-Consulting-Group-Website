import { describe, expect, it } from 'vitest';
import { aboutHero, companyFoundations, finalCta, heroDocumentPlanes, howWeThink, leadership, whatDefinesDcl, whoWeAre } from './about-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('about-content', () => {
  it('has a two-line hero headline with one emphasised word', () => {
    expect(aboutHero.headlineLines).toEqual(['Clarity begins', 'with understanding.']);
    expect(aboutHero.headlineLines.join(' ')).toContain(aboutHero.headlineEmphasis);
  });

  it('has exactly five hero document plane labels, no fake numbers', () => {
    expect(heroDocumentPlanes).toHaveLength(5);
    for (const plane of heroDocumentPlanes) {
      expect(plane.label).toBeTruthy();
      expect(plane.label).not.toMatch(/\d/);
    }
  });

  it('has the who-we-are content with a five-line closing statement', () => {
    expect(whoWeAre.headlineLines).toEqual(['Independent thinking', 'for decisions that matter.']);
    expect(whoWeAre.closingLines).toHaveLength(5);
  });

  it('has four how-we-think chapters, each with a title, question, copy, and plane phrase', () => {
    expect(howWeThink.chapters).toHaveLength(4);
    for (const chapter of howWeThink.chapters) {
      expect(chapter).not.toHaveProperty('number');
      expect(chapter.title).toBeTruthy();
      expect(chapter.question).toBeTruthy();
      expect(chapter.copy).toBeTruthy();
      expect(chapter.planePhrase).toBeTruthy();
    }
  });

  it('has four what-defines-dcl principles and a three-line closing statement', () => {
    expect(whatDefinesDcl.principles).toHaveLength(4);
    for (const item of whatDefinesDcl.principles) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
    expect(whatDefinesDcl.closingLines).toHaveLength(3);
  });

  it('has leadership content with three principles, nothing invented', () => {
    expect(leadership.name).toBe('David Christopher Lebond');
    expect(leadership.role).toBe('Director');
    expect(leadership.principles).toHaveLength(3);
  });

  it('has exactly the five confirmed company facts, nothing invented', () => {
    expect(companyFoundations.facts).toEqual([
      { label: 'Company', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company Type', value: 'Private Limited Company' },
      { label: 'Registered In', value: 'England & Wales' },
      { label: 'Company Number', value: '10086906' },
      { label: 'Director', value: 'David Christopher Lebond' },
    ]);
  });

  it('has final CTA content with both CTAs pointing at homepage anchors', () => {
    expect(finalCta.primaryCta.href).toBe('/#about');
    expect(finalCta.secondaryCta.href).toBe('/#expertise');
    expect(finalCta.closing).toBe('Clarity Before Capital.');
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [
      ...allStrings(aboutHero),
      ...allStrings(heroDocumentPlanes),
      ...allStrings(whoWeAre),
      ...allStrings(howWeThink),
      ...allStrings(whatDefinesDcl),
      ...allStrings(leadership),
      ...allStrings(companyFoundations),
      ...allStrings(finalCta),
    ];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
