import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketFinalCtaSection } from './MarketFinalCtaSection';
import { marketFinalCta } from '@/data/market-entry-expansion-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MarketFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<MarketFinalCtaSection />);
    expect(screen.getByTestId('text-market-final-small')).toHaveTextContent(marketFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('New markets.');
    expect(screen.getByTestId('text-market-final-supporting')).toHaveTextContent(marketFinalCta.supporting);

    const primary = screen.getByTestId('link-market-final-primary');
    expect(primary).toHaveAttribute('href', marketFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-market-final-secondary');
    expect(secondary).toHaveAttribute('href', marketFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-market-final-closing')).toHaveTextContent(marketFinalCta.closing);
    const keywords = screen.getByTestId('text-market-final-keywords');
    for (const keyword of marketFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<MarketFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<MarketFinalCtaSection />);
    const section = document.getElementById('market-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
