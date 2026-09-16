import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfWealthStrategy } from './KeyAreasOfWealthStrategy';
import { keyAreasOfWealthStrategy } from '@/data/wealth-strategy-advisory-content';

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

describe('KeyAreasOfWealthStrategy', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four wealth strategy areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfWealthStrategy />);
    expect(screen.getByText(keyAreasOfWealthStrategy.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Supporting your');
    for (const area of keyAreasOfWealthStrategy.areas) {
      const el = screen.getByTestId(`key-wealth-area-${slug(area.name)}`);
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
    expect(() => render(<KeyAreasOfWealthStrategy />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfWealthStrategy />);
    const section = document.getElementById('key-areas-of-wealth-strategy');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
