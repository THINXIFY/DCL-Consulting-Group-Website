import { describe, expect, it } from 'vitest';
import { footerBrand, footerClosing, footerCompanyLinks, footerContact, footerExpertiseLinks, footerLegalLinks, footerServicesViewAll, preFooterCta } from './footer-content';

const NUMBERING_PATTERN = /(^|\s)(\d+[.)]|step\s*\d|part\s*\d)/i;
const DASH_CHARS = /[–—]/;

const REAL_ROUTES = ['/', '/about', '/services', '/expertise', '/approach', '/industries', '/team', '/insights', '/partners', '/contact', '/privacy-policy', '/terms', '/impressum', '/#about'];

function allStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allStrings);
  return [];
}

const ALL_CONTENT = { preFooterCta, footerBrand, footerCompanyLinks, footerExpertiseLinks, footerServicesViewAll, footerContact, footerLegalLinks, footerClosing };

describe('footer-content', () => {
  it('every Company and Expertise link points to a real, existing route', () => {
    for (const link of [...footerCompanyLinks, ...footerExpertiseLinks]) {
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

  it('has the one real, verified official email and no other fabricated email or phone number', () => {
    expect(footerBrand.email).toBe('info@dcl-consulting-group.com');
    const text = allStrings(ALL_CONTENT).join(' ');
    const emails = text.match(/[a-z0-9.-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) ?? [];
    expect(new Set(emails)).toEqual(new Set(['info@dcl-consulting-group.com']));
    expect(text).not.toMatch(/\+?\d[\d\s()-]{7,}\d/);
  });

  it('contains no numbering or em-dash characters anywhere', () => {
    for (const value of allStrings(ALL_CONTENT)) {
      expect(value).not.toMatch(NUMBERING_PATTERN);
      expect(value).not.toMatch(DASH_CHARS);
    }
  });
});
