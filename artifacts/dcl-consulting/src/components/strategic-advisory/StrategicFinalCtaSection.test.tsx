import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrategicFinalCtaSection } from './StrategicFinalCtaSection';
import { strategicFinalCta } from '@/data/strategic-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('StrategicFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<StrategicFinalCtaSection />);
    expect(screen.getByTestId('text-st-final-small')).toHaveTextContent(strategicFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Turn possibility');
    expect(screen.getByTestId('text-st-final-supporting')).toHaveTextContent(strategicFinalCta.supporting);

    const primary = screen.getByTestId('link-st-final-primary');
    expect(primary).toHaveAttribute('href', strategicFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-st-final-secondary');
    expect(secondary).toHaveAttribute('href', strategicFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-st-final-closing')).toHaveTextContent(strategicFinalCta.closing);
    const keywords = screen.getByTestId('text-st-final-keywords');
    for (const keyword of strategicFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<StrategicFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<StrategicFinalCtaSection />);
    const section = document.getElementById('strategic-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
