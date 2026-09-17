import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustriesHero } from './IndustriesHero';
import { industriesHero } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('IndustriesHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, lead, image, and statement', () => {
    mockDesktop(true);
    render(<IndustriesHero />);
    expect(screen.getByTestId('text-industries-hero-label')).toHaveTextContent(industriesHero.eyebrow);
    expect(screen.getByTestId('text-industries-hero-title')).toHaveTextContent(industriesHero.headlineLines[0]);
    expect(screen.getByTestId('text-industries-hero-title')).toHaveTextContent(industriesHero.headlineLines[1]);
    expect(screen.getByTestId('text-industries-hero-lead')).toHaveTextContent(industriesHero.lead);

    const img = screen.getByTestId('img-industries-hero');
    expect(img).toHaveAttribute('src', industriesHero.image.src);
    expect(img).toHaveAttribute('alt', industriesHero.image.alt);

    const statement = screen.getByTestId('text-industries-hero-statement');
    for (const line of industriesHero.imageStatementLines) {
      expect(statement).toHaveTextContent(line);
    }
  });

  it('renders the header inside the hero', () => {
    mockDesktop(true);
    render(<IndustriesHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<IndustriesHero />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<IndustriesHero />);
    const section = document.getElementById('industries-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/\b0?[1-9]\s*\//);
  });
});
