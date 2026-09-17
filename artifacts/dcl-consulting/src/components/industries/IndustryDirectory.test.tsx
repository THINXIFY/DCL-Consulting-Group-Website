import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { IndustryDirectory } from './IndustryDirectory';
import { industryDirectory } from '@/data/industries-content';

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

describe('IndustryDirectory', () => {
  afterEach(() => vi.restoreAllMocks());

  it('renders the featured sector with its image', () => {
    mockDesktop(true);
    render(<IndustryDirectory />);
    const { featured } = industryDirectory;
    const tile = screen.getByTestId(`sector-featured-${slug(featured.name)}`);
    expect(tile).toHaveTextContent(featured.name);
    expect(tile).toHaveTextContent(featured.description);
    const img = screen.getByTestId(`img-sector-${slug(featured.name)}`);
    expect(img).toHaveAttribute('src', featured.image?.src);
    expect(img).toHaveAttribute('alt', featured.image?.alt);
  });

  it('renders every medium and compact-image sector with its image', () => {
    mockDesktop(true);
    render(<IndustryDirectory />);
    for (const sector of [...industryDirectory.medium, ...industryDirectory.compactImage]) {
      const img = screen.getByTestId(`img-sector-${slug(sector.name)}`);
      expect(img).toHaveAttribute('src', sector.image?.src);
      expect(img).toHaveAttribute('alt', sector.image?.alt);
    }
  });

  it('renders every text-row sector with no image', () => {
    mockDesktop(true);
    render(<IndustryDirectory />);
    for (const sector of industryDirectory.textRows) {
      const row = screen.getByTestId(`sector-text-${slug(sector.name)}`);
      expect(row).toHaveTextContent(sector.name);
      expect(row).toHaveTextContent(sector.description);
      expect(screen.queryByTestId(`img-sector-${slug(sector.name)}`)).not.toBeInTheDocument();
    }
  });

  it('shows all twelve industries across the directory', () => {
    mockDesktop(true);
    render(<IndustryDirectory />);
    const total = 1 + industryDirectory.medium.length + industryDirectory.compactImage.length + industryDirectory.textRows.length;
    expect(total).toBe(12);
  });

  it('does not throw with reduced motion preferred', () => {
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: true,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
    expect(() => render(<IndustryDirectory />)).not.toThrow();
  });

  it('contains no numbering or em-dash characters', () => {
    mockDesktop(true);
    render(<IndustryDirectory />);
    const section = document.getElementById('industry-directory');
    expect(section?.textContent).not.toMatch(/[–—]/);
    expect(section?.textContent).not.toMatch(/\b0?[1-9]\s*\//);
  });
});
