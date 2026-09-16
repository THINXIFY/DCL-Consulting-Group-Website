import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { KeyAreasOfAdvisory } from './KeyAreasOfAdvisory';
import { keyAreasOfAdvisory } from '@/data/asset-portfolio-advisory-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' ', '-');
}

describe('KeyAreasOfAdvisory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four advisory areas', () => {
    mockDesktop(true);
    render(<KeyAreasOfAdvisory />);
    expect(screen.getByText(keyAreasOfAdvisory.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Supporting stronger');
    for (const area of keyAreasOfAdvisory.areas) {
      const el = screen.getByTestId(`key-area-${slug(area.name)}`);
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
    expect(() => render(<KeyAreasOfAdvisory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<KeyAreasOfAdvisory />);
    const section = document.getElementById('key-areas-of-advisory');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
