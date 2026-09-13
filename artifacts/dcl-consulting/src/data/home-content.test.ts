import { describe, expect, it } from 'vitest';
import { approach, companyFacts, expertise, faq, industries, philosophy, whoWeAdvise, whyDcl } from './home-content';

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

describe('home-content', () => {
  it('has six expertise items with no numbering fields', () => {
    expect(expertise).toHaveLength(6);
    for (const item of expertise) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
      expect(item.image).toBeTruthy();
    }
  });

  it('has five approach stages with no numbering fields', () => {
    expect(approach).toHaveLength(5);
    for (const stage of approach) {
      expect(stage).not.toHaveProperty('number');
      expect(stage.title).toBeTruthy();
      expect(stage.copy).toBeTruthy();
    }
  });

  it('has twelve industries with no numbering fields', () => {
    expect(industries).toHaveLength(12);
    for (const item of industries) {
      expect(item).not.toHaveProperty('number');
      expect(item.name).toBeTruthy();
      expect(item.context).toBeTruthy();
      expect(item.image).toBeTruthy();
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    // Image URLs are asset paths, not display copy, so they're excluded from
    // this decorative-numbering check (a placeholder path can legitimately
    // contain digits, e.g. a date segment).
    const strings = [...allStrings(expertise), ...allStrings(approach), ...allStrings(industries)].filter((s) => !s.startsWith('http'));
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });

  it('has three who-we-advise audiences and four why-dcl qualities, no numbering', () => {
    expect(whoWeAdvise).toHaveLength(3);
    expect(whyDcl).toHaveLength(4);
    for (const item of [...whoWeAdvise, ...whyDcl]) {
      expect(item).not.toHaveProperty('number');
      expect(item.title).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has exactly the five real company facts from the brief, nothing invented', () => {
    expect(companyFacts).toEqual([
      { label: 'Company', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company Type', value: 'Private Limited Company' },
      { label: 'Registered In', value: 'England & Wales' },
      { label: 'Company Number', value: '10086906' },
      { label: 'Director', value: 'David Christopher Lebond' },
    ]);
  });

  it('has five philosophy statements, each with a highlight word present in its own text', () => {
    expect(philosophy).toHaveLength(5);
    for (const item of philosophy) {
      expect(item.text).toContain(item.highlight);
    }
  });

  it('has no numbering or em-dash characters in the new arrays', () => {
    const strings = [...allStrings(whoWeAdvise), ...allStrings(whyDcl), ...allStrings(companyFacts), ...allStrings(philosophy)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });

  it('has eight FAQ items with no numbering or em-dash characters', () => {
    expect(faq).toHaveLength(8);
    for (const item of faq) {
      expect(item).not.toHaveProperty('number');
      expect(item.question).toBeTruthy();
      expect(item.answer).toBeTruthy();
    }
    for (const s of allStrings(faq)) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
