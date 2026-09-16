import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AssetPortfolioAdvisoryPage from './asset-portfolio-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('AssetPortfolioAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<AssetPortfolioAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'asset-portfolio-hero',
      'asset-our-perspective',
      'key-areas-of-advisory',
      'analytical-approach',
      'portfolio-considerations',
      'asset-why-dcl',
      'asset-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
