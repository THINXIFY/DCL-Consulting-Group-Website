import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ServicesHero } from './ServicesHero';
import { servicesHero } from '@/data/services-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ServicesHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, lead, supporting copy, both CTAs, vocabulary, image, and statement', () => {
    mockDesktop(true);
    render(<ServicesHero />);
    expect(screen.getByTestId('text-services-hero-label')).toHaveTextContent(servicesHero.label);
    expect(screen.getByTestId('text-services-hero-title')).toHaveTextContent(servicesHero.headline);
    expect(screen.getByTestId('text-services-hero-lead')).toHaveTextContent(servicesHero.lead);
    expect(screen.getByTestId('text-services-hero-supporting')).toHaveTextContent(servicesHero.supporting);

    const primary = screen.getByTestId('link-services-hero-primary');
    expect(primary).toHaveTextContent(servicesHero.primaryCta.label);
    expect(primary).toHaveAttribute('href', servicesHero.primaryCta.href);
    expect(primary.className).not.toMatch(/text-white/);

    const secondary = screen.getByTestId('link-services-hero-secondary');
    expect(secondary).toHaveTextContent(servicesHero.secondaryCta.label);
    expect(secondary).toHaveAttribute('href', servicesHero.secondaryCta.href);

    const vocab = screen.getByTestId('text-services-hero-vocabulary');
    for (const word of servicesHero.vocabulary) {
      expect(vocab).toHaveTextContent(word);
    }

    expect(screen.getByTestId('img-services-hero')).toBeInTheDocument();
    const statement = screen.getByTestId('text-services-hero-statement');
    for (const line of servicesHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<ServicesHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<ServicesHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<ServicesHero />);
    const section = document.getElementById('services-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
