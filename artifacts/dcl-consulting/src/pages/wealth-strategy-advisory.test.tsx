import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import WealthStrategyAdvisoryPage from './wealth-strategy-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('WealthStrategyAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<WealthStrategyAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'wealth-hero',
      'wealth-our-perspective',
      'key-areas-of-wealth-strategy',
      'wealth-our-approach',
      'areas-of-support',
      'wealth-why-dcl',
      'wealth-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
