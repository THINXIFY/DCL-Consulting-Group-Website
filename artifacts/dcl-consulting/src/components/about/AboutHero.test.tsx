import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AboutHero } from './AboutHero';

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

describe('AboutHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, two-line headline with emphasis, intro, supporting statement, and closing line', () => {
    mockViewport({ desktop: true });
    render(<AboutHero />);
    expect(screen.getByTestId('text-about-hero-eyebrow')).toHaveTextContent('About DCL');
    expect(screen.getByTestId('text-about-hero-title')).toHaveTextContent('Clarity begins');
    expect(screen.getByTestId('text-about-hero-title')).toHaveTextContent('with understanding.');
    expect(screen.getByTestId('text-about-hero-intro')).toHaveTextContent(/independent investment consulting/i);
    expect(screen.getByTestId('text-about-hero-supporting')).toHaveTextContent(/commercial understanding/i);
    expect(screen.getByTestId('text-about-hero-closing')).toHaveTextContent('Independent perspective. Disciplined analysis. Clearer decisions.');
  });

  it('shows five document planes on desktop, four on tablet, and three on mobile', () => {
    mockViewport({ desktop: true });
    const { unmount } = render(<AboutHero />);
    expect(screen.getAllByTestId(/^hero-document-plane-/)).toHaveLength(5);
    unmount();

    mockViewport({ desktop: false, mobile: false });
    const tablet = render(<AboutHero />);
    expect(screen.getAllByTestId(/^hero-document-plane-/)).toHaveLength(4);
    tablet.unmount();

    mockViewport({ mobile: true });
    render(<AboutHero />);
    expect(screen.getAllByTestId(/^hero-document-plane-/)).toHaveLength(3);
  });

  it('does not throw with reduced motion preferred', () => {
    mockViewport({ desktop: true, reducedMotion: true });
    expect(() => render(<AboutHero />)).not.toThrow();
  });

  it('renders the header inside the hero', () => {
    mockViewport({ desktop: true });
    render(<AboutHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });
});
