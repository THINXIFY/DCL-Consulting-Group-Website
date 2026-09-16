import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WealthFinalCtaSection } from './WealthFinalCtaSection';
import { wealthFinalCta } from '@/data/wealth-strategy-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WealthFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<WealthFinalCtaSection />);
    expect(screen.getByTestId('text-wealth-final-small')).toHaveTextContent(wealthFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Build a stronger');
    expect(screen.getByTestId('text-wealth-final-supporting')).toHaveTextContent(wealthFinalCta.supporting);

    const primary = screen.getByTestId('link-wealth-final-primary');
    expect(primary).toHaveAttribute('href', wealthFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-wealth-final-secondary');
    expect(secondary).toHaveAttribute('href', wealthFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-wealth-final-closing')).toHaveTextContent(wealthFinalCta.closing);
    const keywords = screen.getByTestId('text-wealth-final-keywords');
    for (const keyword of wealthFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<WealthFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<WealthFinalCtaSection />);
    const section = document.getElementById('wealth-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
