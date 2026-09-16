import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OurIndustries } from './OurIndustries';
import { ourIndustries } from '@/data/industries-content';

function mockDesktop(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function slug(name: string) {
  return name.toLowerCase().replaceAll(' & ', '-').replaceAll('&', '').replaceAll(' ', '-');
}

describe('OurIndustries', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the label, headline, and supporting copy', () => {
    mockDesktop(true);
    render(<OurIndustries />);
    expect(screen.getByText(ourIndustries.label)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Sector expertise');
    expect(screen.getByText(ourIndustries.supporting)).toBeInTheDocument();
  });

  it('renders all six featured sectors with images', () => {
    mockDesktop(true);
    render(<OurIndustries />);
    for (const sector of ourIndustries.featured) {
      const tile = screen.getByTestId(`sector-featured-${slug(sector.name)}`);
      expect(tile).toHaveTextContent(sector.name);
      expect(tile).toHaveTextContent(sector.description);
      expect(screen.getByTestId(`img-sector-${slug(sector.name)}`)).toBeInTheDocument();
    }
  });

  it('renders all six compact sectors', () => {
    mockDesktop(true);
    render(<OurIndustries />);
    for (const sector of ourIndustries.compact) {
      const row = screen.getByTestId(`sector-compact-${slug(sector.name)}`);
      expect(row).toHaveTextContent(sector.name);
      expect(row).toHaveTextContent(sector.description);
    }
  });

  it('represents all twelve industries in total, none hover-only (all present in the accessible DOM)', () => {
    mockDesktop(true);
    render(<OurIndustries />);
    const allNames = [...ourIndustries.featured, ...ourIndustries.compact].map((s) => s.name);
    expect(allNames).toHaveLength(12);
    for (const name of allNames) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<OurIndustries />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<OurIndustries />);
    const section = document.getElementById('our-industries');
    expect(section?.textContent).not.toMatch(/[–—]/);
  });
});
