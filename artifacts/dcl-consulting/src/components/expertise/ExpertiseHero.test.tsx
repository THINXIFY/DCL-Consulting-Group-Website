import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExpertiseHero } from './ExpertiseHero';
import { expertiseHero } from '@/data/expertise-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ExpertiseHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, lead, supporting copy, both CTAs, image, and statement', () => {
    mockDesktop(true);
    render(<ExpertiseHero />);
    expect(screen.getByTestId('text-expertise-hero-label')).toHaveTextContent(expertiseHero.label);
    expect(screen.getByTestId('text-expertise-hero-title')).toHaveTextContent(expertiseHero.headlineLines[0]);
    expect(screen.getByTestId('text-expertise-hero-title')).toHaveTextContent(expertiseHero.headlineLines[1]);
    expect(screen.getByTestId('text-expertise-hero-lead')).toHaveTextContent(expertiseHero.lead);
    expect(screen.getByTestId('text-expertise-hero-supporting')).toHaveTextContent(expertiseHero.supporting);

    const primary = screen.getByTestId('link-expertise-hero-primary');
    expect(primary).toHaveTextContent(expertiseHero.primaryCta.label);
    expect(primary).toHaveAttribute('href', expertiseHero.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-expertise-hero-secondary');
    expect(secondary).toHaveTextContent(expertiseHero.secondaryCta.label);
    expect(secondary).toHaveAttribute('href', expertiseHero.secondaryCta.href);

    expect(screen.getByTestId('img-expertise-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-expertise-hero-statement');
    for (const line of expertiseHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<ExpertiseHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<ExpertiseHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<ExpertiseHero />);
    const section = document.getElementById('expertise-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
