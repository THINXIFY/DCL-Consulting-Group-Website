import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfMaAdvisory } from './KeyAreasOfMaAdvisory';
import { keyAreasOfMaAdvisory } from '@/data/ma-acquisition-advisory-content';

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

describe('KeyAreasOfMaAdvisory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four M&A advisory areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfMaAdvisory />);
    expect(screen.getByText(keyAreasOfMaAdvisory.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Supporting better');
    for (const area of keyAreasOfMaAdvisory.areas) {
      const el = screen.getByTestId(`ma-key-area-${slug(area.name)}`);
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
    expect(() => render(<KeyAreasOfMaAdvisory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfMaAdvisory />);
    const section = document.getElementById('ma-key-areas');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
