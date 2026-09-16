import { describe, expect, it } from 'vitest';
import { termsHero, termsSections, termsSupportCta } from './terms-content';

const NUMBERING_PATTERN = /\b(0?[1-9]|1[0-2])\s*[/.)-]/;
const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('terms-content', () => {
  it('has the expected hero content with a real, non-fabricated legal framing', () => {
    expect(termsHero.headline).toBe('Terms & Conditions');
    expect(termsHero.lead).toBeTruthy();
    expect(termsHero.statementLines).toEqual(['Clarity', 'Responsibility', 'Trust']);
  });

  it('has an about-dcl section with exactly the verified company facts, nothing invented', () => {
    const aboutSection = termsSections.find((section) => section.id === 'about-dcl');
    expect(aboutSection).toBeDefined();
    expect(aboutSection?.facts).toEqual([
      { label: 'Company name', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company number', value: '10086906' },
      { label: 'Jurisdiction', value: 'England and Wales' },
    ]);
  });

  it('does not include a governing-law section (no approved clause exists)', () => {
    const ids = termsSections.map((section) => section.id);
    const headings = termsSections.map((section) => section.heading.toLowerCase());
    expect(ids).not.toContain('governing-law');
    expect(headings.some((heading) => heading.includes('governing law'))).toBe(false);
  });

  it('links to the real Privacy Policy route and does not link to a non-existent Cookie Policy route', () => {
    const privacySection = termsSections.find((section) => section.id === 'privacy-cookies');
    expect(privacySection?.links).toEqual([{ label: 'Privacy Policy', href: '/privacy-policy' }]);
  });

  it('links to the real Contact route in the contact section, with no invented email or phone number', () => {
    const contactSection = termsSections.find((section) => section.id === 'contact');
    expect(contactSection?.links).toEqual([{ label: 'Contact DCL', href: '/contact' }]);
    const text = allStrings(termsSections).join(' ');
    expect(text).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(text).not.toMatch(/\+?\d[\d\s()-]{7,}\d/);
  });

  it('has every heading required by the source content and no invented extras', () => {
    expect(termsSections.map((section) => section.heading)).toEqual([
      'About DCL',
      'Introduction',
      'Information provided on this website',
      'Our services',
      'Use of the website',
      'Accuracy and availability',
      'Intellectual property',
      'Third-party websites',
      'Reliance on website content',
      'Privacy and cookies',
      'Changes to these terms',
      'Contact',
    ]);
  });

  it('contains no decorative numbering or em-dash characters anywhere', () => {
    for (const value of allStrings({ termsHero, termsSections, termsSupportCta })) {
      if (value.startsWith('/')) continue;
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });

  it('routes the support CTA to the real contact page', () => {
    expect(termsSupportCta.cta.href).toBe('/contact');
  });
});
