import { describe, expect, it } from 'vitest';
import { termsHero, termsSections, termsSupportCta } from './terms-content';

const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('terms-content', () => {
  it('has the approved hero content with the real last-updated date', () => {
    expect(termsHero.headline).toBe('Terms & Conditions');
    expect(termsHero.lead).toBeTruthy();
    expect(termsHero.statementLines).toEqual(['Clarity', 'Responsibility', 'Trust']);
    expect(termsHero.lastUpdated).toBe('Last updated: 17 September 2026');
  });

  it('has an about-dcl section with exactly the verified company facts, nothing invented', () => {
    const aboutSection = termsSections.find((section) => section.id === 'about-dcl');
    expect(aboutSection?.facts).toEqual([
      { label: 'Company name', value: 'DCL Consulting and Investments Limited' },
      { label: 'Company number', value: '10086906' },
      { label: 'Registered office', value: '3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF' },
      { label: 'Website', value: 'dcl-consulting-group.com' },
      { label: 'Contact', value: 'info@dcl-consulting-group.com' },
    ]);
  });

  it('includes the approved Governing Law section', () => {
    const section = termsSections.find((section) => section.id === 'governing-law');
    expect(section).toBeDefined();
    expect(section?.body.join(' ')).toContain('England and Wales');
  });

  it('links to the real Privacy Policy route and does not link to a non-existent Cookie Policy route', () => {
    const privacySection = termsSections.find((section) => section.id === 'privacy');
    expect(privacySection?.links).toEqual([{ label: 'Privacy Policy', href: '/privacy-policy' }]);
    const allLinks = termsSections.flatMap((section) => section.links ?? []);
    expect(allLinks.some((link) => /cookie/i.test(link.label))).toBe(false);
  });

  it('links to the real Privacy Policy, Impressum, and Contact routes in the contact section, with the real company details', () => {
    const contactSection = termsSections.find((section) => section.id === 'contact');
    expect(contactSection?.links).toEqual([
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Impressum', href: '/impressum' },
      { label: 'Contact DCL', href: '/contact' },
    ]);
    const text = contactSection!.body.join(' ');
    expect(text).toContain('info@dcl-consulting-group.com');
    expect(text).toContain('10086906');
  });

  it('has every approved heading, in order, and no invented extras', () => {
    expect(termsSections.map((section) => section.heading)).toEqual([
      'About DCL',
      'Purpose of This Website',
      'No Investment, Financial, Legal or Tax Advice',
      'No Offer or Solicitation',
      'Our Services',
      'Reliance on Website Information',
      'Use of the Website',
      'Request More Info Feature',
      'Intellectual Property',
      'Documents Provided Through the Website',
      'Third-Party Links',
      'Website Availability',
      'Warranties',
      'Limitation of Liability',
      'Privacy',
      'Security',
      'Changes to the Website',
      'Changes to These Terms',
      'Severability',
      'Governing Law',
      'Contact',
    ]);
  });

  it('describes the real Request More Info verification flow without inventing marketing/CRM claims', () => {
    const section = termsSections.find((section) => section.id === 'request-more-info-feature');
    const text = section!.body.join(' ').toLowerCase();
    expect(text).toContain('verification');
    expect(text).not.toContain('newsletter');
    expect(text).not.toContain('crm');
  });

  it('contains no decorative numbering or em-dash characters anywhere', () => {
    for (const value of allStrings({ termsHero, termsSections, termsSupportCta })) {
      if (value.startsWith('/')) continue;
      expect(value).not.toMatch(DASH_CHARS);
    }
  });

  it('routes the support CTA to the real contact page', () => {
    expect(termsSupportCta.cta).toEqual({ label: 'Contact DCL', href: '/contact' });
  });
});
