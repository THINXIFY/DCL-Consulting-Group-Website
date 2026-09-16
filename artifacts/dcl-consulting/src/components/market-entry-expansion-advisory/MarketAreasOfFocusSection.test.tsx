import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MarketAreasOfFocusSection } from './MarketAreasOfFocusSection';
import { marketAreasOfFocus } from '@/data/market-entry-expansion-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll(' ', '-');
}

describe('MarketAreasOfFocusSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four areas of focus', () => {
    mockDesktop(true);
    render(<MarketAreasOfFocusSection />);
    expect(screen.getByText(marketAreasOfFocus.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Where growth');
    for (const area of marketAreasOfFocus.areas) {
      const el = screen.getByTestId(`market-focus-area-${slug(area.name)}`);
      expect(el).toHaveTextContent(area.name);
      expect(el).toHaveTextContent(area.description);
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<MarketAreasOfFocusSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<MarketAreasOfFocusSection />);
    const section = document.getElementById('market-areas-of-focus');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
