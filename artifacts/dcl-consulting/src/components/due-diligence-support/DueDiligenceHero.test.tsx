import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DueDiligenceHero } from './DueDiligenceHero';
import { dueDiligenceHero } from '@/data/due-diligence-support-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('DueDiligenceHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, intro, CTA, keywords, image, and statement', () => {
    mockDesktop(true);
    render(<DueDiligenceHero />);
    expect(screen.getByTestId('text-dd-hero-label')).toHaveTextContent(dueDiligenceHero.label);
    expect(screen.getByTestId('text-dd-hero-title')).toHaveTextContent('Due Diligence');
    expect(screen.getByTestId('text-dd-hero-title')).toHaveTextContent('Support');
    expect(screen.getByTestId('text-dd-hero-intro')).toHaveTextContent(dueDiligenceHero.intro);
    const cta = screen.getByTestId('link-dd-hero-cta');
    expect(cta).toHaveTextContent(dueDiligenceHero.cta.label);
    expect(cta).toHaveAttribute('href', dueDiligenceHero.cta.href);
    expect(cta.className).not.toMatch(/text-white/);
    for (const keyword of dueDiligenceHero.keywords) {
      expect(screen.getByTestId('text-dd-hero-keywords')).toHaveTextContent(keyword);
    }
    expect(screen.getByTestId('img-dd-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-dd-hero-statement');
    for (const line of dueDiligenceHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<DueDiligenceHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<DueDiligenceHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<DueDiligenceHero />);
    const section = document.getElementById('due-diligence-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
