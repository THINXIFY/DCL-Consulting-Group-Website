import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivateCapitalFinalCtaSection } from './PrivateCapitalFinalCtaSection';
import { privateCapitalFinalCta } from '@/data/private-capital-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivateCapitalFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<PrivateCapitalFinalCtaSection />);
    expect(screen.getByTestId('text-pc-final-small')).toHaveTextContent(privateCapitalFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Turn opportunity');
    expect(screen.getByTestId('text-pc-final-supporting')).toHaveTextContent(privateCapitalFinalCta.supporting);

    const primary = screen.getByTestId('link-pc-final-primary');
    expect(primary).toHaveAttribute('href', privateCapitalFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-pc-final-secondary');
    expect(secondary).toHaveAttribute('href', privateCapitalFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-pc-final-closing')).toHaveTextContent(privateCapitalFinalCta.closing);
    const keywords = screen.getByTestId('text-pc-final-keywords');
    for (const keyword of privateCapitalFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<PrivateCapitalFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<PrivateCapitalFinalCtaSection />);
    const section = document.getElementById('pc-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
