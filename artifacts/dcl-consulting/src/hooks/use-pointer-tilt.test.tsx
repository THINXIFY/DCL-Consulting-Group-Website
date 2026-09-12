import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePointerTilt } from './use-pointer-tilt';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function TestStage() {
  const ref = useRef<HTMLDivElement>(null);
  usePointerTilt(ref);
  return <div ref={ref} data-testid="stage" />;
}

describe('usePointerTilt', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not throw when the pointer cannot hover (touch) or reduced motion is preferred', () => {
    mockMatchMedia(false);
    expect(() => render(<TestStage />)).not.toThrow();
  });

  it('does not throw on pointer move or leave when a fine pointer with hover support is present', () => {
    mockMatchMedia(true);
    render(<TestStage />);
    expect(() => {
      fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });
      fireEvent.mouseLeave(window);
    }).not.toThrow();
  });
});
