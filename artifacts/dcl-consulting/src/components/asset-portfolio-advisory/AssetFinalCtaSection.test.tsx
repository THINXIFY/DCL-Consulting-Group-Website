import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssetFinalCtaSection } from './AssetFinalCtaSection';
import { assetFinalCta } from '@/data/asset-portfolio-advisory-content';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('AssetFinalCtaSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the small line, headline, supporting copy, both CTAs, and the closing line', () => {
    mockMatchMedia(false);
    render(<AssetFinalCtaSection />);
    expect(screen.getByTestId('text-ap-final-small')).toHaveTextContent(assetFinalCta.smallLine);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('A clearer path');
    expect(screen.getByTestId('text-ap-final-supporting')).toHaveTextContent(assetFinalCta.supporting);

    const primary = screen.getByTestId('link-ap-final-primary');
    expect(primary).toHaveAttribute('href', assetFinalCta.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-ap-final-secondary');
    expect(secondary).toHaveAttribute('href', assetFinalCta.secondaryCta.href);

    expect(screen.getByTestId('text-ap-final-closing')).toHaveTextContent(assetFinalCta.closing);
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<AssetFinalCtaSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockMatchMedia(false);
    render(<AssetFinalCtaSection />);
    const section = document.getElementById('asset-final-cta');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
