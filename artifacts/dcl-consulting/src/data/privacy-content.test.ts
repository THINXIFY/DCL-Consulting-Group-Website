import { describe, expect, it } from 'vitest';
import { privacyHero, privacySections, privacySupportCta } from './privacy-content';

const DASH_CHARS = /[–—]/;

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { privacyHero, privacySections, privacySupportCta };

describe('privacy-content', () => {
  it('hero has the approved label, headline, intro, and last-updated date', () => {
    expect(privacyHero.label).toBe('Legal');
    expect(privacyHero.headline).toBe('Privacy Policy');
    expect(privacyHero.intro).toBeTruthy();
    expect(privacyHero.statementLines).toHaveLength(3);
    expect(privacyHero.lastUpdated).toBe('Last updated: 17 September 2026');
  });

  it('every section has a unique id and a non-empty heading and body', () => {
    const ids = privacySections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of privacySections) {
      expect(section.heading.length).toBeGreaterThan(0);
      expect(section.body.length).toBeGreaterThan(0);
    }
  });

  it('includes every approved section heading, in order', () => {
    expect(privacySections.map((s) => s.heading)).toEqual([
      'Introduction',
      'Who We Are',
      'Information We May Collect',
      'How We Collect Information',
      'How We Use Personal Information',
      'Request More Info and Email Verification',
      'Email Delivery Providers',
      'Legal Basis for Processing',
      'Cookies and Similar Technologies',
      'Sharing Personal Information',
      'International Data Transfers',
      'Data Retention',
      'Security',
      'Your Data-Protection Rights',
      "Children's Privacy",
      'Third-Party Websites',
      'Changes to This Privacy Policy',
      'Contact Us',
    ]);
  });

  it('has the real, approved company details in the Who We Are section', () => {
    const section = privacySections.find((s) => s.id === 'who-we-are');
    expect(section?.facts).toEqual([
      { label: 'Registered office', value: '3 Tallow Wharf, Birchley Green, Hertford, Hertfordshire, England, SG14 1FF' },
      { label: 'Company number', value: '10086906' },
      { label: 'Website', value: 'dcl-consulting-group.com' },
      { label: 'Privacy enquiries', value: 'info@dcl-consulting-group.com' },
    ]);
  });

  it('accurately reflects the actual implementation: no analytics/marketing cookies are claimed', () => {
    const cookies = privacySections.find((s) => s.id === 'cookies-and-similar-technologies');
    const text = cookies!.body.join(' ').toLowerCase();
    expect(text).toContain('does not currently use analytics');
    expect(text).not.toContain('google analytics');
    expect(text).not.toContain('meta pixel');
    expect(text).not.toContain('hotjar');
  });

  it('describes the real Request More Info flow (email verification, no automatic marketing enrolment)', () => {
    const section = privacySections.find((s) => s.id === 'request-more-info-and-email-verification');
    const text = section!.body.join(' ').toLowerCase();
    expect(text).toContain('six-digit verification code');
    expect(text).toContain('not automatically enrolled into a newsletter');
  });

  it('names Resend as the email delivery provider without overclaiming a permanent commitment', () => {
    const section = privacySections.find((s) => s.id === 'email-delivery-providers');
    expect(section!.body.join(' ')).toContain('Resend');
  });

  it('the contact section links to the real /terms, /impressum, and /contact routes and includes the real company details', () => {
    const section = privacySections.find((s) => s.id === 'contact');
    expect(section?.links).toEqual([
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Impressum', href: '/impressum' },
      { label: 'Contact DCL', href: '/contact' },
    ]);
    const text = section!.body.join(' ');
    expect(text).toContain('info@dcl-consulting-group.com');
    expect(text).toContain('10086906');
  });

  it('the final support CTA routes to the real /contact page', () => {
    expect(privacySupportCta.cta).toEqual({ label: 'Contact DCL', href: '/contact' });
  });

  it('does not fabricate specific regulator names or claim absolute security', () => {
    const text = allStrings(ALL_CONTENT).join(' ').toLowerCase();
    expect(text).not.toContain('information commissioner');
    expect(text).not.toContain('100% secure');
    expect(text).not.toContain('completely secure and guaranteed');
  });

  it('contains no em-dash or en-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
