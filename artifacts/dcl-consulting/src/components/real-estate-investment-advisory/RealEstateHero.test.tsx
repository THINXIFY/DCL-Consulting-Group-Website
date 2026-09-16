import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RealEstateHero } from './RealEstateHero';
import { realEstateHero } from '@/data/real-estate-investment-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('RealEstateHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, supporting copy, CTA, keywords, image, and image statement', () => {
    mockDesktop(true);
    render(<RealEstateHero />);
    expect(screen.getByTestId('text-real-estate-hero-label')).toHaveTextContent(realEstateHero.label);
    expect(screen.getByTestId('text-real-estate-hero-title')).toHaveTextContent('Real Estate');
    expect(screen.getByTestId('text-real-estate-hero-title')).toHaveTextContent('Investment Advisory');
    expect(screen.getByTestId('text-real-estate-hero-supporting')).toHaveTextContent(realEstateHero.supporting);
    const cta = screen.getByTestId('link-real-estate-hero-cta');
    expect(cta).toHaveTextContent(realEstateHero.cta.label);
    expect(cta).toHaveAttribute('href', realEstateHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of realEstateHero.keywords) {
      expect(screen.getByTestId('text-real-estate-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-real-estate-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-real-estate-hero-statement');
    for (const line of realEstateHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<RealEstateHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<RealEstateHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<RealEstateHero />);
    const section = document.getElementById('real-estate-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
