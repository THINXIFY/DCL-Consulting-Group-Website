import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RealEstateFinalCta } from './RealEstateFinalCta';
import { realEstateFinalCta } from '@/data/real-estate-investment-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RealEstateFinalCta', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, and the closing line', () => {
    mockMatchMedia(false);
    render(<RealEstateFinalCta />);
    const small = screen.getByTestId('text-real-estate-final-small');
    for (const line of realEstateFinalCta.smallLines) {
      expect(small).toHaveTextContent(line);
    }
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Bring greater clarity');
    expect(screen.getByTestId('text-real-estate-final-supporting')).toHaveTextContent(realEstateFinalCta.supporting);

    const primary = screen.getByTestId('link-real-estate-final-primary');
    expect(primary).toHaveAttribute('href', realEstateFinalCta.primaryCta.href);
    expect(primary).toHaveTextContent(realEstateFinalCta.primaryCta.label);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-real-estate-final-secondary');
    expect(secondary).toHaveAttribute('href', realEstateFinalCta.secondaryCta.href);
    expect(secondary).toHaveTextContent(realEstateFinalCta.secondaryCta.label);

    expect(screen.getByTestId('text-real-estate-final-closing')).toHaveTextContent(realEstateFinalCta.closing);
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<RealEstateFinalCta />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<RealEstateFinalCta />);
    const section = document.getElementById('real-estate-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
