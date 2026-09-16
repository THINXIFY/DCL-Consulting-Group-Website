import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketHero } from './MarketHero';
import { marketHero } from '@/data/market-entry-expansion-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MarketHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<MarketHero />);
    expect(screen.getByTestId('text-market-hero-label')).toHaveTextContent(marketHero.label);
    expect(screen.getByTestId('text-market-hero-title')).toHaveTextContent('Market Entry &');
    expect(screen.getByTestId('text-market-hero-title')).toHaveTextContent('Expansion Advisory');
    expect(screen.getByTestId('text-market-hero-intro')).toHaveTextContent(marketHero.intro);
    const cta = screen.getByTestId('link-market-hero-cta');
    expect(cta).toHaveTextContent(marketHero.cta.label);
    expect(cta).toHaveAttribute('href', marketHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of marketHero.keywords) {
      expect(screen.getByTestId('text-market-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-market-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-market-hero-statement');
    for (const line of marketHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<MarketHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MarketHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MarketHero />);
    const section = document.getElementById('market-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
