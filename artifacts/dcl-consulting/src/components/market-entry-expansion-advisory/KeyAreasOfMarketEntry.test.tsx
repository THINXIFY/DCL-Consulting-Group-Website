import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfMarketEntry } from './KeyAreasOfMarketEntry';
import { keyAreasOfMarketEntry } from '@/data/market-entry-expansion-advisory-content';

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

describe('KeyAreasOfMarketEntry', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four key areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfMarketEntry />);
    expect(screen.getByText(keyAreasOfMarketEntry.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Building a stronger');
    for (const area of keyAreasOfMarketEntry.areas) {
      const el = screen.getByTestId(`market-key-area-${slug(area.name)}`);
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
    expect(() => render(<KeyAreasOfMarketEntry />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfMarketEntry />);
    const section = document.getElementById('market-key-areas');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
