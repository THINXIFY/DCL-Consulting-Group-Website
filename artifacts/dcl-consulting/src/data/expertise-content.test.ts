import { describe, expect, it } from 'vitest';
import { coreExpertise, expertiseFinalCta, expertiseHero, howWeAddPerspective, whereExpertiseApplies } from './expertise-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('expertise-content', () => {
  it('has exactly four analytical lenses on the hero, no fake numbers', () => {
    expect(expertiseHero.lenses).toHaveLength(4);
    for (const lens of expertiseHero.lenses) {
      expect(lens.category).toBeTruthy();
      expect(lens.phrase).toBeTruthy();
      expect(lens.phrase).not.toMatch(/\d/);
    }
  });

  it('has four how-we-add-perspective chapters, each with category, question, and copy', () => {
    expect(howWeAddPerspective.perspectives).toHaveLength(4);
    for (const item of howWeAddPerspective.perspectives) {
      expect(item).not.toHaveProperty('number');
      expect(item.category).toBeTruthy();
      expect(item.question).toBeTruthy();
      expect(item.copy).toBeTruthy();
    }
  });

  it('has exactly six core expertise areas, each with a title, supporting line, and description', () => {
    expect(coreExpertise.areas).toHaveLength(6);
    for (const area of coreExpertise.areas) {
      expect(area).not.toHaveProperty('number');
      expect(area.title).toBeTruthy();
      expect(area.supportingLine).toBeTruthy();
      expect(area.description).toBeTruthy();
    }
  });

  it('has exactly six decision contexts, each with a title, supporting line, and description', () => {
    expect(whereExpertiseApplies.contexts).toHaveLength(6);
    for (const context of whereExpertiseApplies.contexts) {
      expect(context).not.toHaveProperty('number');
      expect(context.title).toBeTruthy();
      expect(context.supportingLine).toBeTruthy();
      expect(context.description).toBeTruthy();
    }
  });

  it('has final CTA content with both CTAs pointing at a homepage anchor', () => {
    expect(expertiseFinalCta.primaryCta.href).toBe('/#about');
    expect(expertiseFinalCta.secondaryCta.href).toBe('/#about');
    expect(expertiseFinalCta.closing).toBe('Clarity Before Capital.');
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    const strings = [
      ...allStrings(expertiseHero),
      ...allStrings(howWeAddPerspective),
      ...allStrings(coreExpertise),
      ...allStrings(whereExpertiseApplies),
      ...allStrings(expertiseFinalCta),
    ];
    for (const s of strings) {
      expect(s).not.toMatch(NUMBERING_PATTERN);
      expect(s).not.toMatch(DASH_CHARS);
    }
  });
});
