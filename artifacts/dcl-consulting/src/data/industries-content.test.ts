import { describe, expect, it } from 'vitest';
import { crossSectorPerspective, disciplinedApproach, industriesFinalCta, industriesHero, industriesIntro, industryDirectory, whereInsightMatters } from './industries-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { industriesHero, industriesIntro, industryDirectory, disciplinedApproach, crossSectorPerspective, whereInsightMatters, industriesFinalCta };

describe('industries-content', () => {
  it('hero has the eyebrow, two-line headline, lead, and image', () => {
    expect(industriesHero.headlineLines).toHaveLength(2);
    expect(industriesHero.image.src).toMatch(/\.webp$/);
    expect(industriesHero.image.alt.length).toBeGreaterThan(0);
  });

  it('the industry directory has exactly twelve sectors across all groups, with no duplicates', () => {
    const all = [industryDirectory.featured, ...industryDirectory.medium, ...industryDirectory.compactImage, ...industryDirectory.textRows];
    expect(all).toHaveLength(12);
    const names = all.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('every image-bearing sector in the directory has a real, distinct image', () => {
    const withImages = [industryDirectory.featured, ...industryDirectory.medium, ...industryDirectory.compactImage];
    expect(withImages).toHaveLength(6);
    for (const sector of withImages) {
      expect(sector.image?.src).toMatch(/\.webp$/);
      expect(sector.image?.alt.length).toBeGreaterThan(0);
    }
    const srcs = withImages.map((s) => s.image?.src);
    expect(new Set(srcs).size).toBe(srcs.length);
  });

  it('text-row sectors have no image', () => {
    for (const sector of industryDirectory.textRows) {
      expect(sector.image).toBeUndefined();
    }
  });

  it('the disciplined approach has exactly four columns', () => {
    expect(disciplinedApproach.columns).toHaveLength(4);
    for (const column of disciplinedApproach.columns) {
      expect(column.name).not.toMatch(NUMBERING_PATTERN);
    }
  });

  it('cross-sector perspective does not reference fake maps, network nodes, or world diagrams', () => {
    const text = crossSectorPerspective.copy.toLowerCase();
    expect(text).not.toContain('network');
    expect(text).not.toContain('map');
  });

  it('where insight matters has exactly eight items', () => {
    expect(whereInsightMatters.items).toHaveLength(8);
  });

  it('final CTA has the eyebrow, headline, copy, and a single CTA routing to /contact', () => {
    expect(industriesFinalCta.eyebrow).toBe('Start a Conversation');
    expect(industriesFinalCta.cta.label).toBe('Contact DCL');
    expect(industriesFinalCta.cta.href).toBe('/contact');
  });

  it('does not imply DCL holds money, has custody, executes trades, or guarantees returns', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    for (const phrase of ['guarantee', 'guaranteed return', 'we manage your', 'custody of', 'execute trades', 'brokerage']) {
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
