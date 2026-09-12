import { describe, expect, it } from 'vitest';
import { approach, expertise, industries } from './home-content';

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
      expect(item.image).toMatch(/^https:\/\/picsum\.photos\/seed\//);
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
      expect(item.image).toMatch(/^https:\/\/picsum\.photos\/seed\//);
    }
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [...allStrings(expertise), ...allStrings(approach), ...allStrings(industries)];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
