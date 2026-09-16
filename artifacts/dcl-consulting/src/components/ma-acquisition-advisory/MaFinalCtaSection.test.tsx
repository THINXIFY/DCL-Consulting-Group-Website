import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MaFinalCtaSection } from './MaFinalCtaSection';
import { maFinalCta } from '@/data/ma-acquisition-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MaFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<MaFinalCtaSection />);
    expect(screen.getByTestId('text-ma-final-small')).toHaveTextContent(maFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Create value');
    expect(screen.getByTestId('text-ma-final-supporting')).toHaveTextContent(maFinalCta.supporting);

    const primary = screen.getByTestId('link-ma-final-primary');
    expect(primary).toHaveAttribute('href', maFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-ma-final-secondary');
    expect(secondary).toHaveAttribute('href', maFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-ma-final-closing')).toHaveTextContent(maFinalCta.closing);
    const keywords = screen.getByTestId('text-ma-final-keywords');
    for (const keyword of maFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<MaFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<MaFinalCtaSection />);
    const section = document.getElementById('ma-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
