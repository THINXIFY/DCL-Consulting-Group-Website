import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ScrollTrigger } from '@/lib/gsap';
import { useScrollTriggerRefresh } from './use-scroll-trigger-refresh';

function TestComponent() {
  useScrollTriggerRefresh();
  return null;
}

describe('useScrollTriggerRefresh', () => {
  afterEach(() => vi.restoreAllMocks());

  it('does not throw on mount and calls ScrollTrigger.refresh once fonts are ready', async () => {
    const refreshSpy = vi.spyOn(ScrollTrigger, 'refresh').mockImplementation(() => undefined as never);
    expect(() => render(<TestComponent />)).not.toThrow();
    await Promise.resolve();
    await Promise.resolve();
    expect(refreshSpy).toHaveBeenCalled();
  });
});
