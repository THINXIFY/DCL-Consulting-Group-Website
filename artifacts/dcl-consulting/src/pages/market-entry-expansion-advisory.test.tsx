import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import MarketEntryExpansionAdvisoryPage from './market-entry-expansion-advisory';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

describe('MarketEntryExpansionAdvisoryPage', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the header, all seven sections in order, and the global footer', () => {
    mockDesktop(true);
    render(<MarketEntryExpansionAdvisoryPage />);
    expect(screen.getByTestId('link-home')).toBeInTheDocument();

    const sectionIds = Array.from(document.querySelectorAll('main > section')).map((el) => el.id);
    expect(sectionIds).toEqual([
      'market-hero',
      'market-our-perspective',
      'market-key-areas',
      'market-our-approach',
      'market-areas-of-focus',
      'market-why-dcl',
      'market-final-cta',
    ]);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });
});
