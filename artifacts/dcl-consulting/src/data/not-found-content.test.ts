import { describe, expect, it } from 'vitest';
import { notFoundContent } from './not-found-content';

describe('not-found-content', () => {
  it('has the expected headline and no generic "404 - Page not found" phrasing as the main message', () => {
    expect(notFoundContent.headlineLines).toEqual(['The path changed.', 'The perspective remains.']);
    expect(notFoundContent.label).toBe('Page Not Found');
  });

  it('routes recovery CTAs to real, existing routes', () => {
    expect(notFoundContent.primaryCta.href).toBe('/');
    expect(notFoundContent.secondaryCta.href).toBe('/services');
    expect(notFoundContent.tertiaryLink.href).toBe('/contact');
  });

  it('has exactly three quick links routing to real pages', () => {
    expect(notFoundContent.quickLinks).toEqual([
      { label: 'Services', href: '/services' },
      { label: 'Expertise', href: '/expertise' },
      { label: 'Contact', href: '/contact' },
    ]);
  });

  it('uses a real, locally hosted image', () => {
    expect(notFoundContent.image.src).toContain('/images/home/');
    expect(notFoundContent.image.alt).toBeTruthy();
  });

  it('closes with the site tagline', () => {
    expect(notFoundContent.closing).toBe('Clarity Before Capital.');
  });

  it('contains no em-dash characters', () => {
    const strings = [
      notFoundContent.label,
      ...notFoundContent.headlineLines,
      notFoundContent.body,
      ...notFoundContent.editorialStatementLines,
      notFoundContent.closing,
    ];
    for (const value of strings) {
      expect(value).not.toMatch(/[–—]/);
    }
  });
});
