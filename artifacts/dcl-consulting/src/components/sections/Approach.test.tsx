import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Approach } from './Approach';

function mockDesktop(desktop: boolean, reducedMotion = false) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('prefers-reduced-motion')
      ? query.includes('no-preference')
        ? !reducedMotion
        : reducedMotion
      : desktop,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('Approach', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the eyebrow and all four stages with no numbering', () => {
    render(<Approach />);
    expect(screen.getByTestId('text-approach-eyebrow')).toHaveTextContent('Our approach');
    for (const title of ['Understand', 'Analyse', 'Evaluate', 'Advise']) {
      expect(screen.getByTestId(`text-stage-${title.toLowerCase()}`)).toHaveTextContent(title);
    }
  });

  it('marks the first stage active by default on desktop', () => {
    mockDesktop(true);
    render(<Approach />);
    expect(screen.getByTestId('text-stage-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-stage-advise')).toHaveAttribute('data-active', 'false');
  });

  it('marks every stage active on mobile (no dimming without a pinned scroll story)', () => {
    mockDesktop(false);
    render(<Approach />);
    expect(screen.getByTestId('text-stage-understand')).toHaveAttribute('data-active', 'true');
    expect(screen.getByTestId('text-stage-advise')).toHaveAttribute('data-active', 'true');
  });

  it('renders the approach band image with a real src and alt text', () => {
    mockDesktop(true);
    render(<Approach />);
    const image = screen.getByTestId('img-approach-band');
    expect(image).toHaveAttribute('src', expect.stringContaining('/images/home/'));
    expect(image.getAttribute('alt')).toBeTruthy();
    expect(image).toHaveClass('object-cover', 'object-center');
  });

  it('does not throw when setting up the band reveal/parallax on desktop with motion allowed', () => {
    mockDesktop(true, false);
    expect(() => render(<Approach />)).not.toThrow();
  });

  it('does not throw and shows the band immediately (no clip-path wipe) under prefers-reduced-motion', () => {
    mockDesktop(true, true);
    render(<Approach />);
    const band = screen.getByTestId('img-approach-band').closest('.dclApproach__band') as HTMLElement;
    expect(band.style.clipPath).toBe('inset(0 0% 0 0)');
  });
});
