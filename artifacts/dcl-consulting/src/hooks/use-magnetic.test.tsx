import { render } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMagnetic } from './use-magnetic';

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function TestButton() {
  const ref = useRef<HTMLButtonElement>(null);
  useMagnetic(ref);
  return (
    <button ref={ref} type="button">
      Hover me
    </button>
  );
}

describe('useMagnetic', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not throw when the pointer cannot hover (touch) or reduced motion is preferred', () => {
    mockMatchMedia(false);
    expect(() => render(<TestButton />)).not.toThrow();
  });

  it('does not throw when a fine pointer with hover support is present', () => {
    mockMatchMedia(true);
    expect(() => render(<TestButton />)).not.toThrow();
  });
});
