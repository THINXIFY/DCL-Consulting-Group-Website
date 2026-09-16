import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { WealthHero } from './WealthHero';
import { wealthHero } from '@/data/wealth-strategy-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WealthHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<WealthHero />);
    expect(screen.getByTestId('text-wealth-hero-label')).toHaveTextContent(wealthHero.label);
    expect(screen.getByTestId('text-wealth-hero-title')).toHaveTextContent('Wealth Strategy');
    expect(screen.getByTestId('text-wealth-hero-title')).toHaveTextContent('Advisory');
    expect(screen.getByTestId('text-wealth-hero-intro')).toHaveTextContent(wealthHero.intro);
    const cta = screen.getByTestId('link-wealth-hero-cta');
    expect(cta).toHaveTextContent(wealthHero.cta.label);
    expect(cta).toHaveAttribute('href', wealthHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of wealthHero.keywords) {
      expect(screen.getByTestId('text-wealth-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-wealth-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-wealth-hero-statement');
    for (const line of wealthHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<WealthHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('uses Wealth Strategy Advisory language, not Wealth Management', () => {
    mockDesktop(true);
    render(<WealthHero />);
    const section = document.getElementById('wealth-hero');
    expect(section?.textContent).not.toContain('Wealth Management');
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<WealthHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<WealthHero />);
    const section = document.getElementById('wealth-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
