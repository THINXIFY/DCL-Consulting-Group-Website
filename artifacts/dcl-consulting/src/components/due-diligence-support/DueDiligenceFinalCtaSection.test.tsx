import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DueDiligenceFinalCtaSection } from './DueDiligenceFinalCtaSection';
import { dueDiligenceFinalCta } from '@/data/due-diligence-support-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DueDiligenceFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, the closing line, and closing keywords', () => {
    mockMatchMedia(false);
    render(<DueDiligenceFinalCtaSection />);
    expect(screen.getByTestId('text-dd-final-small')).toHaveTextContent(dueDiligenceFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Reduce uncertainty');
    expect(screen.getByTestId('text-dd-final-supporting')).toHaveTextContent(dueDiligenceFinalCta.supporting);

    const primary = screen.getByTestId('link-dd-final-primary');
    expect(primary).toHaveAttribute('href', dueDiligenceFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-dd-final-secondary');
    expect(secondary).toHaveAttribute('href', dueDiligenceFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-dd-final-closing')).toHaveTextContent(dueDiligenceFinalCta.closing);
    const keywords = screen.getByTestId('text-dd-final-keywords');
    for (const keyword of dueDiligenceFinalCta.closingKeywords) {
      expect(keywords).toHaveTextContent(keyword);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<DueDiligenceFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<DueDiligenceFinalCtaSection />);
    const section = document.getElementById('dd-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
