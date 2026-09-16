import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AreasOfSupportSection } from './AreasOfSupportSection';
import { areasOfSupport } from '@/data/wealth-strategy-advisory-content';

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

describe('AreasOfSupportSection', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and all four support areas', () => {
    mockDesktop(true);
    render(<AreasOfSupportSection />);
    expect(screen.getByText(areasOfSupport.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('From strategy');
    for (const area of areasOfSupport.areas) {
      const el = screen.getByTestId(`support-area-${slug(area.name)}`);
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
    expect(() => render(<AreasOfSupportSection />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<AreasOfSupportSection />);
    const section = document.getElementById('areas-of-support');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
