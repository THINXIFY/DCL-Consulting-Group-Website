import { describe, expect, it } from 'vitest';
import { dclViewpoint, featuredInsight, insightsArchive, insightsFinalCta, insightsHero, insightThemes, latestPerspectives } from './insights-content';

const DATE_PATTERN = /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}\b/i;

describe('insights-content', () => {
  it('does not fabricate publication dates, read times, authors, or statistics', () => {
    const allText = [
      insightsHero.headlineLines.join(' '),
      insightsHero.lead,
      featuredInsight.title,
      featuredInsight.excerpt,
      ...latestPerspectives.flatMap((item) => [item.title, item.excerpt]),
      dclViewpoint.headlineLines.join(' '),
      dclViewpoint.copy,
      ...insightsArchive.flatMap((item) => [item.title, item.excerpt]),
      insightsFinalCta.headlineLines.join(' '),
      insightsFinalCta.copy,
    ].join(' ');

    expect(allText).not.toMatch(DATE_PATTERN);
    expect(allText).not.toMatch(/\bmin read\b/i);
    expect(allText).not.toMatch(/\bby\s+[A-Z][a-z]+\s+[A-Z][a-z]+\b/); // "By Firstname Lastname" byline shape
    expect(allText).not.toMatch(/\d+%/); // no invented statistics
  });

  it('contains no em-dash characters', () => {
    const allText = JSON.stringify({ insightsHero, featuredInsight, latestPerspectives, insightThemes, dclViewpoint, insightsArchive, insightsFinalCta });
    expect(allText).not.toMatch(/[–—]/);
  });

  it('every insight in the archive has a unique slug', () => {
    const slugs = insightsArchive.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('the archive is a superset containing the featured insight and every perspective', () => {
    const archiveSlugs = new Set(insightsArchive.map((item) => item.slug));
    expect(archiveSlugs.has(featuredInsight.slug)).toBe(true);
    for (const item of latestPerspectives) {
      expect(archiveSlugs.has(item.slug)).toBe(true);
    }
  });

  it('exposes exactly the eight brief-specified insight themes', () => {
    expect(insightThemes).toEqual(['Investment', 'Strategy', 'Private Capital', 'Real Estate', 'Markets', 'Risk', 'Transactions', 'International Growth']);
  });

  it('has one wide, two vertical, one text, and one image perspective (matching the brief)', () => {
    const counts = latestPerspectives.reduce<Record<string, number>>((acc, item) => {
      acc[item.variant] = (acc[item.variant] ?? 0) + 1;
      return acc;
    }, {});
    expect(counts).toEqual({ wide: 1, vertical: 2, text: 1, image: 1 });
  });

  it('the text-variant perspective has no image', () => {
    const textItem = latestPerspectives.find((item) => item.variant === 'text');
    expect(textItem?.image).toBeUndefined();
  });
});
