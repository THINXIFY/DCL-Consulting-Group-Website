import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ApproachHero } from './ApproachHero';

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

describe('ApproachHero', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow, headline, intro, supporting statement, and the closing line as one flowing sentence (not numbered steps)', () => {
    mockViewport({ desktop: true });
    render(<ApproachHero />);
    expect(screen.getByTestId('text-approach-hero-eyebrow')).toHaveTextContent('Our approach');
    expect(screen.getByTestId('text-approach-hero-title')).toHaveTextContent('From information');
    expect(screen.getByTestId('text-approach-hero-title')).toHaveTextContent('to informed judgement.');
    expect(screen.getByTestId('text-approach-hero-intro')).toHaveTextContent(/disciplined process/i);
    expect(screen.getByTestId('text-approach-hero-supporting')).toHaveTextContent(/challenge what is assumed/i);
    const closing = screen.getByTestId('text-approach-hero-closing');
    expect(closing).toHaveTextContent('Understand. Analyse. Challenge. Assess. Advise.');
    expect(closing.textContent).not.toMatch(/\d/);
  });

  it('shows six information planes on desktop, four on tablet, and three on mobile', () => {
    mockViewport({ desktop: true });
    const { unmount } = render(<ApproachHero />);
    expect(screen.getAllByTestId(/^hero-information-plane-/)).toHaveLength(6);
    unmount();

    mockViewport({ desktop: false, mobile: false });
    const tablet = render(<ApproachHero />);
    expect(screen.getAllByTestId(/^hero-information-plane-/)).toHaveLength(4);
    tablet.unmount();

    mockViewport({ mobile: true });
    render(<ApproachHero />);
    expect(screen.getAllByTestId(/^hero-information-plane-/)).toHaveLength(3);
  });

  it('does not throw with reduced motion preferred', () => {
    mockViewport({ desktop: true, reducedMotion: true });
    expect(() => render(<ApproachHero />)).not.toThrow();
  });

  it('renders the header inside the hero', () => {
    mockViewport({ desktop: true });
    render(<ApproachHero />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();
  });
});
