import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { InvestmentFinalCtaSection } from './InvestmentFinalCtaSection';
import { investmentFinalCta } from '@/data/investment-consulting-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('InvestmentFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, and the closing line', () => {
    mockMatchMedia(false);
    render(<InvestmentFinalCtaSection />);
    expect(screen.getByTestId('text-ic-final-small')).toHaveTextContent(investmentFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Bring greater clarity');
    expect(screen.getByTestId('text-ic-final-supporting')).toHaveTextContent(investmentFinalCta.supporting);

    const primary = screen.getByTestId('link-ic-final-primary');
    expect(primary).toHaveAttribute('href', investmentFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-ic-final-secondary');
    expect(secondary).toHaveAttribute('href', investmentFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-ic-final-closing')).toHaveTextContent(investmentFinalCta.closing);
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<InvestmentFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<InvestmentFinalCtaSection />);
    const section = document.getElementById('investment-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
