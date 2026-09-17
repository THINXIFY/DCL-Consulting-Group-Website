import { describe, expect, it } from 'vitest';
import { footerBrand, footerClosing, footerContact, footerLegalLinks, footerNavLinks, footerServicesViewAll, preFooterCta } from './footer-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

const REAL_ROUTES = ['/', '/about', '/services', '/expertise', '/approach', '/industries', '/team', '/insights', '/partners', '/contact', '/privacy-policy', '/terms', '/impressum', '/#about'];

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { preFooterCta, footerBrand, footerNavLinks, footerServicesViewAll, footerContact, footerLegalLinks, footerClosing };

describe('footer-content', () => {
  it('every navigation link points to a real, existing route', () => {
    for (const link of footerNavLinks) {
      expect(REAL_ROUTES).toContain(link.href);
    }
  });

  it('every internal legal link points to a real, existing route, and the external one points to the real Companies House profile', () => {
    for (const link of footerLegalLinks) {
      if (link.external) {
        expect(link.href).toBe('https://find-and-update.company-information.service.gov.uk/company/10086906/officers');
      } else {
        expect(REAL_ROUTES).toContain(link.href);
      }
    }
  });

  it('the pre-footer CTA and contact CTA route to real, existing destinations', () => {
    expect(REAL_ROUTES).toContain(preFooterCta.primaryCta.href);
    expect(REAL_ROUTES).toContain(preFooterCta.secondaryCta.href);
    expect(REAL_ROUTES).toContain(footerContact.cta.href);
  });

  it('the services view-all link points to the real services hub', () => {
    expect(footerServicesViewAll.href).toBe('/services');
  });

  it('does not contain any fabricated email, phone number, or physical address', () => {
    const text = allStrings(ALL_CONTENT).join(' ');
    expect(text).not.toMatch(/@[a-z0-9.-]+\.[a-z]{2,}/i);
    expect(text).not.toMatch(/\+?\d[\d\s()-]{7,}\d/);
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
