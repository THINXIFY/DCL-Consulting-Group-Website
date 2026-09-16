import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StrategicHero } from './StrategicHero';
import { strategicHero } from '@/data/strategic-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('StrategicHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<StrategicHero />);
    expect(screen.getByTestId('text-st-hero-label')).toHaveTextContent(strategicHero.label);
    expect(screen.getByTestId('text-st-hero-title')).toHaveTextContent('Strategic');
    expect(screen.getByTestId('text-st-hero-title')).toHaveTextContent('Advisory');
    expect(screen.getByTestId('text-st-hero-intro')).toHaveTextContent(strategicHero.intro);
    const cta = screen.getByTestId('link-st-hero-cta');
    expect(cta).toHaveTextContent(strategicHero.cta.label);
    expect(cta).toHaveAttribute('href', strategicHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of strategicHero.keywords) {
      expect(screen.getByTestId('text-st-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-st-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-st-hero-statement');
    for (const line of strategicHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<StrategicHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<StrategicHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<StrategicHero />);
    const section = document.getElementById('strategic-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
