import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ExpertiseHero } from './ExpertiseHero';

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

describe('ExpertiseHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, supporting statement, and closing lines', () => {
    mockViewport({ desktop: true });
    render(<ExpertiseHero />);
    expect(screen.getByTestId('text-expertise-hero-eyebrow')).toHaveTextContent('Expertise');
    expect(screen.getByTestId('text-expertise-hero-title')).toHaveTextContent('Expertise applied');
    expect(screen.getByTestId('text-expertise-hero-title')).toHaveTextContent('to the decision.');
    expect(screen.getByTestId('text-expertise-hero-intro')).toHaveTextContent(/commercial analysis, financial perspective/i);
    expect(screen.getByTestId('text-expertise-hero-supporting')).toHaveTextContent(/different opportunities require different questions/i);
    const closing = screen.getByTestId('text-expertise-hero-closing');
    expect(closing).toHaveTextContent('Analysis with purpose.');
    expect(closing).toHaveTextContent('Perspective with relevance.');
  });

  it('shows four analytical lenses on desktop, three on tablet, and two on mobile', () => {
    mockViewport({ desktop: true });
    const { unmount } = render(<ExpertiseHero />);
    expect(screen.getAllByTestId(/^hero-lens-/)).toHaveLength(4);
    unmount();

    mockViewport({ desktop: false, mobile: false });
    const tablet = render(<ExpertiseHero />);
    expect(screen.getAllByTestId(/^hero-lens-/)).toHaveLength(3);
    tablet.unmount();

    mockViewport({ mobile: true });
    render(<ExpertiseHero />);
    expect(screen.getAllByTestId(/^hero-lens-/)).toHaveLength(2);
  });

  it('does not throw with reduced motion preferred', () => {
    mockViewport({ desktop: true, reducedMotion: true });
    expect(() => render(<ExpertiseHero />)).not.toThrow();
  });

  it('renders the header inside the hero', () => {
    mockViewport({ desktop: true });
    render(<ExpertiseHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });
});
