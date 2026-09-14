import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustriesHero } from './IndustriesHero';

function mockViewport({ desktop = false, mobile = false, reducedMotion = false }: { desktop?: boolean; mobile?: boolean; reducedMotion?: boolean }) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => {
    let matches = false;
    if (query.includes('1024')) matches = desktop;
    else if (query.includes('767')) matches = mobile;
    else if (query.includes('reduced-motion')) matches = reducedMotion;
    return {
      matches,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
  }) as unknown as typeof window.matchMedia;
}

describe('IndustriesHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, supporting statement, and the three-line closing statement', () => {
    mockViewport({ desktop: true });
    render(<IndustriesHero />);
    expect(screen.getByTestId('text-industries-hero-eyebrow')).toHaveTextContent('Industries');
    expect(screen.getByTestId('text-industries-hero-title')).toHaveTextContent('Perspective across');
    expect(screen.getByTestId('text-industries-hero-title')).toHaveTextContent('different sectors.');
    expect(screen.getByTestId('text-industries-hero-intro')).toHaveTextContent(/disciplined perspective/i);
    expect(screen.getByTestId('text-industries-hero-supporting')).toHaveTextContent(/fixed sector template/i);
    const closing = screen.getByTestId('text-industries-hero-closing');
    expect(closing).toHaveTextContent('Different sectors.');
    expect(closing).toHaveTextContent('The same need for clarity.');
    expect(closing.textContent).not.toMatch(/\d/);
  });

  it('shows six sector slices on desktop, four on tablet, and three on mobile', () => {
    mockViewport({ desktop: true });
    const { unmount } = render(<IndustriesHero />);
    expect(screen.getAllByTestId(/^hero-sector-slice-/)).toHaveLength(6);
    unmount();

    mockViewport({ desktop: false, mobile: false });
    const tablet = render(<IndustriesHero />);
    expect(screen.getAllByTestId(/^hero-sector-slice-/)).toHaveLength(4);
    tablet.unmount();

    mockViewport({ mobile: true });
    render(<IndustriesHero />);
    expect(screen.getAllByTestId(/^hero-sector-slice-/)).toHaveLength(3);
  });

  it('does not throw with reduced motion preferred', () => {
    mockViewport({ desktop: true, reducedMotion: true });
    expect(() => render(<IndustriesHero />)).not.toThrow();
  });

  it('renders the header inside the hero', () => {
    mockViewport({ desktop: true });
    render(<IndustriesHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });
});
