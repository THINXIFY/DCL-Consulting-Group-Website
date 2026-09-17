import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Footer } from './Footer';
import { footerCompanyLinks, footerExpertiseLinks, footerLegalLinks, footerServicesViewAll, preFooterCta } from '@/data/footer-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(label: string) {
  return label.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('Footer', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders a decorative full-bleed background image behind the whole footer', () => {
    mockMatchMedia(false);
    render(<Footer />);
    const bg = screen.getByTestId('img-footer-background');
    expect(bg).toHaveAttribute('src', expect.stringContaining('ChatGPT-Image-Sep-17-2026-05_01_29-PM.png'));
    expect(bg).toHaveAttribute('alt', '');
    expect(bg.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('renders the pre-footer CTA label, headline, supporting copy, both CTAs, vocabulary, the real image, and image statement', () => {
    mockMatchMedia(false);
    render(<Footer />);
    expect(screen.getByTestId('text-footer-cta-label')).toHaveTextContent(preFooterCta.label);
    expect(screen.getByTestId('text-footer-cta-headline')).toHaveTextContent(preFooterCta.headlineLines[0]);
    expect(screen.getByTestId('text-footer-cta-headline')).toHaveTextContent(preFooterCta.headlineLines[1]);
    expect(screen.getByTestId('text-footer-cta-supporting')).toHaveTextContent(preFooterCta.supporting);

    const primary = screen.getByTestId('link-footer-cta-primary');
    expect(primary).toHaveTextContent(preFooterCta.primaryCta.label);
    expect(primary).toHaveAttribute('href', preFooterCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-footer-cta-secondary');
    expect(secondary).toHaveTextContent(preFooterCta.secondaryCta.label);
    expect(secondary).toHaveAttribute('href', preFooterCta.secondaryCta.href);

    const vocab = screen.getByTestId('text-footer-cta-vocabulary');
    for (const line of preFooterCta.vocabularyLines) {
      expect(vocab).toHaveTextContent(line);
    }
    expect(vocab).toHaveTextContent(preFooterCta.vocabularyEmphasis);

    const ctaImage = screen.getByTestId('img-footer-cta');
    expect(ctaImage).toHaveAttribute('src', expect.stringContaining('lets-talk.webp'));
    const statement = screen.getByTestId('text-footer-cta-image-statement');
    for (const line of preFooterCta.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('links the mark home and renders the Company and Expertise link groups with the correct real routes', () => {
    mockMatchMedia(false);
    render(<Footer />);
    expect(screen.getByTestId('link-footer-home')).toHaveAttribute('href', '/');
    for (const link of [...footerCompanyLinks, ...footerExpertiseLinks]) {
      expect(screen.getByTestId(`link-footer-nav-${slug(link.label)}`)).toHaveAttribute('href', link.href);
    }
  });

  it('renders a View All Services link and a Get in Touch link, with no invented contact details', () => {
    mockMatchMedia(false);
    render(<Footer />);
    const viewAll = screen.getByTestId('link-footer-view-all-services');
    expect(viewAll).toHaveTextContent(footerServicesViewAll.label);
    expect(viewAll).toHaveAttribute('href', footerServicesViewAll.href);

    const cta = screen.getByTestId('link-footer-contact-cta');
    expect(cta).toHaveTextContent('Get in Touch');
    expect(cta).toHaveAttribute('href', '/contact');

    const footer = document.querySelector('footer');
    expect(footer?.textContent).not.toMatch(/\+?\d[\d\s()-]{7,}\d/);
  });

  it('renders the real official email as a mailto link', () => {
    mockMatchMedia(false);
    render(<Footer />);
    const email = screen.getByTestId('link-footer-email');
    expect(email).toHaveTextContent('info@dcl-consulting-group.com');
    expect(email).toHaveAttribute('href', 'mailto:info@dcl-consulting-group.com');
  });

  it('renders only the exact confirmed company registration facts, nothing invented', () => {
    mockMatchMedia(false);
    render(<Footer />);
    expect(screen.getByTestId('text-footer-fact-company')).toHaveTextContent('DCL Consulting and Investments Limited');
    expect(screen.getByTestId('text-footer-fact-company-type')).toHaveTextContent('Private Limited Company');
    expect(screen.getByTestId('text-footer-fact-registered-in')).toHaveTextContent('England & Wales');
    expect(screen.getByTestId('text-footer-fact-company-number')).toHaveTextContent('10086906');
    expect(screen.queryByTestId('text-footer-fact-director')).not.toBeInTheDocument();
  });

  it('does not render any social links, since none are verified', () => {
    mockMatchMedia(false);
    render(<Footer />);
    const footer = document.querySelector('footer');
    for (const term of ['linkedin', 'twitter', 'instagram', 'facebook']) {
      expect(footer?.innerHTML.toLowerCase()).not.toContain(term);
    }
  });

  it('does not render a newsletter signup form', () => {
    mockMatchMedia(false);
    render(<Footer />);
    expect(document.querySelector('footer input')).not.toBeInTheDocument();
  });

  it('renders the current year and the closing tagline at the bottom', () => {
    mockMatchMedia(false);
    render(<Footer />);
    expect(screen.getByTestId('text-footer-copyright')).toHaveTextContent(String(new Date().getFullYear()));
    expect(screen.getByTestId('text-footer-closing')).toHaveTextContent('Clarity Before Capital.');
  });

  it('renders the Legal link group (Privacy Policy, Terms, Impressum, and the external Official Company Profile)', () => {
    mockMatchMedia(false);
    render(<Footer />);
    for (const link of footerLegalLinks) {
      const el = screen.getByTestId(`link-footer-nav-${slug(link.label)}`);
      expect(el).toHaveAttribute('href', link.href);
      if (link.external) {
        expect(el).toHaveAttribute('target', '_blank');
        expect(el).toHaveAttribute('rel', 'noopener noreferrer');
      }
    }
  });

  it('includes Team, Partners, and Insights in the Company link group', () => {
    mockMatchMedia(false);
    render(<Footer />);
    expect(screen.getByTestId('link-footer-nav-team')).toHaveAttribute('href', '/team');
    expect(screen.getByTestId('link-footer-nav-partners')).toHaveAttribute('href', '/partners');
    expect(screen.getByTestId('link-footer-nav-insights')).toHaveAttribute('href', '/insights');
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<Footer />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<Footer />);
    const footer = document.querySelector('footer');
    expect(footer?.textContent).not.toMatch(/[–—]/);
  });
});
