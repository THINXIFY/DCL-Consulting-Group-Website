import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeroLuxuryParticles } from './HeroLuxuryParticles';

function mockMatchMedia({ desktop = false, tablet = false, reducedMotion = false } = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('1024') ? desktop : query.includes('640') ? tablet : query.includes('prefers-reduced-motion') ? reducedMotion : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HeroLuxuryParticles', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders 30 particles on desktop', () => {
    mockMatchMedia({ desktop: true, tablet: true });
    const { container } = render(<HeroLuxuryParticles />);
    expect(container.querySelectorAll('.dclHeroLux__particle')).toHaveLength(30);
  });

  it('renders 18 particles on tablet', () => {
    mockMatchMedia({ desktop: false, tablet: true });
    const { container } = render(<HeroLuxuryParticles />);
    expect(container.querySelectorAll('.dclHeroLux__particle')).toHaveLength(18);
  });

  it('renders 10 particles on mobile', () => {
    mockMatchMedia({ desktop: false, tablet: false });
    const { container } = render(<HeroLuxuryParticles />);
    expect(container.querySelectorAll('.dclHeroLux__particle')).toHaveLength(10);
  });

  it('renders nothing under reduced motion', () => {
    mockMatchMedia({ desktop: true, tablet: true, reducedMotion: true });
    const { container } = render(<HeroLuxuryParticles />);
    expect(container.querySelectorAll('.dclHeroLux__particle')).toHaveLength(0);
    expect(container.firstChild).toBeNull();
  });

  it('is decorative and does not intercept pointer events', () => {
    mockMatchMedia({ desktop: true, tablet: true });
    const { container } = render(<HeroLuxuryParticles />);
    const layer = container.firstElementChild;
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer).toHaveClass('pointer-events-none');
  });
});
