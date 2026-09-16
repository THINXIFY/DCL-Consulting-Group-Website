import { createRef } from 'react';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HeroBackground } from './HeroBackground';

function mockMatchMedia(overrides: Record<string, boolean>) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: Object.entries(overrides).some(([key, value]) => query.includes(key) && value),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('HeroBackground', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders as a decorative, non-interactive layer', () => {
    mockMatchMedia({ 'min-width: 1024px': true, 'min-width: 640px': true, 'pointer: fine': true });
    const ref = createRef<HTMLElement>();
    const { container } = render(<HeroBackground rootRef={ref} />);
    const layer = container.querySelector('.dclHeroBg');
    expect(layer).toHaveAttribute('aria-hidden', 'true');
    expect(layer).toHaveClass('pointer-events-none');
  });

  it('renders the line pattern and glow layers', () => {
    mockMatchMedia({ 'min-width: 1024px': true, 'min-width: 640px': true, 'pointer: fine': true });
    const ref = createRef<HTMLElement>();
    const { container } = render(<HeroBackground rootRef={ref} />);
    expect(container.querySelector('.dclHeroBg__lines')).not.toBeNull();
    expect(container.querySelector('.dclHeroBg__glow')).not.toBeNull();
  });

  it('generates the desktop particle count (~32) on wide viewports', () => {
    mockMatchMedia({ 'min-width: 1024px': true, 'min-width: 640px': true, 'pointer: fine': true });
    const ref = createRef<HTMLElement>();
    const { container } = render(<HeroBackground rootRef={ref} />);
    expect(container.querySelectorAll('.dclHeroBg__particle')).toHaveLength(32);
  });

  it('generates a reduced particle count (~16) on tablet viewports', () => {
    mockMatchMedia({ 'min-width: 1024px': false, 'min-width: 640px': true, 'pointer: fine': false });
    const ref = createRef<HTMLElement>();
    const { container } = render(<HeroBackground rootRef={ref} />);
    expect(container.querySelectorAll('.dclHeroBg__particle')).toHaveLength(16);
  });

  it('generates a minimal particle count (~9) on mobile viewports', () => {
    mockMatchMedia({ 'min-width: 1024px': false, 'min-width: 640px': false, 'pointer: fine': false });
    const ref = createRef<HTMLElement>();
    const { container } = render(<HeroBackground rootRef={ref} />);
    expect(container.querySelectorAll('.dclHeroBg__particle')).toHaveLength(9);
  });

  it('keeps every particle tiny (1-2px) and low opacity, with no large circles or glowing dots', () => {
    mockMatchMedia({ 'min-width: 1024px': true, 'min-width: 640px': true, 'pointer: fine': true });
    const ref = createRef<HTMLElement>();
    const { container } = render(<HeroBackground rootRef={ref} />);
    const particles = container.querySelectorAll<HTMLElement>('.dclHeroBg__particle');
    for (const particle of particles) {
      const width = Number.parseFloat(particle.style.width);
      const opMax = Number.parseFloat(particle.style.getPropertyValue('--p-op-max'));
      expect(width).toBeGreaterThanOrEqual(1);
      expect(width).toBeLessThanOrEqual(2);
      expect(opMax).toBeLessThanOrEqual(0.22);
    }
  });

  it('does not attach a pointer-parallax listener when prefers-reduced-motion is set', () => {
    mockMatchMedia({ 'min-width: 1024px': true, 'min-width: 640px': true, 'pointer: fine': true, 'prefers-reduced-motion: reduce': true });
    const section = document.createElement('section');
    const addSpy = vi.spyOn(section, 'addEventListener');
    const ref = { current: section };
    render(<HeroBackground rootRef={ref} />);
    expect(addSpy).not.toHaveBeenCalledWith('pointermove', expect.anything());
  });

  it('does not attach a pointer-parallax listener on coarse (touch) pointers', () => {
    mockMatchMedia({ 'min-width: 1024px': false, 'min-width: 640px': false, 'pointer: fine': false });
    const section = document.createElement('section');
    const addSpy = vi.spyOn(section, 'addEventListener');
    const ref = { current: section };
    render(<HeroBackground rootRef={ref} />);
    expect(addSpy).not.toHaveBeenCalledWith('pointermove', expect.anything());
  });

  it('attaches a pointer-parallax listener only on fine-pointer desktop without reduced motion', () => {
    mockMatchMedia({ 'min-width: 1024px': true, 'min-width: 640px': true, 'pointer: fine': true });
    const section = document.createElement('section');
    const addSpy = vi.spyOn(section, 'addEventListener');
    const ref = { current: section };
    render(<HeroBackground rootRef={ref} />);
    expect(addSpy).toHaveBeenCalledWith('pointermove', expect.any(Function));
  });
});
