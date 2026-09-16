import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PrivateCapitalHero } from './PrivateCapitalHero';
import { privateCapitalHero } from '@/data/private-capital-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('PrivateCapitalHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<PrivateCapitalHero />);
    expect(screen.getByTestId('text-pc-hero-label')).toHaveTextContent(privateCapitalHero.label);
    expect(screen.getByTestId('text-pc-hero-title')).toHaveTextContent('Private Capital');
    expect(screen.getByTestId('text-pc-hero-title')).toHaveTextContent('Advisory');
    expect(screen.getByTestId('text-pc-hero-intro')).toHaveTextContent(privateCapitalHero.intro);
    const cta = screen.getByTestId('link-pc-hero-cta');
    expect(cta).toHaveTextContent(privateCapitalHero.cta.label);
    expect(cta).toHaveAttribute('href', privateCapitalHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of privateCapitalHero.keywords) {
      expect(screen.getByTestId('text-pc-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-pc-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-pc-hero-statement');
    for (const line of privateCapitalHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<PrivateCapitalHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<PrivateCapitalHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<PrivateCapitalHero />);
    const section = document.getElementById('private-capital-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
