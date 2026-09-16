import { describe, expect, it } from 'vitest';
import { privacyDraftNotice, privacyHero, privacySections, privacySupportCta } from './privacy-content';

const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { privacyHero, privacyDraftNotice, privacySections, privacySupportCta };

describe('privacy-content', () => {
  it('hero has the label, headline, intro, and statement lines', () => {
    expect(privacyHero.label).toBe('Legal');
    expect(privacyHero.headline).toBe('Privacy Policy');
    expect(privacyHero.statementLines).toHaveLength(3);
  });

  it('includes a clearly worded draft notice indicating the content has not been legally approved', () => {
    const text = privacyDraftNotice.toLowerCase();
    expect(text).toContain('draft');
    expect(text).toMatch(/not.*(reviewed|approved)/);
  });

  it('every section has a unique id and a non-empty heading', () => {
    const ids = privacySections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of privacySections) {
      expect(section.heading.length).toBeGreaterThan(0);
      expect(section.body.length).toBeGreaterThan(0);
    }
  });

  it('includes all sections named in the reference brief', () => {
    const headings = privacySections.map((s) => s.heading);
    for (const expected of [
      'Introduction',
      'Information We Collect',
      'How We Use Your Data',
      'Cookies',
      'Your Rights',
      'Data Security',
      'Third Parties',
      'International Transfers',
      'Changes to This Policy',
      'Contact',
    ]) {
      expect(headings).toContain(expected);
    }
  });

  it('the contact section points to the real /contact route rather than inventing an email address', () => {
    expect(privacySupportCta.cta.href).toBe('/contact');
    const text = allStrings(ALL_CONTENT).join(' ');
    expect(text).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
  });

  it('does not fabricate specific regulator names or absolute security guarantees', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    expect(text).not.toContain('ico');
    expect(text).not.toContain('information commissioner');
    expect(text).not.toContain('100% secure');
  });

  it('contains no em-dash or en-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
