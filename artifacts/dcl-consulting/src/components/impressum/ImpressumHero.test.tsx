import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { impressumHero } from '@/data/impressum-content';
import { ImpressumHero } from './ImpressumHero';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('ImpressumHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, label, headline, intro, and last-updated date', () => {
    mockMatchMedia(false);
    render(<ImpressumHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
    expect(screen.getByTestId('text-impressum-hero-label')).toHaveTextContent(impressumHero.label);
    expect(screen.getByTestId('text-impressum-hero-title')).toHaveTextContent(impressumHero.headline);
    expect(screen.getByTestId('text-impressum-hero-intro')).toHaveTextContent(impressumHero.intro);
    expect(screen.getByText(impressumHero.lastUpdated)).toBeInTheDocument();
  });

  it('does not throw with reduced motion preferred', () => {
    mockMatchMedia(true);
    expect(() => render(<ImpressumHero />)).not.toThrow();
  });

  it('contains no em-dash characters', () => {
    mockMatchMedia(false);
    render(<ImpressumHero />);
    const section = document.getElementById('impressum-hero');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
