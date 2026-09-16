import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AssetPortfolioHero } from './AssetPortfolioHero';
import { assetPortfolioHero } from '@/data/asset-portfolio-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('AssetPortfolioHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<AssetPortfolioHero />);
    expect(screen.getByTestId('text-ap-hero-label')).toHaveTextContent(assetPortfolioHero.label);
    expect(screen.getByTestId('text-ap-hero-title')).toHaveTextContent('Asset & Portfolio');
    expect(screen.getByTestId('text-ap-hero-title')).toHaveTextContent('Advisory');
    expect(screen.getByTestId('text-ap-hero-intro')).toHaveTextContent(assetPortfolioHero.intro);
    const cta = screen.getByTestId('link-ap-hero-cta');
    expect(cta).toHaveTextContent(assetPortfolioHero.cta.label);
    expect(cta).toHaveAttribute('href', assetPortfolioHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of assetPortfolioHero.keywords) {
      expect(screen.getByTestId('text-ap-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-ap-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-ap-hero-statement');
    for (const line of assetPortfolioHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<AssetPortfolioHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not rename the service to Asset Management or Portfolio Management', () => {
    mockDesktop(true);
    render(<AssetPortfolioHero />);
    const section = document.getElementById('asset-portfolio-hero');
    expect(section?.textContent).not.toContain('Asset Management');
    expect(section?.textContent).not.toContain('Portfolio Management');
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<AssetPortfolioHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<AssetPortfolioHero />);
    const section = document.getElementById('asset-portfolio-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
