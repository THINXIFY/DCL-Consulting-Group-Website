import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExpertiseFinalCta } from './ExpertiseFinalCta';
import { expertiseFinalCta } from '@/data/expertise-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ExpertiseFinalCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, both CTAs, and the closing lines', () => {
    mockMatchMedia(false);
    render(<ExpertiseFinalCta />);
    expect(screen.getByTestId('text-expertise-final-label')).toHaveTextContent(expertiseFinalCta.label);
    expect(screen.getByTestId('text-expertise-final-title')).toHaveTextContent(expertiseFinalCta.headlineLines[0]);
    expect(screen.getByTestId('text-expertise-final-title')).toHaveTextContent(expertiseFinalCta.headlineLines[1]);
    expect(screen.getByTestId('text-expertise-final-supporting')).toHaveTextContent(expertiseFinalCta.supporting);

    const primary = screen.getByTestId('link-expertise-final-primary');
    expect(primary).toHaveTextContent(expertiseFinalCta.primaryCta.label);
    expect(primary).toHaveAttribute('href', expertiseFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-expertise-final-secondary');
    expect(secondary).toHaveTextContent(expertiseFinalCta.secondaryCta.label);
    expect(secondary).toHaveAttribute('href', expertiseFinalCta.secondaryCta.href);

    const closing = screen.getByTestId('text-expertise-final-closing');
    for (const line of expertiseFinalCta.closingLines) {
      expect(closing).toHaveTextContent(line);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<ExpertiseFinalCta />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<ExpertiseFinalCta />);
    const section = document.getElementById('expertise-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
