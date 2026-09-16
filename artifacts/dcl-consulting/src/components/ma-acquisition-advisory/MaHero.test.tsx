import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MaHero } from './MaHero';
import { maHero } from '@/data/ma-acquisition-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MaHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<MaHero />);
    expect(screen.getByTestId('text-ma-hero-label')).toHaveTextContent(maHero.label);
    expect(screen.getByTestId('text-ma-hero-title')).toHaveTextContent('M&A & Acquisition');
    expect(screen.getByTestId('text-ma-hero-title')).toHaveTextContent('Advisory');
    expect(screen.getByTestId('text-ma-hero-intro')).toHaveTextContent(maHero.intro);
    const cta = screen.getByTestId('link-ma-hero-cta');
    expect(cta).toHaveTextContent(maHero.cta.label);
    expect(cta).toHaveAttribute('href', maHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of maHero.keywords) {
      expect(screen.getByTestId('text-ma-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-ma-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-ma-hero-statement');
    for (const line of maHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<MaHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MaHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MaHero />);
    const section = document.getElementById('ma-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
