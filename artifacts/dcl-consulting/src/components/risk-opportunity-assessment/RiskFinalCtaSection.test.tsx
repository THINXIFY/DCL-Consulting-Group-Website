import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RiskFinalCtaSection } from './RiskFinalCtaSection';
import { riskFinalCta } from '@/data/risk-opportunity-assessment-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RiskFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<RiskFinalCtaSection />);
    expect(screen.getByTestId('text-risk-final-small')).toHaveTextContent(riskFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('See more clearly');
    expect(screen.getByTestId('text-risk-final-supporting')).toHaveTextContent(riskFinalCta.supporting);

    const primary = screen.getByTestId('link-risk-final-primary');
    expect(primary).toHaveAttribute('href', riskFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-risk-final-secondary');
    expect(secondary).toHaveAttribute('href', riskFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-risk-final-closing')).toHaveTextContent(riskFinalCta.closing);
    const keywords = screen.getByTestId('text-risk-final-keywords');
    for (const keyword of riskFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<RiskFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<RiskFinalCtaSection />);
    const section = document.getElementById('risk-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
