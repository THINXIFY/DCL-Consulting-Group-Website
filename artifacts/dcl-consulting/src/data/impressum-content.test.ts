import { describe, expect, it } from 'vitest';
import { impressumHero, impressumSections, impressumSupportCta } from './impressum-content';

const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

describe('impressum-content', () => {
  it('has the hero label, headline, intro, and last-updated date', () => {
    expect(impressumHero.label).toBe('Legal Information');
    expect(impressumHero.headline).toBe('Impressum');
    expect(impressumHero.intro).toBeTruthy();
    expect(impressumHero.lastUpdated).toBe('Last updated: 17 September 2026');
    expect(impressumHero.backgroundImage).toMatch(/^https:\/\//);
  });

  it('includes every approved section heading, in order', () => {
    expect(impressumSections.map((s) => s.heading)).toEqual([
      'Company Information',
      'Our Offices',
      'Company Register',
      'Legal Information',
      'Responsible for Website Content',
      'Regulatory Information',
      'Copyright',
    ]);
  });

  it('has the real, approved company details in Company Information', () => {
    const section = impressumSections.find((s) => s.id === 'company-information');
    expect(section?.facts).toEqual([
      { label: 'Company type', value: 'Private Limited Company' },
      { label: 'Company registration number', value: '10086906' },
      { label: 'Registered in', value: 'England and Wales' },
      { label: 'Email', value: 'info@dcl-consulting-group.com' },
      { label: 'Website', value: 'dcl-consulting-group.com' },
    ]);
  });

  it('does not show a telephone number anywhere', () => {
    const text = allStrings({ impressumHero, impressumSections, impressumSupportCta }).join(' ').toLowerCase();
    expect(text).not.toContain('phone');
    expect(text).not.toContain('telephone');
    expect(text).not.toContain('tel:');
  });

  it('separates the registered office and the London office, without mislabelling either', () => {
    const section = impressumSections.find((s) => s.id === 'our-offices');
    expect(section?.addresses).toEqual([
      { heading: 'Registered Office', lines: ['3 Tallow Wharf', 'Birchley Green', 'Hertford', 'Hertfordshire', 'England', 'SG14 1FF'] },
      { heading: 'London Office', lines: ['5 Beaconsfield Street', 'London', 'United Kingdom', 'N1C 4EW'] },
    ]);
    const text = allStrings(section).join(' ').toLowerCase();
    expect(text).not.toContain('registered headquarters');
    expect(text).not.toContain('companies house information');
  });

  it('links to the exact official Companies House officers profile, opened safely in a new tab', () => {
    const section = impressumSections.find((s) => s.id === 'company-register');
    const link = section?.links?.find((l) => l.label === 'View Official Company Profile');
    expect(link?.href).toBe('https://find-and-update.company-information.service.gov.uk/company/10086906/officers');
    expect(link?.external).toBe(true);
  });

  it('does not claim FCA authorisation, regulation, or licensing', () => {
    const text = allStrings({ impressumHero, impressumSections, impressumSupportCta }).join(' ').toLowerCase();
    expect(text).not.toContain('fca authorised');
    expect(text).not.toContain('fca regulated');
    expect(text).not.toContain('licensed investment manager');
    expect(text).not.toContain('regulated investment firm');
  });

  it('the copyright section links to the real Privacy Policy, Terms, and Contact routes', () => {
    const section = impressumSections.find((s) => s.id === 'copyright');
    expect(section?.links).toEqual([
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Contact DCL', href: '/contact' },
    ]);
    expect(section?.body[0]).toContain('2026');
  });

  it('the final support CTA routes to the real /contact page', () => {
    expect(impressumSupportCta.cta).toEqual({ label: 'Contact DCL', href: '/contact' });
  });

  it('contains no em-dash or en-dash characters anywhere', () => {
    for (const value of allStrings({ impressumHero, impressumSections, impressumSupportCta })) {
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
